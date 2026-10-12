import { motion } from 'framer-motion';
import { BODY, SIDE_ARMS, SIDE_SHOULDER } from '../lib/mascotActions';

// L'omino visto di lato, rivolto a sinistra (verso la pagina), per le azioni con side: true
// (kick boxing come in un picchiaduro). ChatMascot lo fa "girare": l'omino di fronte
// si stringe fino a sparire e al suo posto si allarga questo, poi al contrario.

export const SUN = 'var(--color-sun)';
export const INK = 'var(--color-ink)';
export const NAVY = '#26305C';
const GLOVE = '#E5484D';

// Stella del colpo a segno
const HIT = Array.from({ length: 16 }, (_, i) => {
  const a = (i * Math.PI) / 8;
  const r = i % 2 ? 2.6 : 6.8;
  return `${(Math.cos(a) * r).toFixed(2)},${(Math.sin(a) * r).toFixed(2)}`;
}).join(' ');

// Effetti attorno all'omino (fx nelle azioni), disegnati attorno all'origine
const FX = {
  hit: () => <polygon points={HIT} fill="#fff" stroke={SUN} strokeWidth="1.3" strokeLinejoin="round" />,
  note: () => (
    <g fill={SUN}>
      <ellipse cx="-1.6" cy="3.4" rx="2.4" ry="1.8" transform="rotate(-20 -1.6 3.4)" />
      <path d="M0.4 3V-5.5l4 1.6v2.2l-2.6-1V3z" />
    </g>
  ),
};

// Compare tra t[0] e t[1]: le note salgono, gli altri effetti scattano e si ingrandiscono
export const FxLayer = ({ act }) => act.fx?.map(({ el, x, y, t: [a, b] }, i) => {
  const Fx = FX[el];
  const rise = el === 'note';
  const q = (b - a) * 0.3;
  return (
    <motion.g
      key={i}
      initial={{ x, y, opacity: 0 }}
      animate={{ opacity: [0, 0, 1, 1, 0], y: rise ? [y, y, y - 2, y - 8, y - 10] : y, scale: rise ? 1 : [0.5, 0.5, 1.2, 1, 0.8] }}
      transition={{ duration: act.dur, times: [0, a, a + q, b - q, b], ease: 'easeOut' }}
    >
      <Fx />
    </motion.g>
  );
});

export const Sweat = ({ act, x = 0 }) => act.sweat && (
  <motion.path
    d={`M${49.5 + x} 14c1.8 3 2.2 4.2 2.2 5a2.2 2.2 0 0 1-4.4 0c0-.8.4-2 2.2-5z`}
    fill="#8FD8F8"
    initial={{ opacity: 0, y: 0 }}
    animate={{ opacity: [0, 0, 1, 1, 0], y: [0, 0, 1, 6, 8] }}
    transition={{ duration: act.dur, times: [0, act.sweat[0], act.sweat[0] + 0.06, act.sweat[1] - 0.04, act.sweat[1]], ease: 'easeIn' }}
  />
);

// Facce di profilo: un occhio, bocca sul bordo sinistro della testa
const SIDE_FACES = {
  f: (
    <>
      <ellipse cx="21" cy="24.5" rx="2.6" ry="3.2" fill={INK} />
      <circle cx="21.8" cy="23.2" r="0.9" fill="#fff" />
      <path d="M15.5 32.5h5" stroke={INK} strokeWidth="1.6" strokeLinecap="round" />
    </>
  ),
  k: (
    <>
      <ellipse cx="21" cy="25" rx="2.3" ry="2.6" fill={INK} />
      <path d="M14.6 30h7a3.5 3.5 0 0 1-7 0z" fill={INK} />
      <ellipse cx="18.1" cy="32.4" rx="1.8" ry="1" fill="#F08A6C" />
    </>
  ),
  s: (
    <>
      <path d="M18.4 22.4l4.4 2.3-4.4 2.3" fill="none" stroke={INK} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="14.8" y="29.6" width="6.4" height="4.2" rx="1.6" fill="#fff" stroke={INK} strokeWidth="1.2" />
      <path d="M18 29.8v3.8" stroke={INK} strokeWidth="0.8" />
    </>
  ),
  h: (
    <>
      <path d="M18 25.5q3-4 6 0" fill="none" stroke={INK} strokeWidth="1.8" strokeLinecap="round" />
      <path d="M14.8 30.2h6.2a3.1 3.1 0 0 1-6.2 0z" fill={INK} />
    </>
  ),
};

const Glove = () => (
  <g>
    <circle r="5" fill={GLOVE} stroke={INK} strokeWidth="0.8" />
    <path d="M1.8-3.4a3.6 3.6 0 0 1 0 6.8" fill="none" stroke="#fff" strokeWidth="1.3" strokeLinecap="round" />
  </g>
);

// I lacci della fascetta che sventolano dietro la testa (come nei picchiaduro).
// Numeri sempre separati da spazi: framer-motion interpola i percorsi numero per numero
const TAILS = [
  ['M 49 12 C 53 10.5 56 13 60 11', 'M 49 12 C 53 13 56 10 60 12.5'],
  ['M 49 14 C 52 16 54.5 15 57.5 18', 'M 49 14 C 52 14.5 55 17 58 16.5'],
];

const armD = (side, p) => `M${SIDE_SHOULDER[side]} L${p.e} L${p.h}`;
const turnTimes = ([a, b]) => [0, a, a + 0.06, b - 0.06, b, 1];
const SHOWN = [0, 0, 1, 1, 0, 0];

export const SideView = ({ act, tr, clipId }) => {
  const { keys } = act;
  const turn = { duration: act.dur, times: turnTimes(act.turn), ease: 'easeInOut' };
  const body = keys.map((k) => BODY[k[3] || 'still']);
  const arms = ['rear', 'lead'].map((side) => {
    const ps = keys.map((k) => SIDE_ARMS[k[1]][side]);
    return { side, d: ps.map((p) => armD(side, p)), x: ps.map((p) => p.h[0]), y: ps.map((p) => p.h[1]) };
  });
  const faceOp = (f) => keys.map((k) => (k[2] === f ? 1 : 0));
  const faces = Object.keys(SIDE_FACES).filter((f) => keys.some((k) => k[2] === f));

  const armEls = arms.map(({ side, d, x, y }) => (
    <g key={side}>
      <motion.path
        fill="none" stroke={SUN} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"
        initial={{ d: d[0] }} animate={{ d }} transition={tr}
      />
      <motion.g initial={{ x: x[0], y: y[0] }} animate={{ x, y }} transition={tr}><Glove /></motion.g>
    </g>
  ));

  return (
    <motion.g style={{ originX: 0.5, originY: 1 }} initial={{ scaleX: 0 }} animate={{ scaleX: SHOWN }} transition={turn}>
      <motion.g
        initial={{ x: 0, y: 0, rotate: 0 }}
        animate={{ x: body.map((b) => b.x), y: body.map((b) => b.y), rotate: body.map((b) => b.r) }}
        transition={tr}
        style={{ originX: 0.5, originY: 1 }}
      >
        {/* Maglietta di profilo, con la cucitura gialla sul fianco */}
        <path d="M23.5 64v-8.5c0-6.5 3.5-11 9-11s9.5 4.5 9.5 11V64" fill={NAVY} stroke={SUN} strokeWidth="1.5" />
        <path d="M34 47v16" stroke={SUN} strokeWidth="1" strokeLinecap="round" opacity="0.8" />

        {/* Testa di profilo */}
        <circle cx="32" cy="24" r="18" fill={SUN} />
        <path d="M33 7.5c-1-2.5-3.5-3.5-5.5-2.5 1.5.5 2 1.5 2 2.5" fill={SUN} />
        <clipPath id={clipId}>
          <circle cx="32" cy="24" r="18" />
        </clipPath>
        <g clipPath={`url(#${clipId})`}>
          <rect x="12" y="10" width="40" height="6.5" fill={INK} />
          <path d="M12 13.3h20l1.5-2 2 4.4 2.4-4.8 1.5 2.4h12.5" fill="none" stroke={SUN} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
        </g>
        {TAILS.map(([a, b]) => (
          <g key={a}>
            <motion.path initial={{ d: a }} fill="none" stroke={SUN} strokeWidth="3.8" strokeLinecap="round" animate={{ d: [a, b] }} transition={{ duration: 0.45, repeat: Infinity, repeatType: 'mirror' }} />
            <motion.path initial={{ d: a }} fill="none" stroke={INK} strokeWidth="2" strokeLinecap="round" animate={{ d: [a, b] }} transition={{ duration: 0.45, repeat: Infinity, repeatType: 'mirror' }} />
          </g>
        ))}
        <circle cx="49.5" cy="13" r="2.2" fill={INK} stroke={SUN} strokeWidth="1" />
        {/* Sopracciglio deciso (non sulla faccia felice) e guancia */}
        <motion.path d="M16 19.6l7.6 2.2" stroke={INK} strokeWidth="1.7" strokeLinecap="round" initial={{ opacity: 1 }} animate={{ opacity: faceOp('h').map((v) => 1 - v) }} transition={tr} />
        <ellipse cx="25.5" cy="30" rx="2.6" ry="1.8" fill="#F08A6C" opacity="0.8" />
        {faces.map((f) => (
          <motion.g key={f} initial={{ opacity: keys[0][2] === f ? 1 : 0 }} animate={{ opacity: faceOp(f) }} transition={tr}>
            {SIDE_FACES[f]}
          </motion.g>
        ))}
        <Sweat act={act} x={-2} />

        {armEls}
        <FxLayer act={act} />
      </motion.g>
    </motion.g>
  );
};
