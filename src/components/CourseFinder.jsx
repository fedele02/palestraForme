import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { FINDER_LABEL, FINDER_QUESTIONS } from '../lib/chatContent';
import { MASK, hasProfanity, isOffTopicNote } from '../lib/profanity';

// Questionario "trova il corso giusto" dentro la chat: una domanda alla volta, risposte a tocco.
// Alla fine compone un messaggio con i dati e lo passa a onDone, che lo invia all'assistente.
// I testi scritti a mano con parole volgari vengono scartati (come se non ci fossero): vulgar = true.

// text: quello che riceve l'AI. display: quello che vede il visitatore ("•••" al posto dei testi scartati).
const buildMessage = (answers) => {
  let vulgar = false;
  const clean = (raw) => {
    const t = (raw || '').trim();
    if (t && (hasProfanity(t) || isOffTopicNote(t))) { vulgar = true; return null; } // null = scartato
    return t;
  };

  const lines = FINDER_QUESTIONS.map((q) => {
    const v = answers[q.id];
    if (q.type === 'text') {
      const t = clean(v);
      if (t === null) return { text: null, display: `- ${q.label}: ${MASK}` };
      return t ? `- ${q.label}: ${t}` : null;
    }
    if (Array.isArray(v)) {
      let list = [...v];
      let shown = null;
      if (q.other && list.includes(q.other)) {
        const t = clean(answers[`${q.id}_other`]);
        if (t === null) shown = list.map((o) => (o === q.other ? `${q.other} (${MASK})` : o));
        list = t ? list.map((o) => (o === q.other ? `${q.other} (${t})` : o)) : list.filter((o) => o !== q.other);
      }
      if (!list.length && q.none) list = [q.none];
      if (!list.length) return null;
      const line = `- ${q.label}: ${list.join(', ')}`;
      return shown ? { text: line, display: `- ${q.label}: ${shown.join(', ')}` } : line;
    }
    return v ? `- ${q.label}: ${v}` : null;
  }).filter(Boolean);

  const join = (key) => [`${FINDER_LABEL}.`, ...lines.map((l) => (typeof l === 'string' ? l : l[key])).filter(Boolean)].join('\n');
  return { text: join('text'), display: join('display'), vulgar };
};

const Option = ({ selected, multi, onClick, children }) => (
  <button
    type="button"
    onClick={onClick}
    aria-pressed={selected}
    className={`flex min-h-11 cursor-pointer items-center gap-2 rounded-full border px-4 py-2 text-left text-[0.9375rem] leading-snug transition-colors duration-150 ${
      selected ? 'border-sun bg-sun font-semibold text-ink' : 'border-line text-paper hover:border-sun hover:text-sun'
    }`}
  >
    {multi && selected && <Check size={16} strokeWidth={2.5} aria-hidden="true" />}
    {children}
  </button>
);

export const CourseFinder = ({ onDone, onCancel }) => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const cardRef = useRef(null);
  const titleRef = useRef(null);
  const advanceTimer = useRef(null);

  const q = FINDER_QUESTIONS[step];
  const total = FINDER_QUESTIONS.length;
  const last = step === total - 1;
  const value = answers[q.id];
  const otherKey = `${q.id}_other`;
  const otherOpen = q.other && (value || []).includes(q.other);

  // A ogni domanda: card visibile e focus sul testo della domanda (per chi usa lettori di schermo)
  useEffect(() => {
    cardRef.current?.scrollIntoView({ block: 'nearest' });
    if (step > 0) titleRef.current?.focus({ preventScroll: true });
  }, [step]);
  useEffect(() => () => clearTimeout(advanceTimer.current), []);

  const next = (nextAnswers) => {
    if (last) onDone(buildMessage(nextAnswers));
    else setStep((s) => s + 1);
  };

  // Scelta singola: si passa da soli alla domanda dopo, dopo un attimo per vedere la selezione
  const pickOne = (opt) => {
    const nextAnswers = { ...answers, [q.id]: opt };
    setAnswers(nextAnswers);
    clearTimeout(advanceTimer.current);
    advanceTimer.current = setTimeout(() => next(nextAnswers), 180);
  };

  // Scelta multipla: l'opzione "nessuno" esclude le altre
  const toggle = (opt) => {
    const current = value || [];
    let v;
    if (opt === q.none) v = current.includes(opt) ? [] : [opt];
    else {
      v = current.filter((o) => o !== q.none);
      v = v.includes(opt) ? v.filter((o) => o !== opt) : [...v, opt];
    }
    setAnswers({ ...answers, [q.id]: v });
  };

  const back = () => {
    clearTimeout(advanceTimer.current);
    if (step === 0) onCancel();
    else setStep((s) => s - 1);
  };

  return (
    <section ref={cardRef} aria-label="Trova il corso giusto per te" className="rounded-[8px] border border-sun/40 bg-ink-raised p-4">
      <div className="flex items-center justify-between gap-3 text-sm">
        <p className="font-semibold text-sun">Trova il tuo corso</p>
        <p className="text-mute">Domanda {step + 1} di {total}</p>
      </div>
      <div className="mt-2 h-1 overflow-hidden rounded-full bg-line" aria-hidden="true">
        <div
          className="h-full rounded-full bg-sun transition-[width] duration-300 ease-[var(--ease-out-strong)]"
          style={{ width: `${((step + 1) / total) * 100}%` }}
        />
      </div>

      <p ref={titleRef} tabIndex={-1} className="mt-4 text-base font-semibold leading-snug text-paper focus:outline-none">
        {q.question}
      </p>

      {q.type === 'text' ? (
        <>
          <label htmlFor="finder-note" className="sr-only">{q.question}</label>
          <textarea
            id="finder-note"
            rows={3}
            maxLength={200}
            value={value || ''}
            onChange={(e) => setAnswers({ ...answers, [q.id]: e.target.value })}
            placeholder={q.placeholder}
            className="mt-3 w-full resize-none rounded-[8px] border border-line bg-ink px-4 py-3 text-base leading-snug text-paper placeholder:text-mute focus:border-sun focus:outline-none"
          />
        </>
      ) : (
        <div className="mt-3 flex flex-wrap gap-2">
          {q.options.map((opt) => {
            const selected = q.type === 'many' ? (value || []).includes(opt) : value === opt;
            return (
              <Option key={opt} selected={selected} multi={q.type === 'many'} onClick={() => (q.type === 'many' ? toggle(opt) : pickOne(opt))}>
                {opt}
              </Option>
            );
          })}
        </div>
      )}

      {otherOpen && (
        <>
          <label htmlFor="finder-other" className="sr-only">{q.otherPlaceholder}</label>
          <input
            id="finder-other"
            autoFocus
            maxLength={120}
            value={answers[otherKey] || ''}
            onChange={(e) => setAnswers({ ...answers, [otherKey]: e.target.value })}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); next(answers); } }}
            placeholder={q.otherPlaceholder}
            autoComplete="off"
            enterKeyHint="next"
            className="mt-3 h-11 w-full rounded-full border border-line bg-ink px-4 text-base text-paper placeholder:text-mute focus:border-sun focus:outline-none"
          />
        </>
      )}

      <div className="mt-4 flex items-center justify-between gap-2">
        <button type="button" onClick={back} className="btn btn-ghost min-h-11 cursor-pointer px-4 text-sm">
          {step === 0 ? 'Annulla' : (<><ArrowLeft size={16} strokeWidth={2} aria-hidden="true" />Indietro</>)}
        </button>
        {q.type !== 'one' && (
          <button
            type="button"
            onClick={() => next(answers)}
            disabled={q.type === 'many' && !(value || []).length}
            className="btn btn-sun min-h-11 cursor-pointer px-4 text-sm disabled:cursor-default disabled:opacity-40"
          >
            {last ? 'Trova il mio corso' : 'Avanti'}
            {!last && <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />}
          </button>
        )}
      </div>
    </section>
  );
};
