import { useId } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ACTIONS, SHOULDER, pose } from '../lib/mascotActions';

// L'omino dell'assistente: un piccolo coach dalla testa grande (stile "chibi"), con la fascetta del battito
// e la maglietta blu ForMe con il logo 4ME giallo. È "vivo": sbatte gli occhi, dondola la testa
// e ogni tanto fa un esercizio da sala pesi (vedi ACTIONS), con la faccia che cambia:
// sotto sforzo stringe gli occhi e i denti, si arrossa e suda; a fine serie è soddisfatto.
// action: { name, n } — n cambia a ogni nuova esecuzione (anche dello stesso esercizio). Null = fermo.
// Con riduzione movimento resta fermo.

const SUN = 'var(--color-sun)';
const INK = 'var(--color-ink)';
const NAVY = '#26305C';
const armPath = (side, p) => `M${SHOULDER[side]} L${p.e} L${p.h}`;
const CHEEK = { n: 0.55, s: 0.95, h: 0.7 };

// Manubrio e borraccia sono disegnati attorno all'origine: vengono spostati nella mano
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

// Le facce: si passa dall'una all'altra con l'opacità, seguendo i tempi dell'esercizio
const NormalFace = ({ blink }) => (
  <>
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

export const ChatMascot = ({ size = 64, action = null, idle = true, className = '' }) => {
  const reduceMotion = useReducedMotion();
  const clipId = `mascot-head-${useId().replace(/:/g, '')}`;
  const live = idle && !reduceMotion;
  const act = live && action ? ACTIONS[action.name] : null;

  // Tracce dell'esercizio: tutte con gli stessi istanti, così mani, attrezzi e faccia restano sincronizzati
  const times = act?.keys.map((k) => k[0]);
  const tr = act && { duration: act.dur, times, ease: 'easeInOut' };
  const sides = act
    ? ['L', 'R'].map((side) => {
      const ps = act.keys.map((k) => pose(k[side === 'L' ? 1 : 2], side));
      return { side, d: ps.map((p) => armPath(side, p)), x: ps.map((p) => p.h[0]), y: ps.map((p) => p.h[1]) };
    })
    : null;
  const faceOp = (f) => act.keys.map((k) => (k[3] === f ? 1 : 0));
  const propOp = act?.keys.map((_, i) => (i === 0 || i === act.keys.length - 1 ? 0 : 1));

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      aria-hidden="true"
      className={`overflow-visible ${className}`}
    >
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

        {act ? (
          <g key={action.n}>
            {['21.5', '42.5'].map((cx) => (
              <motion.ellipse
                key={cx} cx={cx} cy="30" rx="3" ry="2" fill="#F08A6C"
                initial={{ opacity: CHEEK.n }}
                animate={{ opacity: act.keys.map((k) => CHEEK[k[3]]) }}
                transition={tr}
              />
            ))}
            <motion.g initial={{ opacity: 1 }} animate={{ opacity: faceOp('n') }} transition={tr}><NormalFace blink /></motion.g>
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: faceOp('s') }} transition={tr}><StrainFace /></motion.g>
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: faceOp('h') }} transition={tr}><HappyFace /></motion.g>
            {act.sweat && (
              <motion.path
                d="M49.5 14c1.8 3 2.2 4.2 2.2 5a2.2 2.2 0 0 1-4.4 0c0-.8.4-2 2.2-5z"
                fill="#8FD8F8"
                initial={{ opacity: 0, y: 0 }}
                animate={{ opacity: [0, 0, 1, 1, 0], y: [0, 0, 1, 6, 8] }}
                transition={{ duration: act.dur, times: [0, act.sweat[0], act.sweat[0] + 0.06, act.sweat[1] - 0.04, act.sweat[1]], ease: 'easeIn' }}
              />
            )}
          </g>
        ) : (
          <>
            <ellipse cx="21.5" cy="30" rx="3" ry="2" fill="#F08A6C" opacity={CHEEK.n} />
            <ellipse cx="42.5" cy="30" rx="3" ry="2" fill="#F08A6C" opacity={CHEEK.n} />
            <NormalFace blink={live} />
          </>
        )}
      </motion.g>

      {/* Braccia (davanti, così possono portare la borraccia alla bocca) con attrezzi in mano */}
      {act ? (
        <g key={action.n}>
          {sides.map(({ side, d, x, y }) => (
            <g key={side}>
              <motion.path
                fill="none" stroke={SUN} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"
                initial={{ d: d[0] }} animate={{ d }} transition={tr}
              />
              {act.weights?.includes(side) && (
                <motion.g initial={{ x: x[0], y: y[0], opacity: 0 }} animate={{ x, y, opacity: propOp }} transition={tr}>
                  <Dumbbell />
                </motion.g>
              )}
              {act.bottle && side === 'R' && (
                <motion.g initial={{ x: x[0], y: y[0], opacity: 0 }} animate={{ x, y, opacity: propOp }} transition={tr}>
                  <motion.g initial={{ rotate: 0 }} animate={{ rotate: act.tilt }} transition={tr}>
                    <Bottle />
                  </motion.g>
                </motion.g>
              )}
              <motion.circle r="3.6" fill={SUN} initial={{ cx: x[0], cy: y[0] }} animate={{ cx: x, cy: y }} transition={tr} />
            </g>
          ))}
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
    </svg>
  );
};
