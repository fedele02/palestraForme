import { useState } from 'react';
import { ChevronDown, ChevronUp, ExternalLink, Eye, EyeOff, LogOut, Pencil, Plus } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useCourses } from '../hooks/useCourses';
import { usePromotions } from '../hooks/usePromotions';
import { friendlyError } from '../hooks/useTable';
import { CourseForm } from '../components/admin/CourseForm';
import { PromotionForm } from '../components/admin/PromotionForm';
import { SettingsForm } from '../components/admin/SettingsForm';
import { Button, DeleteButton, ErrorBox, Field, IconButton, StatusBadge, inputClass, useToast } from '../components/admin/ui';
import { Logo } from '../components/Logo';
import { courseImage, prepareCourses, promotionStatus } from '../lib/courses';

/* ---------- Accesso ---------- */

const LoginView = ({ isDemo }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      await login(email.trim(), password);
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  };

  return (
    <div className="flex min-h-[100svh] items-center justify-center bg-ink px-5 py-10">
      <form onSubmit={submit} className="w-full max-w-sm space-y-6">
        <div>
          <Logo className="h-16 w-auto" />
          <h1 className="display mt-6 text-[2.75rem] text-paper">Area gestione</h1>
          <p className="mt-1 text-mute">Accedi per modificare corsi, offerte e informazioni del sito.</p>
        </div>
        {isDemo && (
          <p className="rounded-[4px] border border-sun/40 bg-sun/10 px-3.5 py-3 text-sm text-paper">
            Modalità prova locale: va bene qualsiasi email e password. Le modifiche restano solo in questo browser.
          </p>
        )}
        <Field label="Email" htmlFor="l-email">
          <input id="l-email" type="email" autoComplete="username" autoCapitalize="none" required value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} />
        </Field>
        <Field label="Password" htmlFor="l-pass">
          <input id="l-pass" type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} className={inputClass} />
        </Field>
        <ErrorBox>{error}</ErrorBox>
        <Button type="submit" loading={busy} className="w-full">Accedi</Button>
      </form>
    </div>
  );
};

/* ---------- Elenco ordinabile (corsi e offerte) ---------- */

const ListRow = ({ thumb, title, meta, badges, isFirst, isLast, visible, onUp, onDown, onToggle, onEdit, onDelete }) => (
  <li className="flex flex-wrap items-center gap-x-3 gap-y-1.5 border-b border-line py-3.5 sm:flex-nowrap">
    <button type="button" onClick={onEdit} className="flex min-w-0 basis-full items-center gap-3.5 text-left sm:basis-auto sm:flex-1">
      {thumb}
      <span className="min-w-0">
        <span className={`block text-base font-bold leading-snug sm:truncate ${visible ? 'text-paper' : 'text-mute line-through decoration-1'}`}>{title}</span>
        <span className="mt-1 flex flex-wrap items-center gap-1.5 text-sm text-mute">
          {badges}
          {meta && <span className="truncate">{meta}</span>}
        </span>
      </span>
    </button>
    <div className="ml-auto flex items-center">
      <IconButton label="Sposta su" onClick={onUp} disabled={isFirst}><ChevronUp size={20} aria-hidden="true" /></IconButton>
      <IconButton label="Sposta giù" onClick={onDown} disabled={isLast}><ChevronDown size={20} aria-hidden="true" /></IconButton>
      <IconButton label={visible ? 'Nascondi dal sito' : 'Mostra sul sito'} onClick={onToggle}>
        {visible ? <Eye size={18} strokeWidth={1.75} aria-hidden="true" /> : <EyeOff size={18} strokeWidth={1.75} aria-hidden="true" />}
      </IconButton>
      <IconButton label="Modifica" onClick={onEdit}><Pencil size={18} strokeWidth={1.75} aria-hidden="true" /></IconButton>
      <DeleteButton onConfirm={onDelete} />
    </div>
  </li>
);

const ListHeader = ({ title, count, onAdd, addLabel, note, loading }) => (
  <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
    <div>
      <h2 className="display text-[2.5rem] text-paper md:text-[3rem]">{title}</h2>
      <p className="mt-1 min-h-5 text-sm text-mute">{loading ? '' : `${count} in totale. ${note}`}</p>
    </div>
    <Button onClick={onAdd}><Plus size={18} aria-hidden="true" /> {addLabel}</Button>
  </div>
);

const Empty = ({ children }) => (
  <p className="rounded-[4px] border border-dashed border-line px-4 py-10 text-center text-mute">{children}</p>
);

/* ---------- Corsi ---------- */

const CoursesAdmin = ({ toast }) => {
  const { courses, loading, error, createCourse, updateCourse, deleteCourse, moveCourse, nextOrderIndex } = useCourses();
  const [editing, setEditing] = useState(null);
  const run = async (fn, okMessage) => {
    try { await fn(); if (okMessage) toast.show(okMessage); }
    catch (err) { toast.show(friendlyError(err, 'Operazione non riuscita.'), 'error'); }
  };

  if (editing) {
    return (
      <CourseForm
        initialData={editing.id ? editing : null}
        supportsNewFlag={courses.length === 0 || courses.some((c) => 'is_new' in c)}
        onCancel={() => setEditing(null)}
        onSubmit={async (data) => {
          if (editing.id) await updateCourse(editing.id, data);
          else await createCourse({ ...data, order_index: nextOrderIndex() });
          setEditing(null);
          toast.show(editing.id ? 'Corso aggiornato' : 'Corso aggiunto');
        }}
      />
    );
  }

  const withImages = prepareCourses(courses);
  return (
    <>
      <ListHeader title="Corsi" loading={loading} count={courses.length} onAdd={() => setEditing({})} addLabel="Nuovo corso" note="L'ordine qui è l'ordine sul sito, dentro ogni famiglia." />
      <ErrorBox>{error && friendlyError({ message: error }, 'Impossibile caricare i corsi.')}</ErrorBox>
      {loading ? <p className="py-10 text-mute">Caricamento…</p> : courses.length === 0 ? (
        <Empty>Nessun corso ancora. Aggiungi il primo con Nuovo corso.</Empty>
      ) : (
        <ul className="border-t border-line">
          {withImages.map((c, i) => (
            <ListRow
              key={c.id}
              thumb={<img src={courseImage(c, 160)} alt="" className="h-12 w-16 shrink-0 rounded-[4px] bg-ink-raised object-cover [filter:grayscale(1)]" />}
              title={c.title}
              meta={c.schedule && c.schedule !== 'Orari da definire' ? c.schedule : 'Orari non indicati'}
              badges={<>
                {!c.is_active && <StatusBadge tone="off">Nascosto</StatusBadge>}
                {c.is_new && <StatusBadge tone="sun">Nuovo</StatusBadge>}
                {!c.image_url && <StatusBadge tone="warn">Senza foto</StatusBadge>}
              </>}
              visible={c.is_active}
              isFirst={i === 0}
              isLast={i === withImages.length - 1}
              onUp={() => run(() => moveCourse(c.id, -1))}
              onDown={() => run(() => moveCourse(c.id, 1))}
              onToggle={() => run(() => updateCourse(c.id, { is_active: !c.is_active }), c.is_active ? 'Corso nascosto' : 'Corso visibile')}
              onEdit={() => setEditing(c)}
              onDelete={() => run(() => deleteCourse(c.id), 'Corso eliminato')}
            />
          ))}
        </ul>
      )}
    </>
  );
};

/* ---------- Offerte ---------- */

const STATUS = {
  live: ['live', 'Attiva'],
  scheduled: ['warn', 'Programmata'],
  expired: ['off', 'Scaduta'],
  hidden: ['off', 'Nascosta'],
};

const PromotionsAdmin = ({ toast }) => {
  const { promotions, loading, error, createPromotion, updatePromotion, deletePromotion, movePromotion, nextOrderIndex } = usePromotions();
  const [editing, setEditing] = useState(null);
  const run = async (fn, okMessage) => {
    try { await fn(); if (okMessage) toast.show(okMessage); }
    catch (err) { toast.show(friendlyError(err, 'Operazione non riuscita.'), 'error'); }
  };

  if (editing) {
    return (
      <PromotionForm
        initialData={editing.id ? editing : null}
        onCancel={() => setEditing(null)}
        onSubmit={async (data) => {
          if (editing.id) await updatePromotion(editing.id, data);
          else await createPromotion({ ...data, order_index: nextOrderIndex() });
          setEditing(null);
          toast.show(editing.id ? 'Offerta aggiornata' : 'Offerta aggiunta');
        }}
      />
    );
  }

  const liveCount = promotions.filter((p) => promotionStatus(p) === 'live').length;
  return (
    <>
      <ListHeader
        title="Offerte"
        loading={loading}
        count={promotions.length}
        onAdd={() => setEditing({})}
        addLabel="Nuova offerta"
        note={`${liveCount} visibili ora sul sito. Le scadute spariscono da sole.`}
      />
      <ErrorBox>{error && friendlyError({ message: error }, 'Impossibile caricare le offerte.')}</ErrorBox>
      {loading ? <p className="py-10 text-mute">Caricamento…</p> : promotions.length === 0 ? (
        <Empty>Nessuna offerta. Quando ne aggiungi una, sul sito compare la sezione Offerte.</Empty>
      ) : (
        <ul className="border-t border-line">
          {promotions.map((p, i) => {
            const [tone, label] = STATUS[promotionStatus(p)];
            const dates = [p.valid_from && `dal ${p.valid_from}`, p.valid_to && `al ${p.valid_to}`].filter(Boolean).join(' ');
            return (
              <ListRow
                key={p.id}
                thumb={<span className="flex h-12 w-16 shrink-0 items-center justify-center rounded-[4px] bg-sun px-1 text-center"><span className="display truncate text-[1.25rem] text-ink">{p.price}</span></span>}
                title={p.title}
                meta={dates}
                badges={<StatusBadge tone={tone}>{label}</StatusBadge>}
                visible={p.is_active}
                isFirst={i === 0}
                isLast={i === promotions.length - 1}
                onUp={() => run(() => movePromotion(p.id, -1))}
                onDown={() => run(() => movePromotion(p.id, 1))}
                onToggle={() => run(() => updatePromotion(p.id, { is_active: !p.is_active }), p.is_active ? 'Offerta nascosta' : 'Offerta visibile')}
                onEdit={() => setEditing(p)}
                onDelete={() => run(() => deletePromotion(p.id), 'Offerta eliminata')}
              />
            );
          })}
        </ul>
      )}
    </>
  );
};

/* ---------- Pagina ---------- */

const TABS = [
  { id: 'courses', label: 'Corsi' },
  { id: 'promotions', label: 'Offerte' },
  { id: 'settings', label: 'Info palestra' },
];

export const AdminPage = () => {
  const { user, logout, loading, isDemo } = useAuth();
  const [tab, setTab] = useState('courses');
  const toast = useToast();

  if (loading) return <div className="flex min-h-[100svh] items-center justify-center bg-ink text-mute">Caricamento…</div>;
  if (!user) return <LoginView isDemo={isDemo} />;

  return (
    <div className="min-h-[100svh] bg-ink text-paper">
      <header className="sticky top-0 z-40 border-b border-line bg-ink pt-[env(safe-area-inset-top)]">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between gap-3 px-4 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <Logo className="h-11 w-auto" />
            <div className="min-w-0">
              <p className="display text-[1.25rem] leading-none">Gestione sito</p>
              <p className="truncate text-xs text-mute">{user.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <a href="/" target="_blank" rel="noopener noreferrer" className="btn btn-ghost min-h-10 px-3 text-sm">
              <ExternalLink size={16} aria-hidden="true" /> <span className="hidden sm:inline">Vedi sito</span>
            </a>
            <IconButton label="Esci" onClick={logout}><LogOut size={18} aria-hidden="true" /></IconButton>
          </div>
        </div>
        <nav aria-label="Sezioni" className="mx-auto max-w-5xl px-4 sm:px-6">
          <ul className="flex gap-1 overflow-x-auto [scrollbar-width:none]">
            {TABS.map((t) => (
              <li key={t.id}>
                <button
                  type="button"
                  onClick={() => setTab(t.id)}
                  aria-current={tab === t.id ? 'page' : undefined}
                  className={`relative whitespace-nowrap px-3 py-3 text-[0.9375rem] font-semibold transition-colors ${tab === t.id ? 'text-paper' : 'text-mute hover:text-paper'}`}
                >
                  {t.label}
                  {tab === t.id && <span className="absolute inset-x-3 bottom-0 h-0.5 bg-sun" />}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      {import.meta.env.DEV && isDemo && (
        <div className="mx-auto mt-4 flex max-w-5xl flex-wrap items-center gap-x-4 gap-y-1 px-4 text-sm text-sun sm:px-6">
          <p>Modalità prova locale: le modifiche si vedono sul sito in questo browser, ma non sono salvate su Supabase.</p>
          <button
            type="button"
            onClick={async () => {
              const { resetDevDb } = await import('../lib/devStore');
              resetDevDb();
              window.location.reload();
            }}
            className="font-semibold text-paper underline underline-offset-4"
          >
            Ripristina dati di prova
          </button>
        </div>
      )}

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 md:py-10">
        {tab === 'courses' && <CoursesAdmin key="c" toast={toast} />}
        {tab === 'promotions' && <PromotionsAdmin key="p" toast={toast} />}
        {tab === 'settings' && (
          <>
            <div className="mb-8">
              <h2 className="display text-[2.5rem] text-paper md:text-[3rem]">Info palestra</h2>
              <p className="mt-1 text-sm text-mute">Contatti, orari e mappa mostrati nella sezione Contatti e nei pulsanti del sito.</p>
            </div>
            <SettingsForm onSaved={() => toast.show('Informazioni salvate')} />
          </>
        )}
      </main>
      {toast.node}
    </div>
  );
};
