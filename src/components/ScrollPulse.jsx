import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from 'framer-motion';

// Linea del battito (come quella nel "4" del logo) sul confine tra due sezioni:
// si disegna seguendo lo scorrimento e si ritira se si torna su, con un punto luminoso
// in testa come sul monitor di un elettrocardiogramma: a ogni picco il punto "batte".
//
// Ogni battito è un tracciato ECG vero (onda P, complesso QRS, onda T) con larghezza
// in pixel fissa: su telefono non viene schiacciato in uno zig-zag.
// Coordinate del battito: x da 0 a 1 sulla larghezza del battito, y in unità di ampiezza
// (negativo = verso l'alto, 0 = linea di base).
// Complesso QRS stretto e alto con S profonda: un battito secco, energico.
const BEAT = [
  ['L', 0.1, 0],
  ['Q', 0.17, -0.26, 0.24, 0], // onda P
  ['L', 0.33, 0],
  ['L', 0.365, 0.18], // Q
  ['L', 0.41, -1], // R
  ['L', 0.455, 0.6], // S
  ['L', 0.49, 0],
  ['L', 0.58, 0],
  ['Q', 0.69, -0.46, 0.8, 0], // onda T
  ['L', 1, 0],
];
const R_PEAK_X = 0.41;

// Gruppi di battiti da sinistra a destra: at = centro del gruppo (frazione della larghezza),
// beats = ampiezza di ciascun battito. Su schermi larghi la linea è lunga, quindi più battiti.
const VARIANTS = {
  // Home -> Corsi: battito forte al centro
  double: {
    mobile: [{ at: 0.5, beats: [1, 0.6] }],
    wide: [{ at: 0.17, beats: [0.55] }, { at: 0.5, beats: [1, 0.6] }, { at: 0.83, beats: [0.7, 0.45] }],
  },
  // Corsi -> Offerte: il battito cresce verso destra
  right: {
    mobile: [{ at: 0.72, beats: [1] }],
    wide: [{ at: 0.15, beats: [0.5] }, { at: 0.42, beats: [0.75] }, { at: 0.75, beats: [1, 0.55] }],
  },
  // -> Contatti: il cuore sotto sforzo, battiti che crescono fino al picco
  rise: {
    mobile: [{ at: 0.5, beats: [0.55, 0.8, 1] }],
    wide: [{ at: 0.18, beats: [0.5, 0.65] }, { at: 0.5, beats: [0.8, 0.9] }, { at: 0.8, beats: [1, 1] }],
  },
};

const WIDE_FROM = 1024;
const GUTTER = 16;
const GROUP_GAP = 24;

const buildPath = (variant, width, height) => {
  const groups = width >= WIDE_FROM ? variant.wide : variant.mobile;
  const base = height / 2;
  const amp = height * 0.62; // il picco esce un po' dal riquadro: più slancio
  // Larghezza del battito: compatta su telefono, più ariosa su schermi grandi
  const beatW = Math.min(150, Math.max(84, width * 0.16));

  const px = (x) => x.toFixed(1);
  const parts = [`M0 ${px(base)}`];
  const peaks = [];
  let prevEnd = GUTTER - GROUP_GAP;
  groups.forEach(({ at, beats }) => {
    const groupW = Math.min(beatW * beats.length, width - GUTTER * 2);
    const w = groupW / beats.length;
    // Dentro lo schermo e mai sovrapposto al gruppo precedente
    const start = Math.min(Math.max(width * at - groupW / 2, prevEnd + GROUP_GAP), width - GUTTER - groupW);
    prevEnd = start + groupW;
    parts.push(`H${px(start)}`);
    beats.forEach((scale, i) => {
      const ox = start + i * w;
      const X = (x) => px(ox + x * w);
      const Y = (y) => px(base + y * amp * scale);
      peaks.push({ x: ox + R_PEAK_X * w, scale });
      BEAT.forEach(([cmd, ...v]) => {
        parts.push(cmd === 'Q' ? `Q${X(v[0])} ${Y(v[1])} ${X(v[2])} ${Y(v[3])}` : `L${X(v[0])} ${Y(v[1])}`);
      });
    });
  });
  parts.push(`H${px(width)}`);
  return { d: parts.join(' '), peaks };
};

const EASE_OUT = 'cubic-bezier(0.22, 1, 0.36, 1)';
const DOT_ORIGIN = { transformBox: 'fill-box', transformOrigin: 'center' };

export const ScrollPulse = ({ targetRef, variant = 'double' }) => {
  const box = useRef(null);
  const pathRef = useRef(null);
  const dotRef = useRef(null);
  const haloRef = useRef(null);
  const coreRef = useRef(null);
  const lastX = useRef(0);
  const reduceMotion = useReducedMotion();
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize({ width, height });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // 0 quando la sezione entra dal fondo dello schermo, 1 quando il suo bordo arriva a un terzo dall'alto
  const { scrollYProgress } = useScroll({ target: targetRef, offset: ['start end', 'start 30%'] });
  const pathLength = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.05], [0, 1]);
  const dotOpacity = useTransform(scrollYProgress, [0, 0.04, 0.94, 1], [0, 1, 1, 0]);

  const { d, peaks } = useMemo(
    () => (size.width > 0 ? buildPath(VARIANTS[variant], size.width, size.height) : { d: '', peaks: [] }),
    [variant, size]
  );

  // Il "colpo" del battito: onda che si allarga dal punto, punto che si gonfia, linea che si ispessisce
  const thump = (scale) => {
    const k = 0.5 + scale * 0.5;
    haloRef.current?.animate(
      [{ transform: 'scale(1)', opacity: 0.55 }, { transform: `scale(${2 + 1.6 * k})`, opacity: 0 }],
      { duration: 520, easing: EASE_OUT }
    );
    coreRef.current?.animate(
      [{ transform: 'scale(1)' }, { transform: `scale(${1 + 0.7 * k})`, offset: 0.3 }, { transform: 'scale(1)' }],
      { duration: 360, easing: EASE_OUT }
    );
    pathRef.current?.animate(
      [{ strokeWidth: 3 }, { strokeWidth: 3 + 1.5 * k, offset: 0.3 }, { strokeWidth: 3 }],
      { duration: 360, easing: EASE_OUT }
    );
  };

  // Il punto segue la testa della linea (attributi aggiornati direttamente, niente re-render)
  // e batte quando scorrendo in giù supera un picco
  const moveDot = (p, withBeat = true) => {
    const path = pathRef.current;
    const dot = dotRef.current;
    if (!path || !dot) return;
    const pt = path.getPointAtLength(Math.min(Math.max(p, 0), 1) * path.getTotalLength());
    dot.setAttribute('transform', `translate(${pt.x} ${pt.y})`);
    if (withBeat) {
      const passed = peaks.find((pk) => lastX.current < pk.x && pt.x >= pk.x);
      if (passed) thump(passed.scale);
    }
    lastX.current = pt.x;
  };
  useMotionValueEvent(scrollYProgress, 'change', (p) => moveDot(p));
  useEffect(() => moveDot(scrollYProgress.get(), false), [d, scrollYProgress]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div
      ref={box}
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 top-0 z-10 h-24 -translate-y-1/2 md:h-28"
    >
      {size.width > 0 && (
        <svg
          width={size.width}
          height={size.height}
          viewBox={`0 0 ${size.width} ${size.height}`}
          className="block overflow-visible"
          style={{ filter: 'drop-shadow(0 0 6px rgb(247 232 66 / 0.45))' }}
        >
          <motion.path
            ref={pathRef}
            d={d}
            fill="none"
            stroke="var(--color-sun)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={reduceMotion ? undefined : { pathLength, opacity }}
          />
          {!reduceMotion && (
            <motion.g ref={dotRef} style={{ opacity: dotOpacity }}>
              <circle ref={haloRef} r="9" fill="var(--color-sun)" opacity="0.25" style={DOT_ORIGIN} />
              <circle ref={coreRef} r="4.5" fill="var(--color-sun)" style={DOT_ORIGIN} />
            </motion.g>
          )}
        </svg>
      )}
    </div>
  );
};
