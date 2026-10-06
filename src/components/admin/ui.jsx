import { useEffect, useRef, useState } from 'react';
import { Check, CircleAlert, LoaderCircle, Trash2 } from 'lucide-react';

// Componenti base dell'area di gestione: stessi colori e caratteri del sito, comodi anche da telefono.

export const inputClass =
  'w-full rounded-[4px] border border-line bg-ink-deep px-3.5 py-3 text-base text-paper placeholder:text-mute/60 transition-colors focus:border-sun focus:outline-none';

export const Field = ({ label, hint, htmlFor, children, optional = false }) => (
  <div className="space-y-1.5">
    <label htmlFor={htmlFor} className="flex items-baseline gap-2 text-sm font-semibold text-paper">
      {label}
      {optional && <span className="font-normal text-mute">facoltativo</span>}
    </label>
    {children}
    {hint && <p className="text-[0.8125rem] leading-snug text-mute">{hint}</p>}
  </div>
);

export const Toggle = ({ checked, onChange, label, description, id }) => (
  <label htmlFor={id} className="flex cursor-pointer items-start justify-between gap-4 rounded-[4px] border border-line bg-ink-deep p-3.5">
    <span>
      <span className="block text-sm font-semibold text-paper">{label}</span>
      {description && <span className="mt-0.5 block text-[0.8125rem] text-mute">{description}</span>}
    </span>
    <span className="relative mt-0.5 inline-flex shrink-0">
      <input id={id} type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="peer sr-only" />
      <span className="h-7 w-12 rounded-full bg-white/15 transition-colors duration-200 peer-checked:bg-sun peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-sun" />
      <span className="absolute left-1 top-1 h-5 w-5 rounded-full bg-paper transition-transform duration-200 ease-[var(--ease-out-strong)] peer-checked:translate-x-5 peer-checked:bg-ink" />
    </span>
  </label>
);

export const Button = ({ variant = 'primary', loading = false, className = '', children, ...props }) => {
  const styles = {
    primary: 'btn btn-sun',
    ghost: 'btn btn-ghost',
    quiet: 'btn text-paper/80 hover:text-paper hover:bg-white/5',
    danger: 'btn border border-red-400/50 text-red-300 hover:bg-red-500/10',
  };
  return (
    <button
      {...props}
      disabled={loading || props.disabled}
      className={`${styles[variant]} disabled:pointer-events-none disabled:opacity-50 ${className}`}
    >
      {loading && <LoaderCircle size={18} className="animate-spin" aria-hidden="true" />}
      {children}
    </button>
  );
};

export const IconButton = ({ label, children, className = '', ...props }) => (
  <button
    type="button"
    aria-label={label}
    title={label}
    {...props}
    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-[4px] text-paper/75 transition-colors hover:bg-white/10 hover:text-paper active:scale-95 disabled:pointer-events-none disabled:opacity-25 ${className}`}
  >
    {children}
  </button>
);

export const ErrorBox = ({ children }) =>
  children ? (
    <div role="alert" className="flex items-start gap-2.5 rounded-[4px] border border-red-400/40 bg-red-500/10 px-3.5 py-3 text-sm text-red-200">
      <CircleAlert size={18} className="mt-px shrink-0" aria-hidden="true" />
      <span>{children}</span>
    </div>
  ) : null;

// Messaggio breve in basso ("Salvato"), sparisce da solo
export const useToast = () => {
  const [toast, setToast] = useState(null);
  const timer = useRef(null);
  const show = (message, tone = 'ok') => {
    clearTimeout(timer.current);
    setToast({ message, tone, key: Date.now() });
    timer.current = setTimeout(() => setToast(null), 3200);
  };
  useEffect(() => () => clearTimeout(timer.current), []);
  const node = toast ? (
    <div
      key={toast.key}
      role="status"
      className={`fixed inset-x-4 bottom-[calc(5.25rem+env(safe-area-inset-bottom))] z-50 md:bottom-6 mx-auto flex max-w-sm items-center gap-2.5 rounded-[4px] px-4 py-3 text-sm font-semibold shadow-[0_12px_32px_rgb(8_11_24/0.5)] [animation:toast-in_260ms_var(--ease-out-strong)] ${
        toast.tone === 'error' ? 'bg-red-500 text-white' : 'bg-paper text-ink'
      }`}
    >
      {toast.tone === 'error' ? <CircleAlert size={18} aria-hidden="true" /> : <Check size={18} aria-hidden="true" />}
      {toast.message}
    </div>
  ) : null;
  return { show, node };
};

// Elimina in due tocchi: il primo chiede conferma, il secondo elimina (niente finestre del browser)
export const DeleteButton = ({ onConfirm, label = 'Elimina' }) => {
  const [armed, setArmed] = useState(false);
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    if (!armed) return undefined;
    const t = setTimeout(() => setArmed(false), 4000);
    return () => clearTimeout(t);
  }, [armed]);

  if (!armed) {
    return (
      <IconButton label={label} onClick={() => setArmed(true)} className="hover:text-red-300">
        <Trash2 size={18} strokeWidth={1.75} aria-hidden="true" />
      </IconButton>
    );
  }
  return (
    <button
      type="button"
      disabled={busy}
      onClick={async () => {
        setBusy(true);
        try { await onConfirm(); } finally { setBusy(false); setArmed(false); }
      }}
      className="flex h-10 shrink-0 items-center gap-1.5 rounded-[4px] bg-red-500 px-3 text-sm font-bold text-white active:scale-95"
    >
      {busy ? <LoaderCircle size={16} className="animate-spin" aria-hidden="true" /> : <Trash2 size={16} aria-hidden="true" />}
      Conferma
    </button>
  );
};

export const StatusBadge = ({ tone, children }) => {
  const tones = {
    live: 'bg-emerald-400/15 text-emerald-300',
    off: 'bg-white/10 text-mute',
    warn: 'bg-amber-400/15 text-amber-300',
    sun: 'bg-sun text-ink',
  };
  return (
    <span className={`inline-flex items-center rounded-[4px] px-2 py-1 text-[0.6875rem] font-bold uppercase leading-none tracking-[0.06em] ${tones[tone]}`}>
      {children}
    </span>
  );
};
