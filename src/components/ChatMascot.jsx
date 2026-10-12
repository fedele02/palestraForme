import { useEffect, useId, useRef } from 'react';
import { motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion';
import { ACTIONS, BODY, SHOULDER, frontTurn, pose } from '../lib/mascotActions';
import { FxLayer, INK, NAVY, SUN, SideView, Sweat } from './MascotSide';

// L'omino dell'assistente: un piccolo coach dalla testa grande (stile "chibi"), con la fascetta del battito
// e la maglietta blu ForMe con il logo 4ME giallo. È "vivo": sbatte gli occhi, dondola la testa
// segue il puntatore con gli occhi e ogni tanto fa un'attività dei corsi della palestra (vedi ACTIONS):
// pesi, spinning, danza, asciugamano e borraccia; per la kick boxing si gira di lato (MascotSide.jsx). La faccia cambia:
// sotto sforzo stringe gli occhi e i denti, si arrossa e suda; a fine serie è soddisfatto.
// action: { name, n } — n cambia a ogni nuova esecuzione (anche dello stesso esercizio). Null = fermo.
// Con riduzione movimento resta fermo.

const armPath = (side, p) => `M${SHOULDER[side]} L${p.e} L${p.h}`;
const CHEEK = { n: 0.55, s: 0.95, h: 0.7, r: 0.8 };

// Manubrio, borraccia e asciugamano sono disegnati attorno all'origine: vengono spostati nella mano
const Dumbbell = () => (
  <g>
    <line x1="-6" y1="0" x2="6" y2="0" stroke="#C9CEDD" strokeWidth="1.8" strokeLinecap="round" />
    <rect x="-8" y="-3.8" width="3" height="7.6" rx="1" fill={NAVY} stroke={SUN} strokeWidth="1" />
    <rect x="5" y="-3.8" width="3" height="7.6" rx="1" fill={NAVY} stroke={SUN} strokeWidth="1" />
  </g>
);
const Bottle = () => (
  <g>
    <rect x="-2.8" y="-6" width="5.6" height="12" rx="1.6" fill="#8FD8F8" stroke={INK} strokeWidth="0.8" />
    <rect x="-1.8" y="-8.6" width="3.6" height="2.8" rx="0.6" fill={SUN} stroke={INK} strokeWidth="0.6" />
  </g>
);

const Towel = () => (
  <g transform="rotate(-10)">
    <path d="M-10-5.5h20l-1 4 1 4-1 4 1 4h-20l1-4-1-4 1-4z" fill="#F4F1E8" stroke={INK} strokeWidth="0.8" strokeLinejoin="round" />
    <path d="M-9.6-1.5h19.2M-9.6 6.5h19.2" stroke="#8FD8F8" strokeWidth="1.6" />
  </g>
);

// Bici da spinning vista di fronte: dietro le gambe il volano (di taglio) e la base, davanti il manubrio.
// Le gambe spuntano dalla maglietta e pedalano a turno, una su e una giù.
const STEEL = '#C9CEDD';
const PEDAL = { duration: 0.32, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' };
const LEG_UP = { d: 'M 27 61 L 24 65 L 26 73', f: 73 };
const LEG_DOWN = { d: 'M 27 61 L 25.5 70 L 27 80', f: 80 };
const mirror = (d) => d.replace(/(M|L) ([\d.]+)/g, (_, c, x) => `${c} ${64 - x}`);
const BikeBack = () => (
  <g>
    <path d="M20 83h24M32 46v18" stroke={STEEL} strokeWidth="2.6" strokeLinecap="round" />
    <rect x="29.5" y="63" width="5" height="18" rx="2.5" fill={NAVY} stroke={SUN} strokeWidth="1.2" />
    <motion.path d="M30.5 66h3" stroke={SUN} strokeWidth="1.2" initial={{ y: 0 }} animate={{ y: 12 }} transition={{ duration: 0.3, repeat: Infinity, ease: 'linear' }} />
    {[[LEG_UP, LEG_DOWN, (d) => d, 27], [LEG_DOWN, LEG_UP, mirror, 37]].map(([a, b, m, x]) => (
      <g key={x}>
        <motion.path
          fill="none" stroke={SUN} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"
          initial={{ d: m(a.d) }} animate={{ d: [m(a.d), m(b.d)] }} transition={PEDAL}
        />
        <motion.ellipse
          cx={x < 32 ? 26 : 38} rx="3.4" ry="2.2" fill={NAVY} stroke={SUN} strokeWidth="1"
          initial={{ cy: a.f }} animate={{ cy: [a.f, b.f] }} transition={PEDAL}
        />
      </g>
    ))}
  </g>
);
// Manubrio a corna di bue: barra tra il colletto e il logo, punte che salgono alle mani; bordo scuro per staccarlo
const HANDLEBAR = 'M15 43.5Q15.5 48.5 20.5 48.5H43.5Q48.5 48.5 49 43.5';
const Handlebar = () => (
  <g fill="none" strokeLinecap="round">
    <path d={HANDLEBAR} stroke={INK} strokeWidth="4.6" />
    <path d={HANDLEBAR} stroke={STEEL} strokeWidth="2.6" />
  </g>
);

// Le facce: si passa dall'una all'altra con l'opacità, seguendo i tempi dell'esercizio
const NormalFace = ({ blink, look }) => (
  <>
    <motion.g style={look}>
    <motion.g
      style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
      animate={blink ? { scaleY: [1, 1, 0.1, 1] } : { scaleY: 1 }}
      transition={blink ? { duration: 4.2, times: [0, 0.92, 0.96, 1], repeat: Infinity } : undefined}
    >
      <ellipse cx="25.5" cy="24.5" rx="3" ry="3.6" fill={INK} />
      <ellipse cx="38.5" cy="24.5" rx="3" ry="3.6" fill={INK} />
      <circle cx="26.6" cy="23.1" r="1.1" fill="#fff" />
      <circle cx="39.6" cy="23.1" r="1.1" fill="#fff" />
    </motion.g>
    </motion.g>
    <path d="M28.5 30.5h7a3.5 3.5 0 0 1-7 0z" fill={INK} />
    <ellipse cx="32" cy="32.9" rx="1.9" ry="1.05" fill="#F08A6C" />
  </>
);
const StrainFace = () => (
  <g fill="none" stroke={INK} strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 19.6l5.2 1.6M42 19.6l-5.2 1.6" strokeWidth="1.6" />
    <path d="M22.5 22.2l4.6 2.4-4.6 2.4M41.5 22.2l-4.6 2.4 4.6 2.4" strokeWidth="1.9" />
    <rect x="27" y="29" width="10" height="4.6" rx="2" fill="#fff" strokeWidth="1.4" />
    <path d="M27.4 31.3h9.2M30.3 29.3v4M33.7 29.3v4" strokeWidth="0.8" />
  </g>
);
const HappyFace = () => (
  <>
    <path d="M22.5 25.5q3-4 6 0M35.5 25.5q3-4 6 0" fill="none" stroke={INK} strokeWidth="1.9" strokeLinecap="round" />
    <path d="M27.5 29.8h9a4.5 4.5 0 0 1-9 0z" fill={INK} />
    <ellipse cx="32" cy="32.8" rx="2.3" ry="1.2" fill="#F08A6C" />
  </>
);


// Gli occhi seguono il puntatore (solo con mouse/trackpad), al massimo di poco più di un millimetro
const useLook = (ref, active) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 120, damping: 18 });
  const sy = useSpring(y, { stiffness: 120, damping: 18 });
  useEffect(() => {
    if (!active || !window.matchMedia('(pointer: fine)').matches) return undefined;
    const onMove = (e) => {
      const r = ref.current?.getBoundingClientRect();
      if (!r) return;
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height * 0.38);
      const d = Math.hypot(dx, dy) || 1;
      const k = Math.min(1, d / 160);
      x.set((dx / d) * 1.6 * k);
      y.set((dy / d) * 1.3 * k);
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => { window.removeEventListener('pointermove', onMove); x.set(0); y.set(0); };
  }, [active, ref, x, y]);
  return { x: sx, y: sy };
};
// Rilassato (asciugamano): occhi chiusi distesi e un mezzo sorriso tranquillo
const RelaxFace = () => (
  <g fill="none" stroke={INK} strokeWidth="1.8" strokeLinecap="round">
    <path d="M22.5 24q3 2.4 6 0M35.5 24q3 2.4 6 0" />
    <path d="M29 30.6q3 2.2 6 0" />
  </g>
);

export const ChatMascot = ({ size = 64, action = null, idle = true, className = '' }) => {
  const reduceMotion = useReducedMotion();
  const clipId = `mascot-head-${useId().replace(/:/g, '')}`;
  const live = idle && !reduceMotion;
  const act = live && action ? ACTIONS[action.name] : null;
  // front = esercizio fatto di fronte; con le azioni di lato l'omino di fronte resta fermo e si gira
  const front = act && !act.side ? act : null;
  const svgRef = useRef(null);
  const look = useLook(svgRef, live);

  // Tracce dell'esercizio: tutte con gli stessi istanti, così mani, attrezzi e faccia restano sincronizzati
  const times = act?.keys.map((k) => k[0]);
  const tr = act && { duration: act.dur, times, ease: 'easeInOut' };
  const sides = front
    ? ['L', 'R'].map((side) => {
      const ps = front.keys.map((k) => pose(k[side === 'L' ? 1 : 2], side));
      return { side, d: ps.map((p) => armPath(side, p)), x: ps.map((p) => p.h[0]), y: ps.map((p) => p.h[1]) };
    })
    : null;
  const faceOp = (f) => front.keys.map((k) => (k[3] === f ? 1 : 0));
  const propOp = front?.keys.map((_, i) => (i === 0 || i === front.keys.length - 1 ? 0 : 1));
  const body = front?.keys.map((k) => BODY[k[4] || 'still']);

  return (
    <svg
      ref={svgRef}
      width={size}
      height={size}
      viewBox="0 0 64 64"
      aria-hidden="true"
      className={`overflow-visible ${className}`}
    >
      {/* Tutto il corpo: saltelli, ondeggiamenti, in sella alla bici (perno in basso al centro) */}
      <motion.g
        style={{ originX: 0.5, originY: 1 }}
        initial={{ x: 0, y: 0, rotate: 0, scaleX: 1 }}
        animate={
          front ? { x: body.map((b) => b.x), y: body.map((b) => b.y), rotate: body.map((b) => b.r) }
            : act ? frontTurn(act) : { x: 0, y: 0, rotate: 0, scaleX: 1 }
        }
        transition={front ? tr : { duration: 0.3 }}
      >
      {front?.bike && (
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: propOp }} transition={tr}><BikeBack /></motion.g>
      )}
      {/* Maglietta ForMe: blu con bordo e logo gialli */}
      <path d="M19.5 64v-8.5c0-7 5.5-11.5 12.5-11.5s12.5 4.5 12.5 11.5V64" fill={NAVY} stroke={SUN} strokeWidth="1.5" />
      <path d="M28 44.8q4 3 8 0" fill="none" stroke={SUN} strokeWidth="1.5" strokeLinecap="round" />
      <text x="32" y="58.5" textAnchor="middle" fill={SUN} style={{ fontSize: 8, fontWeight: 800, fontStretch: '62%', letterSpacing: '0.03em' }}>
        4ME
      </text>

      {/* Testa, con un leggero dondolio */}
      <motion.g
        animate={live ? { y: [0, -1.2, 0] } : { y: 0 }}
        transition={live ? { duration: 2.6, repeat: Infinity, ease: 'easeInOut' } : undefined}
      >
        <circle cx="32" cy="24" r="18" fill={SUN} />
        {/* Ciuffo che esce dalla fascetta */}
        <path d="M29 7.5c1-2.5 3.5-3.5 5.5-2.5-1.5.5-2 1.5-2 2.5" fill={SUN} />
        {/* Fascetta con il battito */}
        <clipPath id={clipId}>
          <circle cx="32" cy="24" r="18" />
        </clipPath>
        <g clipPath={`url(#${clipId})`}>
          <rect x="12" y="10" width="40" height="6.5" fill={INK} />
          <path d="M12 13.3h12.5l1.5-2.4 2.4 4.8 2-4.4 1.5 2h20" fill="none" stroke={SUN} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
        </g>

        {front ? (
          <g key={action.n}>
            {['21.5', '42.5'].map((cx) => (
              <motion.ellipse
                key={cx} cx={cx} cy="30" rx="3" ry="2" fill="#F08A6C"
                initial={{ opacity: CHEEK.n }}
                animate={{ opacity: front.keys.map((k) => CHEEK[k[3]]) }}
                transition={tr}
              />
            ))}
            <motion.g initial={{ opacity: 1 }} animate={{ opacity: faceOp('n') }} transition={tr}><NormalFace blink look={look} /></motion.g>
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: faceOp('s') }} transition={tr}><StrainFace /></motion.g>
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: faceOp('h') }} transition={tr}><HappyFace /></motion.g>
            {front.keys.some((k) => k[3] === 'r') && (
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: faceOp('r') }} transition={tr}><RelaxFace /></motion.g>
            )}
            <Sweat act={front} />
          </g>
        ) : (
          <>
            <ellipse cx="21.5" cy="30" rx="3" ry="2" fill="#F08A6C" opacity={CHEEK.n} />
            <ellipse cx="42.5" cy="30" rx="3" ry="2" fill="#F08A6C" opacity={CHEEK.n} />
            <NormalFace blink={live} look={look} />
          </>
        )}
      </motion.g>

      {/* Braccia (davanti, così possono portare la borraccia alla bocca) con attrezzi in mano */}
      {front ? (
        <g key={action.n}>
          {front.bike && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: propOp }} transition={tr}><Handlebar /></motion.g>
          )}
          {sides.map(({ side, d, x, y }) => (
            <g key={side}>
              <motion.path
                fill="none" stroke={SUN} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"
                initial={{ d: d[0] }} animate={{ d }} transition={tr}
              />
              {front.weights?.includes(side) && (
                <motion.g initial={{ x: x[0], y: y[0], opacity: 0 }} animate={{ x, y, opacity: propOp }} transition={tr}>
                  <Dumbbell />
                </motion.g>
              )}
              {front.bottle && side === 'R' && (
                <motion.g initial={{ x: x[0], y: y[0], opacity: 0 }} animate={{ x, y, opacity: propOp }} transition={tr}>
                  <motion.g initial={{ rotate: 0 }} animate={{ rotate: front.tilt }} transition={tr}>
                    <Bottle />
                  </motion.g>
                </motion.g>
              )}
              {front.towel && side === 'R' && (
                <motion.g initial={{ x: x[0], y: y[0], opacity: 0 }} animate={{ x, y, opacity: propOp }} transition={tr}>
                  <Towel />
                </motion.g>
              )}
              <motion.circle r="3.6" fill={SUN} initial={{ cx: x[0], cy: y[0] }} animate={{ cx: x, cy: y }} transition={tr} />
            </g>
          ))}
          <FxLayer act={front} />
        </g>
      ) : (
        ['L', 'R'].map((side) => {
          const p = pose('rest', side);
          return (
            <g key={side}>
              <path d={armPath(side, p)} fill="none" stroke={SUN} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx={p.h[0]} cy={p.h[1]} r="3.6" fill={SUN} />
            </g>
          );
        })
      )}
      </motion.g>

      {act?.side && <SideView key={action.n} act={act} tr={tr} clipId={`${clipId}-side`} />}
    </svg>
  );
};
