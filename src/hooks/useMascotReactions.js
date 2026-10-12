import { useEffect, useRef } from 'react';

// Reazioni dell'omino dell'assistente al sito: se il visitatore smette di scorrere e resta fermo su un corso
// (le schede con data-mascot = tipo di corso, vedi CoursesSection) per DWELL_MS, chiama onReact con l'attività legata.
// Una sola volta per tipo di corso e mai più spesso di COOLDOWN_MS, così l'omino non impazzisce.
// onReact restituisce false se l'omino è occupato: si riprova tra poco, se il visitatore è ancora lì.
// Solo esercizi: asciugamano e borraccia vengono da soli dopo (ChatWidget)
const REACTIONS = { combat: 'fight', dance: 'dance', strength: 'press', cardio: 'spin' };
const DWELL_MS = 2500;
const COOLDOWN_MS = 20000;

// Almeno il 60% della scheda (o dello schermo, se la scheda è più alta) è visibile
const inView = (el) => {
  const r = el.getBoundingClientRect();
  const shown = Math.min(r.bottom, window.innerHeight) - Math.max(r.top, 0);
  return shown > 0 && shown >= Math.min(r.height, window.innerHeight) * 0.6;
};

export const useMascotReactions = (active, onReact) => {
  const handler = useRef(onReact);
  const done = useRef(new Set());
  const last = useRef(-Infinity);

  useEffect(() => { handler.current = onReact; });

  useEffect(() => {
    if (!active) return undefined;
    let t;
    const check = () => {
      if (performance.now() - last.current < COOLDOWN_MS) return;
      const el = [...document.querySelectorAll('[data-mascot]')]
        .find((e) => REACTIONS[e.dataset.mascot] && !done.current.has(e.dataset.mascot) && inView(e));
      if (!el) return;
      if (handler.current(REACTIONS[el.dataset.mascot]) === false) {
        t = setTimeout(check, 1000);
        return;
      }
      done.current.add(el.dataset.mascot);
      last.current = performance.now();
    };
    const onScroll = () => {
      clearTimeout(t);
      t = setTimeout(check, DWELL_MS);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      clearTimeout(t);
    };
  }, [active]);
};
