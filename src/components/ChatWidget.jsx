import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUp, MessageCircle, Phone, RotateCcw, X } from 'lucide-react';
import { useScrollZones } from '../hooks/useScrollZones';

// Assistente AI in basso a destra. Il pallino "batte" per farsi notare e un fumetto invita
// a scrivere subito, già lì, senza dover prima aprire la chat. Risposte da /api/chat (server/chat.js).

const SUGGESTIONS = [
  'Che corsi ci sono?',
  'Avete offerte adesso?',
  'Cosa mi consigli se inizio da zero?',
  'Dove siete e quando aprite?',
];

const STORE_KEY = 'forme-chat';
const TEASER_KEY = 'forme-chat-teaser-off';

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

export const ChatWidget = ({ info }) => {
  const isDesktop = useIsDesktop();
  const { pastHero, atContacts } = useScrollZones();

  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState(loadMessages);
  const [input, setInput] = useState('');
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState(null); // 'busy' | 'error'
  const [teaser, setTeaser] = useState(false);
  const [teaserText, setTeaserText] = useState('');
  const [usedOnce, setUsedOnce] = useState(() => loadMessages().length > 0 || session.get(TEASER_KEY) === '1');

  const launcherRef = useRef(null);
  const inputRef = useRef(null);
  const logRef = useRef(null);
  const teaserHeld = useRef(false);

  // Su telefono il pallino compare dopo la prima schermata (non copre i pulsanti dell'hero)
  // e sale sopra la barra "Chiama" quando c'è
  const dockVisible = isDesktop || pastHero;
  const aboveCallBar = !isDesktop && pastHero && !atContacts;

  useEffect(() => { session.set(STORE_KEY, JSON.stringify(messages)); }, [messages]);

  // Fumetto di invito: una volta per visita, poco dopo che il pallino è visibile
  useEffect(() => {
    if (usedOnce || open || !dockVisible) return undefined;
    const show = setTimeout(() => setTeaser(true), isDesktop ? 3500 : 1200);
    return () => clearTimeout(show);
  }, [usedOnce, open, dockVisible, isDesktop]);

  // Se nessuno lo tocca, il fumetto si richiude da solo (resta il pallino)
  useEffect(() => {
    if (!teaser) return undefined;
    const hide = setTimeout(() => { if (!teaserHeld.current) setTeaser(false); }, 15000);
    return () => clearTimeout(hide);
  }, [teaser]);

  const closeTeaser = () => {
    setTeaser(false);
    setUsedOnce(true);
    session.set(TEASER_KEY, '1');
  };

  const openChat = () => {
    closeTeaser();
    setOpen(true);
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

  const send = async (text, base = messages) => {
    const question = text.trim();
    if (!question || streaming) return;
    closeTeaser();
    setOpen(true);
    setInput('');
    setTeaserText('');
    setError(null);

    const history = [...base, { role: 'user', content: question }];
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
        setMessages([...history, { role: 'assistant', content: answer }]);
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

  const showBeat = !usedOnce && !open;
  const last = messages[messages.length - 1];
  const waiting = streaming && last?.role === 'assistant' && !last.content;

  return (
    <>
      {/* Pallino + fumetto di invito */}
      <div
        inert={!dockVisible || (open && !isDesktop) ? true : undefined}
        className={`fixed bottom-[calc(1rem+env(safe-area-inset-bottom))] right-4 z-40 flex flex-col items-end gap-3 transition-[transform,opacity] duration-300 ease-[var(--ease-out-strong)] md:bottom-6 md:right-6 ${
          dockVisible ? 'opacity-100' : 'pointer-events-none translate-y-6 opacity-0'
        } ${aboveCallBar ? '-translate-y-[4.75rem]' : ''}`}
      >
        <AnimatePresence>
          {teaser && !open && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
              onPointerEnter={() => { teaserHeld.current = true; }}
              onFocus={() => { teaserHeld.current = true; }}
              role="region"
              aria-label="Fai una domanda all'assistente"
              className="w-[min(340px,calc(100vw-2rem))] rounded-[8px] border border-line bg-ink-raised p-4 shadow-[0_16px_40px_rgb(0_0_0/0.45)]"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="flex items-center gap-2 text-sm font-semibold text-paper">
                    <span className="h-2 w-2 rounded-full bg-sun" aria-hidden="true" />
                    Assistente ForMe
                  </p>
                  <p className="mt-1.5 text-[0.9375rem] leading-snug text-mute">
                    Ciao! Hai domande su corsi, orari o offerte? Scrivi qui sotto, rispondo subito.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={closeTeaser}
                  aria-label="Chiudi l'invito"
                  className="-mr-2 -mt-2 grid h-11 w-11 shrink-0 cursor-pointer place-items-center rounded-full text-mute transition-colors hover:text-paper"
                >
                  <X size={18} aria-hidden="true" />
                </button>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {SUGGESTIONS.slice(0, 2).map((s) => <Chip key={s} onClick={() => send(s)}>{s}</Chip>)}
              </div>

              <form onSubmit={(e) => { e.preventDefault(); send(teaserText); }} className="mt-3 flex items-center gap-2">
                <label htmlFor="chat-teaser-input" className="sr-only">La tua domanda</label>
                <input
                  id="chat-teaser-input"
                  value={teaserText}
                  onChange={(e) => setTeaserText(e.target.value)}
                  maxLength={600}
                  placeholder="Scrivi la tua domanda…"
                  autoComplete="off"
                  enterKeyHint="send"
                  className="h-11 min-w-0 flex-1 rounded-full border border-line bg-ink px-4 text-base text-paper placeholder:text-mute focus:border-sun focus:outline-none"
                />
                <SendButton disabled={!teaserText.trim()} />
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {!(open && isDesktop) && (
          <button
            ref={launcherRef}
            type="button"
            onClick={openChat}
            aria-label="Hai domande? Chiedi all'assistente"
            aria-expanded={open}
            className="relative flex h-14 min-w-14 cursor-pointer items-center justify-center gap-2 rounded-full bg-sun px-4 font-semibold text-ink shadow-[0_8px_24px_rgb(0_0_0/0.4)] transition-transform duration-150 active:scale-95 md:px-5"
          >
            {showBeat && (
              <>
                <span aria-hidden="true" className="chat-ripple" />
                <span aria-hidden="true" className="chat-ripple chat-ripple--late" />
              </>
            )}
            <MessageCircle size={24} strokeWidth={2.25} aria-hidden="true" />
            <span className="hidden md:inline">Hai domande?</span>
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
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-sun text-ink" aria-hidden="true">
                <MessageCircle size={20} strokeWidth={2.25} />
              </span>
              <div className="min-w-0 flex-1">
                <h2 id="chat-title" className="text-base font-bold leading-tight text-paper">Assistente ForMe</h2>
                <p className="text-sm text-mute">Risposte automatiche con AI</p>
              </div>
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
                Ciao! Sono l'assistente di ForMe. Chiedimi di corsi, orari, offerte o come raggiungerci.
              </div>

              {messages.length === 0 && (
                <div className="flex flex-wrap gap-2">
                  {SUGGESTIONS.map((s) => <Chip key={s} onClick={() => send(s)}>{s}</Chip>)}
                </div>
              )}

              {messages.map((m, i) => {
                if (m.role === 'assistant' && !m.content) return null;
                return m.role === 'user' ? (
                  <div key={i} className="ml-auto w-fit max-w-[85%] whitespace-pre-wrap break-words rounded-[8px] rounded-tr-[2px] bg-sun px-4 py-3 text-[0.9375rem] leading-relaxed text-ink">
                    {m.content}
                  </div>
                ) : (
                  <div key={i} className="max-w-[88%] break-words rounded-[8px] rounded-tl-[2px] bg-ink-raised px-4 py-3 text-[0.9375rem] leading-relaxed text-paper/90">
                    <RichText text={m.content} />
                  </div>
                );
              })}

              {waiting && <TypingPulse />}

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
