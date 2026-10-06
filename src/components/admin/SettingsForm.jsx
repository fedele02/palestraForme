import { useEffect, useState } from 'react';
import { ExternalLink } from 'lucide-react';
import { useSiteSettings } from '../../hooks/useSiteSettings';
import { friendlyError } from '../../hooks/useTable';
import { SETTINGS_KEYS, buildSiteInfo, mapsEmbedUrl } from '../../lib/siteInfo';
import { Button, ErrorBox, Field, inputClass } from './ui';

// Nel database l'indirizzo va a capo con <br/>; nel modulo si usano righe normali
const toLines = (v = '') => v.replace(/<br\s*\/?>/gi, '\n');
const fromLines = (v = '') => v.split('\n').map((l) => l.trim()).filter(Boolean).join('<br/>');

const Section = ({ title, children }) => (
  <section className="space-y-6 border-t border-line pt-6">
    <h3 className="display text-[1.75rem] text-sun">{title}</h3>
    {children}
  </section>
);

export const SettingsForm = ({ onSaved }) => {
  const { settings, loading, updateMultipleSettings } = useSiteSettings();
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Precompila con i valori salvati (o con quelli che il sito sta già mostrando)
  useEffect(() => {
    if (loading || form) return;
    const info = buildSiteInfo(settings);
    const initial = {};
    SETTINGS_KEYS.forEach((k) => { initial[k] = settings[k] || ''; });
    initial.phone ||= info.phone;
    initial.email ||= info.email;
    initial.address = toLines(initial.address || info.addressLines.join('\n'));
    initial.opening_hours = toLines(initial.opening_hours);
    initial.facebook_url ||= info.facebookUrl;
    setForm(initial);
  }, [loading, settings, form]);

  if (!form) return <p className="py-10 text-mute">Caricamento…</p>;

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));
  const mapQuery = form.maps_query.trim() || fromLines(form.address).replace(/<br\/>/g, ', ');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.phone.trim()) return setError('Il numero di telefono serve: è il contatto principale del sito.');
    for (const key of ['google_maps_url', 'instagram_url', 'facebook_url']) {
      const v = form[key].trim();
      if (v && !/^https?:\/\//.test(v)) return setError('I link devono iniziare con https:// (copiali dalla barra del browser).');
    }
    setSaving(true);
    try {
      const values = {};
      SETTINGS_KEYS.forEach((k) => { values[k] = (form[k] || '').trim(); });
      values.address = fromLines(form.address);
      values.opening_hours = fromLines(form.opening_hours);
      await updateMultipleSettings(values);
      onSaved?.();
    } catch (err) {
      setError(friendlyError(err, 'Salvataggio non riuscito. Riprova.'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-10 pb-28 md:pb-0">
      <Section title="Contatti">
        <div className="grid gap-6 sm:grid-cols-2">
          <Field label="Telefono" htmlFor="s-phone" hint="Usato da tutti i pulsanti Chiama.">
            <input id="s-phone" type="tel" value={form.phone} onChange={set('phone')} className={inputClass} />
          </Field>
          <Field label="WhatsApp" htmlFor="s-wa" optional hint="Se lo compili, nei contatti compare Scrivici su WhatsApp.">
            <input id="s-wa" type="tel" value={form.whatsapp} onChange={set('whatsapp')} className={inputClass} placeholder="Es. 328 652 0798" />
          </Field>
        </div>
        <Field label="Email" htmlFor="s-email">
          <input id="s-email" type="email" value={form.email} onChange={set('email')} className={inputClass} autoCapitalize="none" />
        </Field>
        <Field label="Orari di apertura" htmlFor="s-hours" optional hint="Una riga per fascia. Es. Lun-Ven 7:00-22:00. Se vuoto, sul sito non compare.">
          <textarea id="s-hours" value={form.opening_hours} onChange={set('opening_hours')} rows={4} className={inputClass} placeholder={'Lun-Ven 7:00-22:00\nSabato 9:00-13:00'} />
        </Field>
      </Section>

      <Section title="Dove siamo">
        <Field label="Indirizzo" htmlFor="s-address" hint="Come vuoi che appaia sul sito, una riga per volta.">
          <textarea id="s-address" value={form.address} onChange={set('address')} rows={3} className={inputClass} />
        </Field>
        <Field label="Posizione sulla mappa" htmlFor="s-mapq" optional hint="Indirizzo da cercare su Google Maps, o coordinate (es. 40.6253, 16.7958). Se vuoto si usa l'indirizzo sopra.">
          <input id="s-mapq" value={form.maps_query} onChange={set('maps_query')} className={inputClass} placeholder="Es. Via Industrie Conte, Laterza" />
        </Field>
        <div className="overflow-hidden rounded-[4px] border border-line">
          <iframe
            title="Anteprima mappa"
            src={mapsEmbedUrl(mapQuery)}
            loading="lazy"
            className="block aspect-[16/9] w-full border-0 md:aspect-[21/9]"
          />
        </div>
        <Field label="Link Indicazioni stradali" htmlFor="s-mapurl" optional hint="Da Google Maps: Condividi, Copia link. Se vuoto, il pulsante Indicazioni usa la posizione qui sopra.">
          <input id="s-mapurl" type="url" value={form.google_maps_url} onChange={set('google_maps_url')} className={inputClass} placeholder="https://maps.app.goo.gl/…" />
        </Field>
      </Section>

      <Section title="Social">
        <div className="grid gap-6 sm:grid-cols-2">
          <Field label="Instagram" htmlFor="s-ig" optional>
            <input id="s-ig" type="url" value={form.instagram_url} onChange={set('instagram_url')} className={inputClass} placeholder="https://www.instagram.com/…" />
          </Field>
          <Field label="Facebook" htmlFor="s-fb" optional>
            <input id="s-fb" type="url" value={form.facebook_url} onChange={set('facebook_url')} className={inputClass} placeholder="https://www.facebook.com/…" />
          </Field>
        </div>
      </Section>

      <ErrorBox>{error}</ErrorBox>

      <div className="fixed inset-x-0 bottom-0 z-30 flex items-center gap-3 border-t border-line bg-ink px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] md:static md:border-0 md:bg-transparent md:p-0">
        <a href="/" target="_blank" rel="noopener noreferrer" className="btn btn-ghost flex-1 md:flex-none">
          <ExternalLink size={16} aria-hidden="true" /> Vedi sul sito
        </a>
        <Button type="submit" loading={saving} className="flex-[2] md:flex-none">{saving ? 'Salvataggio…' : 'Salva info'}</Button>
      </div>
    </form>
  );
};
