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
  // Danza. Le mani restano fuori dalla testa (stesso giallo)
  waist: { e: [10, 55], h: [19, 59] },
  point: { e: [12, 39], h: [5, 27] },
  // Asciugamano sulla fronte, da un lato all'altro (si usa sul braccio destro)
  wipeA: { e: [10, 34], h: [23, 15] },
  wipeB: { e: [16, 34], h: [39, 16] },
  // Mani sul manubrio della bici da spinning
  grip: { e: [12, 54], h: [15, 44] },
};
export const pose = (name, side) => {
  const p = POSE[name];
  return side === 'L' ? p : { e: [64 - p.e[0], p.e[1]], h: [64 - p.h[0], p.h[1]] };
};

// Tutto il corpo: x, y = spostamento, r = inclinazione in gradi (perno in basso al centro)
export const BODY = {
  still: { x: 0, y: 0, r: 0 },
  bounce: { x: 0, y: -1.5, r: 0 },
  swayL: { x: 0, y: 0, r: -7 },
  swayR: { x: 0, y: 0, r: 7 },
  lunge: { x: -2.5, y: 0, r: -6 },
  rise: { x: 0, y: -2, r: 4 },
  ride: { x: 0, y: -10, r: 0 },
};

// Omino visto di lato (rivolto a sinistra, verso la pagina), per le azioni con side: true.
// Spalle e anca fisse; braccio "lead" = quello davanti, "rear" = quello dietro.
export const SIDE_SHOULDER = { lead: [29, 50], rear: [37, 50] };
export const SIDE_ARMS = {
  guard: { lead: { e: [20, 51], h: [9, 40] }, rear: { e: [27, 56], h: [15, 46] } },
  jab: { lead: { e: [14, 45], h: [-4, 39] }, rear: { e: [27, 56], h: [15, 46] } },
  cross: { lead: { e: [22, 51], h: [12, 45] }, rear: { e: [15, 46], h: [-5, 41] } },
  upper: { lead: { e: [20, 51], h: [9, 40] }, rear: { e: [19, 50], h: [7, 29] } },
};

// L'omino di fronte durante un'azione di lato: si stringe fino a sparire e ricompare alla fine
export const frontTurn = (act) => ({
  scaleX: [1, 0, 0, 1],
  transition: { duration: act.dur, times: [0, act.turn[0], act.turn[1], 1], ease: 'easeInOut' },
});

// Esercizi: dur in secondi; keys = [istante 0-1, posa sinistra, posa destra, faccia, corpo (facoltativo)].
// Esercizi di lato (side: true): keys = [istante, posa braccia SIDE_ARMS, faccia, corpo];
// turn = [quando si gira di lato, quando torna di fronte]. Facce di lato: f = concentrato, k, s, h.
// Faccia: n = normale, s = sforzo, h = soddisfatto (occhi chiusi sorridenti), r = rilassato.
// weights: in quali mani ci sono i manubri. bottle: borraccia nella mano destra (tilt = inclinazione).
// towel: asciugamano nella mano destra. sweat: [inizio, fine] della goccia di sudore. gloves: guantoni rossi.
// bike: bici da spinning vista di fronte, con le gambe che pedalano (sale in sella con il corpo 'ride').
// fx: effetti che compaiono tra t[0] e t[1] in x, y (hit = colpo a segno, note = nota che sale).
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
  // Borraccia e asciugamano partono piano: prima l'oggetto compare nella mano a riposo, poi il braccio si alza
  drink: {
    dur: 3.8,
    bottle: true,
    tilt: [0, 0, -50, -50, 0, 0],
    keys: [[0, 'rest', 'rest', 'n'], [0.14, 'rest', 'rest', 'n'], [0.34, 'rest', 'drink', 'h'], [0.74, 'rest', 'drink', 'h'], [0.9, 'rest', 'rest', 'n'], [1, 'rest', 'rest', 'n']],
  },
  // Si asciuga la fronte con calma: compare la goccia di sudore, poi asciugamano avanti e indietro, rilassato
  towel: {
    dur: 5,
    towel: true,
    sweat: [0.02, 0.34],
    keys: [[0, 'rest', 'rest', 'n'], [0.16, 'rest', 'rest', 'n'], [0.34, 'rest', 'wipeA', 'r'], [0.46, 'rest', 'wipeB', 'r'], [0.58, 'rest', 'wipeA', 'r'], [0.7, 'rest', 'wipeB', 'r'], [0.8, 'rest', 'wipeA', 'r'], [0.92, 'rest', 'rest', 'h'], [1, 'rest', 'rest', 'n']],
  },
  // Danza: mano sul fianco e braccio al cielo, ondeggiando a tempo di musica
  dance: {
    dur: 4,
    fx: [{ el: 'note', x: 6, y: 12, t: [0.1, 0.55] }, { el: 'note', x: 56, y: 8, t: [0.35, 0.85] }],
    keys: [[0, 'rest', 'rest', 'n'], [0.12, 'waist', 'point', 'h', 'swayR'], [0.3, 'point', 'waist', 'h', 'swayL'], [0.48, 'waist', 'point', 'h', 'swayR'], [0.66, 'point', 'waist', 'h', 'swayL'], [0.82, 'wave1', 'wave1', 'h'], [1, 'rest', 'rest', 'n']],
  },
  // Kick boxing di lato, come in un picchiaduro: guardia saltellando, jab, jab, diretto e montante
  fight: {
    dur: 4.8,
    side: true,
    gloves: true,
    turn: [0.07, 0.93],
    sweat: [0.62, 0.9],
    fx: [
      { el: 'hit', x: -10, y: 38, t: [0.27, 0.34] },
      { el: 'hit', x: -10, y: 38, t: [0.46, 0.53] },
      { el: 'hit', x: -12, y: 40, t: [0.56, 0.64] },
      { el: 'hit', x: 5, y: 22, t: [0.76, 0.84] },
    ],
    keys: [[0, 'guard', 'f'], [0.14, 'guard', 'f', 'bounce'], [0.22, 'guard', 'f'], [0.28, 'jab', 'k'], [0.34, 'guard', 'f', 'bounce'], [0.42, 'guard', 'f'], [0.47, 'jab', 'k'], [0.52, 'guard', 'f'], [0.57, 'cross', 'k', 'lunge'], [0.65, 'guard', 'f', 'bounce'], [0.72, 'guard', 's'], [0.77, 'upper', 'k', 'rise'], [0.86, 'guard', 'h'], [1, 'guard', 'h']],
  },
  // Spinning visto di fronte: sale in sella, mani sul manubrio, pedala sempre più forte, poi soddisfatto
  spin: {
    dur: 5.4,
    bike: true,
    sweat: [0.5, 0.86],
    keys: [[0, 'rest', 'rest', 'n'], [0.1, 'grip', 'grip', 'n', 'ride'], [0.36, 'grip', 'grip', 's', 'ride'], [0.82, 'grip', 'grip', 's', 'ride'], [0.9, 'grip', 'grip', 'h', 'ride'], [1, 'rest', 'rest', 'n']],
  },
};
