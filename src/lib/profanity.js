// Primo filtro, nel browser, per le parole che sono SEMPRE volgari (parolacce, bestemmie, insulti pesanti):
// - Questionario (campo "Altro" e note): se il testo ne contiene, viene scartato del tutto.
// - Chat libera: vengono tolte solo quelle parole (al loro posto si vede "•••"), il resto della domanda passa.
// In entrambi i casi la risposta si apre con PROFANITY_NOTICE (src/lib/chatContent.js).
//
// Le parole che dipendono dal contesto (es. "gay", "sesso", "palle", "scemo") NON sono qui:
// le valuta l'assistente AI, che distingue una provocazione da una domanda legittima (server/chat.js).
//
// Per aggiungere parole: la radice in STEMS (vale per tutte le parole che iniziano così)
// oppure, per parole corte o che sono anche parte di parole innocue, la parola intera in EXACT.

const STEMS = [
  // volgarità
  'cazz', 'minchi', 'pisell', 'ciol', 'fottut', 'fotter', 'vaffanc', 'fancul', 'stronz', 'merd',
  'puttan', 'troi', 'zoccol', 'pompin', 'bocchin', 'incul', 'scopar', 'scopat', 'trombar', 'sborr',
  'sburr', 'chiavar', 'succhiam', 'ciucciam', 'porn', 'masturb',
  // bestemmie
  'porcodi', 'porcamadon', 'diocan', 'dioporc', 'diobo', 'cristodi', 'mannaggiadi', 'mortacci',
  // insulti pesanti
  'coglion', 'bastard', 'idiot', 'deficient', 'cretin', 'imbecill', 'mongoloid',
  // insulti su orientamento e origine
  'culatt', 'frocio', 'froci', 'ricchion', 'negr',
];

// Parole intere (corte o con un significato innocuo come parte di altre parole)
const EXACT = [
  'culo', 'culi', 'fica', 'fiche', 'figa', 'fighe', 'tette', 'seghe', 'suca',
  'porco dio', 'dio cane', 'porca madonna', 'dio porco',
];

export const MASK = '•••';

// Solo per le note e il campo "Altro" del questionario: lì servono solo informazioni utili a scegliere il corso,
// quindi anche riferimenti a orientamento, identità o sesso vengono scartati (nella chat libera no: lì decide l'AI)
const OFF_TOPIC = [
  'gay', 'gays', 'lesbic', 'omosessual', 'bisessual', 'bisex', 'trans', 'transessual', 'travest', 'queer', 'lgbt',
  'finocch', 'sesso', 'sex', 'sessual', 'nudo', 'nuda', 'nudi', 'arrapat', 'eccitat', 'vergin',
];
const offTopicRe = new RegExp(`(^|[^a-z])(${OFF_TOPIC.join('|')})`);

export const isOffTopicNote = (text) => !!text && offTopicRe.test(normalize(text));

// Radici cercate anche con lettere separate ("c a z z o", "porco.dio")
const SQUASHED = ['cazz', 'minchi', 'stronz', 'puttan', 'coglion', 'vaffanc', 'fancul', 'porcodi', 'porcamadon', 'diocan', 'dioporc'];

// Testo normalizzato: minuscole, senza accenti, "numeri al posto di lettere", lettere ripetute ridotte
const normalize = (text) =>
  text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[0@4]/g, (c) => ({ 0: 'o', '@': 'a', 4: 'a' }[c]))
    .replace(/[1!]/g, 'i')
    .replace(/3/g, 'e')
    .replace(/\$/g, 's')
    .replace(/([a-z])\1{2,}/g, '$1$1');

const stemRe = new RegExp(`(^|[^a-z])(${STEMS.join('|')})`);
const exactRe = new RegExp(`(^|[^a-z])(${EXACT.map((w) => w.replace(/ /g, '[^a-z]*')).join('|')})(?=$|[^a-z])`);

export const hasProfanity = (text) => {
  if (!text) return false;
  const t = normalize(text);
  const squashed = t.replace(/[^a-z]/g, '');
  return stemRe.test(t) || exactRe.test(t) || SQUASHED.some((s) => squashed.includes(s));
};

// Chat libera: toglie le parole volgari (anche a coppie, es. "porco dio") e tiene il resto.
// text: quello che riceve l'AI. masked: quello che vede il visitatore, con "•••" al posto delle parole tolte.
export const stripProfanity = (text) => {
  const words = text.split(/\s+/).filter(Boolean);
  const drop = new Set();
  words.forEach((w, i) => {
    if (hasProfanity(w)) drop.add(i);
    else if (i + 1 < words.length && hasProfanity(`${w} ${words[i + 1]}`) && !hasProfanity(words[i + 1])) {
      drop.add(i);
      drop.add(i + 1);
    }
  });
  // La punteggiatura attaccata a una parola tolta resta (es. "dio," -> "•••,")
  const maskWord = (w) => MASK + (w.match(/[,.;:!?]+$/)?.[0] || '');
  let kept = words.filter((_, i) => !drop.has(i)).join(' ');
  let masked = words.map((w, i) => (drop.has(i) ? maskWord(w) : w)).join(' ');
  // Ultima rete: parole scritte con lettere separate ("c a z z o") non si possono isolare
  if (hasProfanity(kept)) {
    kept = '';
    masked = MASK;
  }
  return {
    text: kept.replace(/\s+([,.;:!?])/g, '$1').replace(/^[\s,.;:!?-]+/, '').trim(),
    masked,
    found: masked !== words.join(' '),
  };
};
