import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { friendlyError } from '../../hooks/useTable';
import { Button, ErrorBox, Field, Toggle, inputClass } from './ui';

// Il sito salva le date come "GG/MM": qui si usano i calendari del telefono/PC e si convertono
const toInputDate = (ddmm) => {
  const m = /^(\d{1,2})\/(\d{1,2})$/.exec((ddmm || '').trim());
  if (!m) return '';
  return `${new Date().getFullYear()}-${m[2].padStart(2, '0')}-${m[1].padStart(2, '0')}`;
};
const fromInputDate = (iso) => {
  const m = /^\d{4}-(\d{2})-(\d{2})$/.exec(iso || '');
  return m ? `${m[2]}/${m[1]}` : '';
};

const empty = { tag: '', title: '', subtitle: '', detail: '', price: '', old_price: '', valid_from: '', valid_to: '', is_active: true };

// Aggiunge "€" se è stato scritto solo un numero (es. "29" -> "29€")
const normalizePrice = (value) => {
  const v = value.trim();
  return /^\d+([.,]\d{1,2})?$/.test(v) ? `${v}€` : v;
};

export const PromotionForm = ({ initialData, onSubmit, onCancel }) => {
  const [form, setForm] = useState(() => ({ ...empty, ...(initialData || {}) }));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e?.target ? e.target.value : e }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.title.trim()) return setError("Scrivi il titolo dell'offerta.");
    if (!form.price.trim()) return setError('Scrivi il prezzo (es. 29€) o lo sconto (es. -20%).');
    setSaving(true);
    try {
      await onSubmit({
        tag: form.tag.trim(),
        title: form.title.trim(),
        subtitle: form.subtitle.trim(),
        detail: form.detail.trim(),
        price: normalizePrice(form.price),
        old_price: normalizePrice(form.old_price),
        valid_from: form.valid_from,
        valid_to: form.valid_to,
        is_active: form.is_active,
      });
    } catch (err) {
      setError(friendlyError(err, 'Salvataggio non riuscito. Riprova.'));
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="pb-28 md:pb-0">
      <button type="button" onClick={onCancel} className="mb-6 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-mute hover:text-paper">
        <ArrowLeft size={18} aria-hidden="true" /> Torna alle offerte
      </button>
      <h2 className="display mb-8 text-[2.5rem] text-paper md:text-[3rem]">{initialData ? 'Modifica offerta' : 'Nuova offerta'}</h2>

      <div className="grid gap-8 md:grid-cols-[minmax(0,1fr)_17rem]">
        <div className="space-y-6">
          <Field label="Titolo" htmlFor="p-title" hint="Cosa si ottiene. Es. 3 mesi tutti i corsi.">
            <input id="p-title" value={form.title} onChange={set('title')} className={inputClass} autoComplete="off" />
          </Field>
          <div className="grid gap-6 sm:grid-cols-2">
            <Field label="Prezzo" htmlFor="p-price" hint="Es. 29€ oppure -20%">
              <input id="p-price" value={form.price} onChange={set('price')} className={inputClass} inputMode="text" />
            </Field>
            <Field label="Prezzo prima" htmlFor="p-old" optional hint="Comparirà barrato. Es. 59€">
              <input id="p-old" value={form.old_price} onChange={set('old_price')} className={inputClass} />
            </Field>
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            <Field label="Etichetta" htmlFor="p-tag" optional hint="In alto nel buono. Es. Solo ottobre">
              <input id="p-tag" value={form.tag} onChange={set('tag')} className={inputClass} />
            </Field>
            <Field label="Sottotitolo" htmlFor="p-sub" optional hint="In giallo sotto il titolo. Es. Per i nuovi iscritti">
              <input id="p-sub" value={form.subtitle} onChange={set('subtitle')} className={inputClass} />
            </Field>
          </div>
          <Field label="Dettagli" htmlFor="p-detail" optional hint="Condizioni o cosa è incluso, in una o due frasi.">
            <textarea id="p-detail" value={form.detail} onChange={set('detail')} rows={3} className={inputClass} />
          </Field>
          <div className="grid gap-6 sm:grid-cols-2">
            <Field label="Valida dal" htmlFor="p-from" optional hint="Prima di questa data l'offerta non si vede.">
              <input id="p-from" type="date" value={toInputDate(form.valid_from)} onChange={(e) => set('valid_from')(fromInputDate(e.target.value))} className={`${inputClass} [color-scheme:dark]`} />
            </Field>
            <Field label="Valida fino al" htmlFor="p-to" optional hint="Dopo questa data sparisce da sola.">
              <input id="p-to" type="date" value={toInputDate(form.valid_to)} onChange={(e) => set('valid_to')(fromInputDate(e.target.value))} className={`${inputClass} [color-scheme:dark]`} />
            </Field>
          </div>
          <Toggle id="p-active" checked={form.is_active} onChange={set('is_active')} label="Visibile sul sito" description="Spegnila per nasconderla senza cancellarla." />
        </div>

        {/* Anteprima del buono, come apparirà sul sito */}
        <div className="md:sticky md:top-24 md:self-start">
          <p className="mb-2 text-sm font-semibold text-paper">Anteprima</p>
          <div className="overflow-hidden rounded-[4px] bg-ink-raised">
            <div className="bg-sun px-4 pt-4 pb-5 text-ink">
              <p className="min-h-4 text-[0.75rem] font-bold uppercase tracking-[0.08em] text-ink/70">{form.tag}</p>
              <p className="mt-2 flex flex-wrap items-end gap-x-2">
                <span className="display text-[3.5rem] leading-[0.85]">{normalizePrice(form.price) || 'Prezzo'}</span>
                {form.old_price && <span className="pb-1 font-semibold text-ink/55 line-through">{normalizePrice(form.old_price)}</span>}
              </p>
            </div>
            <div className="border-t-2 border-dashed border-ink/25 px-4 pt-4 pb-4">
              <p className="font-bold leading-snug text-paper">{form.title || 'Titolo offerta'}</p>
              {form.subtitle && <p className="mt-0.5 text-sm font-semibold text-sun">{form.subtitle}</p>}
              {form.detail && <p className="mt-2 text-sm leading-relaxed text-mute">{form.detail}</p>}
              {form.valid_to && <p className="mt-3 text-[0.8125rem] text-mute">Fino al <b className="text-paper">{form.valid_to}</b></p>}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8"><ErrorBox>{error}</ErrorBox></div>

      <div className="fixed inset-x-0 bottom-0 z-30 flex gap-3 border-t border-line bg-ink px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] md:static md:mt-8 md:border-0 md:bg-transparent md:p-0">
        <Button type="button" variant="ghost" onClick={onCancel} className="flex-1 md:flex-none">Annulla</Button>
        <Button type="submit" loading={saving} className="flex-[2] md:flex-none">{saving ? 'Salvataggio…' : 'Salva offerta'}</Button>
      </div>
    </form>
  );
};
