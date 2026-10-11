// Esercizi dell'omino (src/components/ChatMascot.jsx): pose delle braccia e tempi.
// Si possono aggiungere esercizi nuovi qui e metterli in IDLE_ACTIONS in ChatWidget.jsx.

// Pose delle braccia viste dal lato sinistro dello schermo: e = gomito, h = mano. Il destro è speculare.
export const SHOULDER = { L: [22, 51], R: [42, 51] };
const POSE = {
  rest: { e: [18, 57], h: [16, 62] },
  flex: { e: [8, 48], h: [9, 36] },
  flex2: { e: [8, 49], h: [10, 38.5] },
  rack: { e: [10, 52], h: [10, 40] },
  press: { e: [11, 34], h: [10, 17] },
  curlDown: { e: [17, 58], h: [10, 62] },
  curlUp: { e: [17, 58], h: [14, 45] },
  wave1: { e: [12, 47], h: [8, 36] },
  wave2: { e: [12, 47], h: [14, 35] },
  drink: { e: [16, 50], h: [24, 37] },
};
export const pose = (name, side) => {
  const p = POSE[name];
  return side === 'L' ? p : { e: [64 - p.e[0], p.e[1]], h: [64 - p.h[0], p.h[1]] };
};

// Esercizi: dur in secondi; keys = [istante 0-1, posa sinistra, posa destra, faccia].
// Faccia: n = normale, s = sforzo, h = soddisfatto (occhi chiusi sorridenti).
// weights: in quali mani ci sono i manubri. bottle: borraccia nella mano destra (tilt = inclinazione).
// sweat: [inizio, fine] della goccia di sudore.
export const ACTIONS = {
  flex: {
    dur: 2.6,
    keys: [[0, 'rest', 'rest', 'n'], [0.2, 'flex', 'flex', 'h'], [0.36, 'flex2', 'flex2', 'h'], [0.5, 'flex', 'flex', 'h'], [0.64, 'flex2', 'flex2', 'h'], [0.8, 'flex', 'flex', 'h'], [1, 'rest', 'rest', 'n']],
  },
  wave: {
    dur: 1.8,
    keys: [[0, 'rest', 'rest', 'n'], [0.2, 'rest', 'wave1', 'n'], [0.4, 'rest', 'wave2', 'n'], [0.6, 'rest', 'wave1', 'n'], [0.8, 'rest', 'wave2', 'n'], [1, 'rest', 'rest', 'n']],
  },
  press: {
    dur: 4.4,
    weights: ['L', 'R'],
    sweat: [0.45, 0.85],
    keys: [[0, 'rest', 'rest', 'n'], [0.1, 'rack', 'rack', 's'], [0.22, 'press', 'press', 's'], [0.34, 'rack', 'rack', 's'], [0.46, 'press', 'press', 's'], [0.58, 'rack', 'rack', 's'], [0.72, 'press', 'press', 's'], [0.84, 'rack', 'rack', 'h'], [0.93, 'rest', 'rest', 'h'], [1, 'rest', 'rest', 'n']],
  },
  curl: {
    dur: 3.8,
    weights: ['R'],
    sweat: [0.5, 0.88],
    keys: [[0, 'rest', 'rest', 'n'], [0.12, 'rest', 'curlDown', 's'], [0.26, 'rest', 'curlUp', 's'], [0.4, 'rest', 'curlDown', 's'], [0.54, 'rest', 'curlUp', 's'], [0.68, 'rest', 'curlDown', 's'], [0.8, 'rest', 'curlUp', 's'], [0.9, 'rest', 'rest', 'h'], [1, 'rest', 'rest', 'n']],
  },
  drink: {
    dur: 3.4,
    bottle: true,
    tilt: [0, -50, -50, 0, 0],
    keys: [[0, 'rest', 'rest', 'n'], [0.22, 'rest', 'drink', 'h'], [0.72, 'rest', 'drink', 'h'], [0.9, 'rest', 'rest', 'n'], [1, 'rest', 'rest', 'n']],
  },
};
