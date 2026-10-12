// Testi dell'assistente AI (Coach ForMe): si possono modificare liberamente qui.
// Usati dal widget della chat (src/components/ChatWidget.jsx) e, per l'avviso, dal server (server/chat.js).

// Domanda che avvia il questionario guidato "trova il corso giusto"
export const FINDER_LABEL = 'Aiutami a scegliere il corso migliore per me';

// Fumetto dell'omino (telefono e PC): i messaggi passano una volta per visita. finder: true = toccandolo parte il questionario
export const TIPS = [
  { text: 'Ciao! Sono il coach AI di ForMe: chiedimi quello che vuoi' },
  { text: 'Non sai quale corso scegliere? Ti aiuto io in un minuto', finder: true },
  { text: 'Corsi, orari, offerte: chiedi pure' },
  // L'ultimo: dopo questo l'omino comincia ad allenarsi (ChatWidget)
  { text: "Dai un'occhiata al sito, io resto qui ad allenarmi. Per qualsiasi cosa chiedi pure" },
];

// Domande pronte nella chat (la prima è il questionario guidato)
export const SUGGESTIONS = [
  'Che corsi ci sono?',
  'Avete offerte adesso?',
  'Dove siete e quando aprite?',
];

// Primo messaggio della chat
export const WELCOME =
  'Ciao! Sono il coach virtuale di ForMe. Raccontami il tuo obiettivo o un fastidio (per esempio il mal di schiena) e ti consiglio i corsi più adatti. Posso dirti anche orari, offerte e come raggiungerci.';

// Frase che l'assistente aggiunge in fondo a ogni consiglio
export const DISCLAIMER =
  'Ricorda: sono un assistente virtuale e i miei consigli sono indicativi. Per un percorso su misura parla con i nostri istruttori in palestra.';

// Se un testo contiene parolacce, bestemmie, insulti o provocazioni, quelle parti vengono scartate
// e la risposta si apre con questa frase (l'elenco delle parole è in src/lib/profanity.js)
export const PROFANITY_NOTICE = 'Ho notato parole volgari o fuori luogo: ti rispondo senza tenere conto di quello che hai scritto.';
// Se dopo il filtro non resta niente da chiedere
export const PROFANITY_EMPTY = 'Scrivimi pure la tua domanda su corsi, orari, offerte o su come scegliere il corso giusto.';

// Questionario guidato. type: 'one' = una scelta, 'many' = più scelte, 'text' = testo libero facoltativo.
// none: l'opzione che esclude le altre (es. "Nessuno"). other: l'opzione che apre un campo da scrivere.
export const FINDER_QUESTIONS = [
  {
    id: 'age',
    label: 'Età',
    question: 'Quanti anni hai?',
    type: 'one',
    options: ['Meno di 14', '14-17', '18-29', '30-44', '45-59', '60 o più'],
  },
  {
    id: 'sex',
    label: 'Sesso',
    question: 'Sei…',
    type: 'one',
    options: ['Donna', 'Uomo', 'Preferisco non dirlo'],
  },
  {
    id: 'goal',
    label: 'Obiettivo',
    question: 'Cosa vuoi ottenere? Puoi sceglierne più di uno',
    type: 'many',
    options: ['Dimagrire', 'Tonificare', 'Più forza', 'Postura e schiena', 'Scaricare lo stress', 'Divertirmi e conoscere gente', 'Imparare a difendermi'],
  },
  {
    id: 'level',
    label: 'Livello',
    question: 'Quanto ti alleni adesso?',
    type: 'one',
    options: ['Parto da zero', 'Ogni tanto', 'Con costanza'],
  },
  {
    id: 'limits',
    label: 'Dolori o limitazioni',
    question: 'Hai dolori o limitazioni?',
    type: 'many',
    none: 'Nessuno',
    // Scegliendo "Altro" compare un campo per scrivere il dolore o la limitazione
    other: 'Altro',
    otherPlaceholder: 'Scrivi quale dolore o limitazione hai',
    options: ['Nessuno', 'Schiena', 'Collo e spalle', 'Ginocchia', 'Molti chili da perdere', 'Altro'],
  },
  {
    id: 'likes',
    label: 'Preferenze',
    question: 'Cosa ti piace di più?',
    type: 'many',
    none: 'Non so, consigliami tu',
    options: ['Musica e ballo', 'Alta intensità', 'Attività dolci', 'Volare (discipline aeree)', 'Arti marziali', 'Non so, consigliami tu'],
  },
  {
    id: 'days',
    label: 'Volte a settimana',
    question: 'Quante volte a settimana puoi venire?',
    type: 'one',
    options: ['1-2 volte', '3 volte', '4 o più'],
  },
  {
    id: 'note',
    label: 'Note',
    question: 'Vuoi aggiungere altro?',
    type: 'text',
    placeholder: 'Facoltativo. Es. posso solo la sera, ho avuto un infortunio al ginocchio…',
  },
];
