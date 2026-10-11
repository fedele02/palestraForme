import { useCallback, useEffect, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { supabase, isDevData } from '../../lib/supabase';
import { friendlyError } from '../../hooks/useTable';
import { Button, ErrorBox } from './ui';

// Contatore dei messaggi dell'assistente AI: quante domande riceve e quanto resta del piano gratuito Groq.
// I dati li scrive il server della chat (server/chat.js) nella tabella chat_usage, un giorno per riga.

const romeDay = (date = new Date()) => new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Rome' }).format(date);
const daysAgo = (n) => romeDay(new Date(Date.now() - n * 86400000));
const fmt = (n) => new Intl.NumberFormat('it-IT').format(n ?? 0);
const dayLabel = (day) =>
  new Intl.DateTimeFormat('it-IT', { weekday: 'short', day: 'numeric', month: 'short', timeZone: 'UTC' }).format(new Date(`${day}T12:00:00Z`));

const Stat = ({ label, value, hint, tone = 'paper' }) => (
  <div className="rounded-[4px] border border-line bg-ink-deep p-4">
    <p className="text-sm text-mute">{label}</p>
    <p className={`display mt-1 text-[2.25rem] leading-none ${tone === 'warn' ? 'text-amber-300' : 'text-paper'}`}>{value}</p>
    {hint && <p className="mt-2 text-[0.8125rem] leading-snug text-mute">{hint}</p>}
  </div>
);

export const ChatUsage = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchRows = useCallback(async () => {
    try {
      const { data, error: err } = await supabase
        .from('chat_usage')
        .select('*')
        .gte('day', daysAgo(40))
        .order('day', { ascending: false });
      if (err) throw err;
      setRows(data || []);
      setError('');
    } catch (err) {
      setError(
        /chat_usage|relation|schema cache|404/i.test(err.message || '')
          ? 'Il contatore non è ancora attivo: esegui la parte 6 di supabase.sql nel SQL Editor di Supabase.'
          : friendlyError(err, 'Impossibile leggere il contatore.')
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isDevData) fetchRows();
  }, [fetchRows]);

  const load = () => {
    setLoading(true);
    fetchRows();
  };

  if (isDevData) {
    return (
      <p className="rounded-[4px] border border-dashed border-line px-4 py-10 text-center text-mute">
        Il contatore dei messaggi funziona solo con Supabase collegato, non in modalità prova locale.
      </p>
    );
  }

  const today = rows.find((r) => r.day === romeDay());
  const week = rows.filter((r) => r.day >= daysAgo(6));
  const month = rows.filter((r) => r.day.slice(0, 7) === romeDay().slice(0, 7));
  const sum = (list, key) => list.reduce((s, r) => s + (r[key] || 0), 0);

  const limit = today?.limit_requests;
  const remaining = today?.remaining_requests;
  const usedPct = limit ? Math.min(100, Math.round(((limit - (remaining ?? limit)) / limit) * 100)) : 0;
  const recent = rows.slice(0, 14);
  const maxRecent = Math.max(1, ...recent.map((r) => r.messages));

  return (
    <div className="space-y-8">
      <ErrorBox>{error}</ErrorBox>

      <section aria-labelledby="usage-today" className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 id="usage-today" className="text-lg font-bold text-paper">Oggi</h3>
          <Button variant="ghost" onClick={load} loading={loading} className="min-h-10 px-3 text-sm">
            {!loading && <RefreshCw size={16} aria-hidden="true" />} Aggiorna
          </Button>
        </div>

        <div className="rounded-[4px] border border-line bg-ink-deep p-4">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <p className="text-sm font-semibold text-paper">Richieste disponibili oggi (piano gratuito)</p>
            <p className="text-sm text-mute">
              {limit ? <><span className="font-bold text-paper">{fmt(remaining)}</span> rimaste su {fmt(limit)}</> : 'Compare dopo il primo messaggio di oggi'}
            </p>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10" aria-hidden="true">
            <div
              className={`h-full rounded-full ${usedPct >= 85 ? 'bg-amber-300' : 'bg-sun'}`}
              style={{ width: `${usedPct}%` }}
            />
          </div>
          <p className="mt-2 text-[0.8125rem] leading-snug text-mute">
            Dato comunicato da Groq all'ultimo messaggio. Il limite si ricarica da solo nel corso della giornata.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <Stat label="Messaggi oggi" value={fmt(today?.messages)} />
          <Stat
            label="Rifiutati per limite"
            value={fmt(today?.blocked)}
            tone={today?.blocked ? 'warn' : 'paper'}
            hint={today?.blocked ? 'Il limite gratuito era finito: ai visitatori è stato proposto di chiamare.' : 'Nessuno, tutto regolare.'}
          />
          <Stat label="Token usati oggi" value={fmt(today?.tokens)} hint="Groq ha anche un limite di token al giorno." />
        </div>
      </section>

      <section aria-labelledby="usage-period" className="space-y-4">
        <h3 id="usage-period" className="text-lg font-bold text-paper">Periodo</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          <Stat label="Ultimi 7 giorni" value={fmt(sum(week, 'messages'))} hint={`${fmt(sum(week, 'tokens'))} token`} />
          <Stat label="Questo mese" value={fmt(sum(month, 'messages'))} hint={`${fmt(sum(month, 'tokens'))} token`} />
        </div>

        {recent.length > 0 && (
          <ul className="divide-y divide-line rounded-[4px] border border-line">
            {recent.map((r) => (
              <li key={r.day} className="flex items-center gap-3 px-4 py-2.5 text-sm">
                <span className="w-28 shrink-0 capitalize text-mute">{dayLabel(r.day)}</span>
                <span className="h-2 flex-1 overflow-hidden rounded-full bg-white/10" aria-hidden="true">
                  <span className="block h-full rounded-full bg-sun" style={{ width: `${(r.messages / maxRecent) * 100}%` }} />
                </span>
                <span className="w-24 shrink-0 text-right font-semibold tabular-nums text-paper">{fmt(r.messages)} msg</span>
              </li>
            ))}
          </ul>
        )}
        {!loading && !error && rows.length === 0 && (
          <p className="rounded-[4px] border border-dashed border-line px-4 py-10 text-center text-mute">
            Ancora nessun messaggio registrato.
          </p>
        )}
      </section>

      <p className="text-[0.8125rem] leading-snug text-mute">
        I limiti esatti del tuo piano (richieste e token al giorno) sono su{' '}
        <a href="https://console.groq.com/settings/limits" target="_blank" rel="noopener noreferrer" className="font-semibold text-paper underline decoration-sun underline-offset-2">
          console.groq.com → Settings → Limits
        </a>.
      </p>
    </div>
  );
};
