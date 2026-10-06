import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

// Linea del battito (come quella nel "4" del logo) sul confine tra due sezioni:
// si disegna seguendo lo scorrimento e si ritira se si torna su.
// Ogni variante ha il battito in un punto diverso, così le sezioni non si ripetono identiche.
// Tracciati su 1000 x 100, ricalcolati in pixel per la larghezza reale (niente deformazioni).
const VARIANTS = {
  // due battiti al centro: Home -> Corsi
  double: [
    ['M', 0, 50], ['H', 360], ['L', 385, 50], ['L', 405, 14], ['L', 432, 92], ['L', 458, 22], ['L', 478, 50],
    ['H', 540], ['L', 560, 50], ['L', 574, 30], ['L', 590, 74], ['L', 604, 50], ['H', 1000],
  ],
  // un battito deciso verso destra: Corsi -> Offerte
  right: [
    ['M', 0, 50], ['H', 640], ['L', 662, 50], ['L', 684, 10], ['L', 712, 94], ['L', 738, 30], ['L', 756, 50], ['H', 1000],
  ],
  // tre battiti piccoli a sinistra, come un cuore che rallenta: -> Contatti
  calm: [
    ['M', 0, 50], ['H', 150], ['L', 166, 50], ['L', 180, 22], ['L', 196, 76], ['L', 210, 50],
    ['H', 250], ['L', 264, 50], ['L', 276, 32], ['L', 290, 66], ['L', 302, 50],
    ['H', 340], ['L', 352, 50], ['L', 362, 40], ['L', 372, 58], ['L', 382, 50], ['H', 1000],
  ],
};

const buildPath = (points, width, height) => {
  const sx = width / 1000;
  const sy = height / 100;
  return points.map(([cmd, x, y]) =>
    cmd === 'H' ? `H${(x * sx).toFixed(1)}` : `${cmd}${(x * sx).toFixed(1)} ${(y * sy).toFixed(1)}`
  ).join(' ');
};

export const ScrollPulse = ({ targetRef, variant = 'double' }) => {
  const box = useRef(null);
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

  return (
    <div
      ref={box}
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 top-0 z-10 h-20 -translate-y-1/2 md:h-28"
    >
      {size.width > 0 && (
        <svg width={size.width} height={size.height} viewBox={`0 0 ${size.width} ${size.height}`} className="block overflow-visible">
          <motion.path
            d={buildPath(VARIANTS[variant], size.width, size.height)}
            fill="none"
            stroke="var(--color-sun)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ pathLength, opacity }}
          />
        </svg>
      )}
    </div>
  );
};
