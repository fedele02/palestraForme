import { useState } from 'react';
import { ArrowLeft, ImagePlus, X } from 'lucide-react';
import { uploadToCloudinary } from '../../lib/cloudinary';
import { friendlyError } from '../../hooks/useTable';
import { Button, ErrorBox, Field, Toggle, inputClass } from './ui';

const empty = { title: '', description: '', schedule: '', is_active: true, is_new: false, image_url: null, cloudinary_public_id: null };

export const CourseForm = ({ initialData, onSubmit, onCancel, supportsNewFlag = false, families = [], defaultFamilyId = '' }) => {
  const [form, setForm] = useState(() => ({
    ...empty,
    ...(initialData || {}),
    schedule: initialData?.schedule && initialData.schedule !== 'Orari da definire' ? initialData.schedule : '',
    is_new: !!initialData?.is_new,
    family_id: initialData?.family_id && families.some((f) => f.id === initialData.family_id) ? initialData.family_id : defaultFamilyId,
  }));
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(initialData?.image_url || null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e?.target ? e.target.value : e }));

  const pickFile = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const removeImage = () => {
    setFile(null);
    setPreview(null);
    setForm((f) => ({ ...f, image_url: null, cloudinary_public_id: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.title.trim()) return setError('Scrivi il nome del corso.');
    if (!form.description.trim()) return setError('Scrivi una breve descrizione del corso.');
    if (families.length && !form.family_id) return setError('Scegli in quale sezione del sito mostrare il corso.');
    setSaving(true);
    try {
      let { image_url, cloudinary_public_id } = form;
      if (file) {
        const uploaded = await uploadToCloudinary(file);
        image_url = uploaded.url;
        cloudinary_public_id = uploaded.publicId;
      }
      const data = {
        title: form.title.trim().toUpperCase(),
        description: form.description.trim(),
        schedule: form.schedule.trim() || 'Orari da definire',
        is_active: form.is_active,
        image_url,
        cloudinary_public_id,
        // is_new va inviato solo se la colonna esiste già nel database (vedi supabase.sql)
        ...(supportsNewFlag ? { is_new: form.is_new } : {}),
        // family_id esiste solo dopo la migrazione delle sezioni (vedi supabase.sql)
        ...(families.length ? { family_id: form.family_id || null } : {}),
      };
      await onSubmit(data);
    } catch (err) {
      setError(friendlyError(err, 'Salvataggio non riuscito. Riprova.'));
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="pb-28 md:pb-0">
      <button type="button" onClick={onCancel} className="mb-6 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-mute hover:text-paper">
        <ArrowLeft size={18} aria-hidden="true" /> Torna ai corsi
      </button>
      <h2 className="display mb-8 text-[2.5rem] text-paper md:text-[3rem]">{initialData ? 'Modifica corso' : 'Nuovo corso'}</h2>

      <div className="grid gap-8 md:grid-cols-[minmax(0,1fr)_18rem]">
        <div className="space-y-6">
          <Field label="Nome del corso" htmlFor="c-title" hint="Viene mostrato in maiuscolo sul sito.">
            <input id="c-title" value={form.title} onChange={set('title')} className={inputClass} placeholder="Es. PILATES" autoComplete="off" />
          </Field>
          {families.length > 0 && (
            <Field label="Sezione" htmlFor="c-family" hint="Sotto quale titolo compare sul sito (Fitness, Danza...). Le sezioni si gestiscono nella pagina Corsi.">
              <select id="c-family" value={form.family_id} onChange={set('family_id')} className={`${inputClass} [color-scheme:dark]`}>
                <option value="">Scegli una sezione</option>
                {families.map((f) => <option key={f.id} value={f.id}>{f.name}</option>)}
              </select>
            </Field>
          )}
          <Field label="Descrizione" htmlFor="c-desc" hint="Due o tre frasi: cosa si fa e per chi è adatto.">
            <textarea id="c-desc" value={form.description} onChange={set('description')} rows={5} className={inputClass} />
          </Field>
          <Field label="Giorni e orari" htmlFor="c-sched" optional hint="Es. Lun e Mer 19:00. Se lo lasci vuoto, sul sito non compare nessun orario.">
            <input id="c-sched" value={form.schedule} onChange={set('schedule')} className={inputClass} placeholder="Es. Mar e Gio 18:30" />
          </Field>
          <div className="space-y-3">
            <Toggle id="c-active" checked={form.is_active} onChange={set('is_active')} label="Visibile sul sito" description="Se lo spegni il corso resta salvato ma non si vede." />
            {supportsNewFlag && (
              <Toggle id="c-new" checked={form.is_new} onChange={set('is_new')} label="Segna come nuovo" description="Mostra il bollino giallo NUOVO sulla foto." />
            )}
          </div>
        </div>

        <Field label="Foto" optional hint="Meglio orizzontale. Sul sito appare in bianco e nero con il velo blu, come le altre.">
          {preview ? (
            <div className="relative overflow-hidden rounded-[4px] border border-line">
              <img src={preview} alt="" className="aspect-[4/3] w-full object-cover [filter:grayscale(1)]" />
              <div className="absolute inset-x-2 bottom-2 flex gap-2">
                <label className="btn btn-sun min-h-10 flex-1 cursor-pointer px-3 text-sm">
                  <ImagePlus size={16} aria-hidden="true" /> Cambia
                  <input type="file" accept="image/*" onChange={pickFile} className="sr-only" />
                </label>
                <button type="button" onClick={removeImage} className="btn min-h-10 bg-ink/90 px-3 text-sm text-paper">
                  <X size={16} aria-hidden="true" /> Togli
                </button>
              </div>
            </div>
          ) : (
            <label className="flex aspect-[4/3] cursor-pointer flex-col items-center justify-center gap-2 rounded-[4px] border border-dashed border-paper/30 bg-ink-deep text-center text-sm text-mute transition-colors hover:border-sun hover:text-paper">
              <ImagePlus size={28} strokeWidth={1.5} className="text-sun" aria-hidden="true" />
              <span className="font-semibold text-paper">Carica una foto</span>
              <span>Senza foto il sito usa un'immagine di riserva.</span>
              <input type="file" accept="image/*" onChange={pickFile} className="sr-only" />
            </label>
          )}
        </Field>
      </div>

      <div className="mt-8"><ErrorBox>{error}</ErrorBox></div>

      <div className="fixed inset-x-0 bottom-0 z-30 flex gap-3 border-t border-line bg-ink px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] md:static md:mt-8 md:border-0 md:bg-transparent md:p-0">
        <Button type="button" variant="ghost" onClick={onCancel} className="flex-1 md:flex-none">Annulla</Button>
        <Button type="submit" loading={saving} className="flex-[2] md:flex-none">{saving ? 'Salvataggio…' : 'Salva corso'}</Button>
      </div>
    </form>
  );
};
