import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUp, ListChecks, Phone, RotateCcw, X } from 'lucide-react';
import { useScrollZones } from '../hooks/useScrollZones';
import { DISCLAIMER, FINDER_LABEL, PROFANITY_EMPTY, PROFANITY_NOTICE, SUGGESTIONS, TIPS, WELCOME } from '../lib/chatContent';
import { stripProfanity } from '../lib/profanity';
import { ChatMascot } from './ChatMascot';
import { CourseFinder } from './CourseFinder';

// Assistente AI in basso a destra: l'omino-coach che saluta, con un fumetto che alterna esempi di domande
// (uguale su PC e telefono). I testi (domande, fumetti, questionario) sono in src/lib/chatContent.js.
// Risposte da /api/chat (server/chat.js).

// Fumetto dell'omino: un giro di messaggi, poi pausa, al massimo TIP_ROUNDS giri
const TIP_MS = 4200;
const TIP_PAUSE_MS = 40000;
const TIP_ROUNDS = 3;
const WAVE_EVERY_MS = 11000;
// L'omino compare scorrendo oltre la prima schermata, o comunque dopo questo tempo
const SHOW_AFTER_MS = 5000;

const STORE_KEY = 'forme-chat';
const NOTE_START = DISCLAIMER.split(':')[0] + ':'; // "Ricorda:"

// Comodità per il visitatore: la conversazione resta finché la scheda è aperta
const session = {
  get(key) { try { return sessionStorage.getItem(key); } catch { return null; } },
  set(key, value) { try { sessionStorage.setItem(key, value); } catch { /* storage non disponibile */ } },
};

const loadMessages = () => {
  try { return JSON.parse(session.get(STORE_KEY)) || []; } catch { return []; }
};

const useIsDesktop = () => {
  const [desktop, setDesktop] = useState(() => typeof window !== 'undefined' && window.matchMedia('(min-width: 768px)').matches);
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    const onChange = () => setDesktop(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);
  return desktop;
};

// Il modello risponde in testo semplice: solo **grassetto** ed elenchi con "- "
const inline = (text) =>
  text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith('**') && part.endsWith('**') && part.length > 4
      ? <strong key={i} className="font-semibold text-paper">{part.slice(2, -2)}</strong>
      : part
  );

const RichText = ({ text }) => {
  const blocks = [];
  let list = null;
  text.split('\n').forEach((raw) => {
    const line = raw.trim();
    const item = /^(?:[-*•]|\d+[.)])\s+(.*)/.exec(line);
    if (item) {
      if (!list) { list = []; blocks.push(list); }
      list.push(item[1]);
      return;
    }
    list = null;
    if (line) blocks.push(line);
  });
  return (
    <div className="space-y-2">
      {blocks.map((b, i) => Array.isArray(b) ? (
        <ul key={i} className="list-disc space-y-1 pl-5 marker:text-sun">
          {b.map((it, j) => <li key={j}>{inline(it)}</li>)}
        </ul>
      ) : b === PROFANITY_NOTICE ? (
        <p key={i} className="text-sm font-semibold leading-snug text-sun">{b}</p>
      ) : b.replace(/\*/g, '').startsWith(NOTE_START) ? (
        // L'avviso "sono un assistente virtuale" in fondo ai consigli, separato e in tono minore
        <p key={i} className="border-t border-line pt-2 text-sm leading-snug text-mute">{b.replace(/\*/g, '')}</p>
      ) : <p key={i}>{inline(b)}</p>)}
    </div>
  );
};

// "Sta scrivendo": un piccolo tracciato del battito al posto dei soliti tre puntini
const TypingPulse = () => (
  <div className="flex items-center gap-2 text-sm text-mute">
    <svg width="44" height="20" viewBox="0 0 44 20" aria-hidden="true" className="chat-typing">
      <path d="M0 10H12L15 10L18 3L22 17L25 10H44" fill="none" stroke="var(--color-sun)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" pathLength="1" />
    </svg>
    <span className="sr-only">L'assistente sta scrivendo</span>
  </div>
);

const SendButton = ({ disabled }) => (
  <button
    type="submit"
    disabled={disabled}
    aria-label="Invia la domanda"
    className="grid h-11 w-11 shrink-0 cursor-pointer place-items-center rounded-full bg-sun text-ink transition-[opacity,transform] duration-150 active:scale-95 disabled:cursor-default disabled:opacity-40"
  >
    <ArrowUp size={20} strokeWidth={2.5} aria-hidden="true" />
  </button>
);

const Chip = ({ children, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="min-h-11 cursor-pointer rounded-full border border-line px-4 py-2 text-left text-[0.9375rem] leading-snug text-paper transition-colors duration-200 hover:border-sun hover:text-sun"
  >
    {children}
  </button>
);

// Il questionario guidato è la proposta principale: pulsante pieno, distinto dagli altri suggerimenti
const FinderChip = ({ onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="flex min-h-11 cursor-pointer items-center gap-2 rounded-full bg-sun px-4 py-2 text-left text-[0.9375rem] font-semibold leading-snug text-ink transition-[background-color,transform] duration-150 hover:bg-sun-press active:scale-[0.98]"
  >
    <ListChecks size={18} strokeWidth={2.25} aria-hidden="true" className="shrink-0" />
    {FINDER_LABEL}
  </button>
);

export const ChatWidget = ({ info }) => {
  const isDesktop = useIsDesktop();
  const { pastHero, atContacts } = useScrollZones();

  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState(loadMessages);
  const [input, setInput] = useState('');
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState(null); // 'busy' | 'error'
  // A ogni caricamento della pagina l'omino ripropone le sue domande, finché non si apre la chat
  const [usedOnce, setUsedOnce] = useState(false);
  const [finder, setFinder] = useState(false);

  const launcherRef = useRef(null);
  const inputRef = useRef(null);
  const logRef = useRef(null);
  const [timerUp, setTimerUp] = useState(false);
  const [tip, setTip] = useState(null);
  const [wave, setWave] = useState(0);

  // L'omino (su PC e su telefono) compare dopo la prima schermata oppure dopo qualche secondo
  // (su telefono sta sotto i pulsanti dell'hero) e su telefono sale sopra la barra "Chiama" quando c'è
  useEffect(() => {
    const t = setTimeout(() => setTimerUp(true), SHOW_AFTER_MS);
    return () => clearTimeout(t);
  }, []);
  const dockVisible = pastHero || timerUp;
  const aboveCallBar = !isDesktop && pastHero && !atContacts;
  const mascotActive = dockVisible && !open;

  // L'omino saluta appena compare e poi ogni tanto
  useEffect(() => {
    if (!mascotActive) return undefined;
    const first = setTimeout(() => setWave((w) => w + 1), 500);
    const again = setInterval(() => setWave((w) => w + 1), WAVE_EVERY_MS);
    return () => { clearTimeout(first); clearInterval(again); };
  }, [mascotActive]);

  // Fumetto che alterna gli esempi di domande, finché la chat non viene usata
  useEffect(() => {
    if (!mascotActive || usedOnce) return undefined;
    let i = 0;
    let rounds = 0;
    let t;
    const step = () => {
      if (i < TIPS.length) {
        setTip(i);
        i += 1;
        t = setTimeout(step, TIP_MS);
        return;
      }
      setTip(null);
      i = 0;
      rounds += 1;
      if (rounds < TIP_ROUNDS) t = setTimeout(step, TIP_PAUSE_MS);
    };
    t = setTimeout(step, 900);
    return () => clearTimeout(t);
  }, [mascotActive, usedOnce]);
  const bubbleShown = mascotActive && !usedOnce && tip !== null;

  useEffect(() => { session.set(STORE_KEY, JSON.stringify(messages)); }, [messages]);

  // startFinder: apre la chat direttamente sul questionario "trova il tuo corso"
  const openChat = (startFinder = false) => {
    setUsedOnce(true);
    if (startFinder) setFinder(true);
    setOpen(true);
  };

  const finishFinder = ({ text, display, vulgar }) => {
    setFinder(false);
    send(text, messages, vulgar ? PROFANITY_NOTICE : '', display);
  };

  // Riparte da zero: via la conversazione (anche quella salvata nella scheda) e il questionario a metà
  const resetChat = () => {
    setMessages([]);
    setFinder(false);
    setError(null);
    setInput('');
    inputRef.current?.focus();
  };

  const closeChat = useCallback(() => {
    setOpen(false);
    requestAnimationFrame(() => launcherRef.current?.focus());
  }, []);

  // Chat aperta: Esc chiude; su telefono è a schermo intero, la pagina sotto non scorre
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => { if (e.key === 'Escape') closeChat(); };
    window.addEventListener('keydown', onKey);
    const { overflow } = document.body.style;
    if (!isDesktop) document.body.style.overflow = 'hidden';
    if (isDesktop) inputRef.current?.focus();
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = overflow;
    };
  }, [open, isDesktop, closeChat]);

  // Segue l'ultima risposta mentre arriva
  useEffect(() => {
    const el = logRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, streaming, error, open]);

  // prefix: testo fisso messo in testa alla risposta (es. l'avviso sulle parole volgari)
  // display: come mostrare la domanda nel fumetto, se diverso da quello che riceve l'AI
  const send = async (text, base = messages, prefix = '', display) => {
    if (!text.trim() || streaming) return;
    setUsedOnce(true);
    setFinder(false);
    setOpen(true);
    setInput('');
    setError(null);

    // Parole sempre volgari: l'AI non le riceve e nel fumetto diventano "•••"
    const filtered = stripProfanity(text.trim());
    const question = filtered.text;
    const lead = filtered.found ? PROFANITY_NOTICE : prefix;
    const userMsg = { role: 'user', content: question, ...(filtered.found ? { display: filtered.masked } : display ? { display } : {}) };
    if (!/[\p{L}\p{N}]/u.test(question)) {
      setMessages([...base, userMsg, { role: 'assistant', content: `${PROFANITY_NOTICE}\n\n${PROFANITY_EMPTY}` }]);
      return;
    }

    const history = [...base, userMsg];
    setMessages([...history, { role: 'assistant', content: '' }]);
    setStreaming(true);

    let answer = '';
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history }),
      });
      if (!res.ok || !res.body) {
        const { error: code } = await res.json().catch(() => ({}));
        throw Object.assign(new Error(code), { kind: code === 'limit' || code === 'busy' ? 'busy' : 'error' });
      }
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        answer += decoder.decode(value, { stream: true });
        setMessages([...history, { role: 'assistant', content: lead ? `${lead}\n\n${answer.replace(PROFANITY_NOTICE, '').trimStart()}` : answer }]);
      }
      if (!answer.trim()) throw Object.assign(new Error('empty'), { kind: 'error' });
    } catch (err) {
      if (!answer.trim()) {
        setMessages(history);
        setError(err.kind || 'error');
      }
    } finally {
      setStreaming(false);
    }
  };

  const retry = () => {
    const last = messages[messages.length - 1];
    if (last?.role === 'user') send(last.content, messages.slice(0, -1));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    send(input);
  };

  // Invio con Enter, a capo con Shift+Enter
  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      send(input);
    }
  };

  const last = messages[messages.length - 1];
  const waiting = streaming && last?.role === 'assistant' && !last.content;

  return (
    <>
      {/* Omino + fumetto con gli esempi di domande */}
      <div
        inert={!dockVisible || (open && !isDesktop) ? true : undefined}
        className={`fixed bottom-[calc(1rem+env(safe-area-inset-bottom))] right-4 z-40 flex flex-col items-end gap-3 transition-[transform,opacity] duration-300 ease-[var(--ease-out-strong)] md:bottom-6 md:right-6 ${
          dockVisible ? 'opacity-100' : 'pointer-events-none translate-y-6 opacity-0'
        } ${aboveCallBar ? '-translate-y-[4.75rem]' : ''}`}
      >
        {!(open && isDesktop) && (
          <button
            ref={launcherRef}
            type="button"
            onClick={() => openChat(bubbleShown && !!TIPS[tip]?.finder)}
            aria-label="Hai domande? Chiedi al coach AI di ForMe"
            aria-expanded={open}
            className="flex cursor-pointer items-center gap-1 transition-transform duration-150 active:scale-95"
          >
            <AnimatePresence mode="wait">
              {bubbleShown && (
                <motion.span
                  key={tip}
                  aria-hidden="true"
                  initial={{ opacity: 0, x: 8, scale: 0.96 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: 4 }}
                  transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
                  className="relative w-max max-w-[min(15.5rem,calc(100vw-7rem))] origin-right rounded-[8px] border border-line bg-ink-raised px-3.5 py-2.5 text-left text-[0.9375rem] font-medium leading-snug text-paper shadow-[0_12px_32px_rgb(0_0_0/0.45)]"
                >
                  {TIPS[tip].text}
                  <span className="absolute -right-[6px] top-1/2 h-3 w-3 -translate-y-1/2 rotate-45 border-r border-t border-line bg-ink-raised" />
                </motion.span>
              )}
            </AnimatePresence>
            <span className="mascot-outline relative block h-16 w-16 shrink-0 md:h-[76px] md:w-[76px]">
              <ChatMascot size={isDesktop ? 76 : 64} wave={wave} />
              <span aria-hidden="true" className="absolute -left-1 top-0 rounded-full border border-sun/70 bg-ink px-1.5 text-xs font-bold leading-5 text-sun">
                AI
              </span>
            </span>
          </button>
        )}

      </div>

      {/* Finestra della chat: schermo intero su telefono, riquadro in basso a destra su PC */}
      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-modal={!isDesktop}
            aria-labelledby="chat-title"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.28, ease: [0.23, 1, 0.32, 1] }}
            className="fixed inset-0 z-[70] flex flex-col overflow-hidden bg-ink md:inset-auto md:bottom-6 md:right-6 md:h-[min(640px,calc(100dvh-3rem))] md:w-[400px] md:rounded-[8px] md:border md:border-line md:shadow-[0_24px_64px_rgb(0_0_0/0.55)]"
          >
            <header className="flex items-center gap-3 border-b border-line px-4 pb-3 pt-[calc(0.75rem+env(safe-area-inset-top))] md:pt-3">
              <span className="flex h-11 w-11 shrink-0 items-end justify-center overflow-hidden rounded-full bg-ink-raised" aria-hidden="true">
                <ChatMascot size={40} idle={false} />
              </span>
              <div className="min-w-0 flex-1">
                <h2 id="chat-title" className="truncate text-base font-bold leading-tight text-paper">Coach ForMe</h2>
                <p className="truncate text-sm text-mute">AI · <span className="font-semibold text-sun">#4MEdable</span></p>
              </div>
              {(messages.length > 0 || finder) && (
                <button
                  type="button"
                  onClick={resetChat}
                  disabled={streaming}
                  className="flex min-h-11 shrink-0 cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-full border border-line px-3 text-sm font-semibold text-paper transition-colors hover:border-sun hover:text-sun disabled:cursor-default disabled:opacity-40"
                >
                  <RotateCcw size={15} strokeWidth={2} aria-hidden="true" className="hidden sm:block" />
                  Cancella chat
                </button>
              )}
              <button
                type="button"
                onClick={closeChat}
                aria-label="Chiudi la chat"
                className="-mr-2 grid h-11 w-11 cursor-pointer place-items-center rounded-full text-mute transition-colors hover:text-paper"
              >
                <X size={22} aria-hidden="true" />
              </button>
            </header>

            <div ref={logRef} role="log" aria-live="polite" className="flex-1 space-y-4 overflow-y-auto overscroll-contain px-4 py-5">
              <div className="max-w-[88%] rounded-[8px] rounded-tl-[2px] bg-ink-raised px-4 py-3 text-[0.9375rem] leading-relaxed text-paper">
                {WELCOME}
              </div>

              {messages.length === 0 && !finder && (
                <div className="flex flex-wrap gap-2">
                  <FinderChip onClick={() => setFinder(true)} />
                  {SUGGESTIONS.map((s) => <Chip key={s} onClick={() => send(s)}>{s}</Chip>)}
                </div>
              )}

              {messages.map((m, i) => {
                if (m.role === 'assistant' && !m.content) return null;
                return m.role === 'user' ? (
                  <div key={i} className="ml-auto w-fit max-w-[85%] whitespace-pre-wrap break-words rounded-[8px] rounded-tr-[2px] bg-sun px-4 py-3 text-[0.9375rem] leading-relaxed text-ink">
                    {m.display || m.content}
                  </div>
                ) : (
                  <div key={i} className="max-w-[88%] break-words rounded-[8px] rounded-tl-[2px] bg-ink-raised px-4 py-3 text-[0.9375rem] leading-relaxed text-paper/90">
                    <RichText text={m.content} />
                  </div>
                );
              })}

              {waiting && <TypingPulse />}

              {finder && <CourseFinder onDone={finishFinder} onCancel={() => setFinder(false)} />}

              {error && (
                <div className="rounded-[8px] border border-line px-4 py-3 text-[0.9375rem] leading-relaxed text-paper">
                  <p>
                    {error === 'busy'
                      ? 'In questo momento ricevo troppe domande. Riprova tra poco, oppure chiamaci: ti rispondiamo noi.'
                      : 'Non sono riuscito a rispondere. Riprova, oppure chiamaci.'}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <a href={info.phoneHref} className="btn btn-sun min-h-11 px-4 text-sm">
                      <Phone size={16} strokeWidth={2} aria-hidden="true" />
                      Chiama
                    </a>
                    <button type="button" onClick={retry} className="btn btn-ghost min-h-11 cursor-pointer px-4 text-sm">
                      <RotateCcw size={16} strokeWidth={2} aria-hidden="true" />
                      Riprova
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="border-t border-line px-3 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] md:pb-3">
              {messages.length > 0 && !finder && !streaming && (
                <button
                  type="button"
                  onClick={() => setFinder(true)}
                  className="mb-2 flex min-h-11 cursor-pointer items-center gap-2 px-1 text-sm font-semibold text-sun transition-colors hover:text-paper"
                >
                  <ListChecks size={18} strokeWidth={2} aria-hidden="true" />
                  {FINDER_LABEL}
                </button>
              )}
              <form onSubmit={onSubmit} className="flex items-end gap-2">
                <label htmlFor="chat-input" className="sr-only">La tua domanda</label>
                <textarea
                  id="chat-input"
                  ref={inputRef}
                  rows={1}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={onKeyDown}
                  maxLength={600}
                  placeholder="Scrivi la tua domanda…"
                  enterKeyHint="send"
                  className="max-h-32 min-h-11 flex-1 resize-none rounded-[22px] border border-line bg-ink-raised px-4 py-2.5 text-base leading-snug text-paper [field-sizing:content] placeholder:text-mute focus:border-sun focus:outline-none"
                />
                <SendButton disabled={!input.trim() || streaming} />
              </form>
              <p className="mt-2 px-1 text-xs leading-snug text-mute">
                Assistente AI: può sbagliare. Per conferme chiama il{' '}
                <a href={info.phoneHref} className="whitespace-nowrap font-semibold text-paper underline decoration-sun underline-offset-2">{info.phone}</a>.
                {' '}Non scrivere dati personali.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
