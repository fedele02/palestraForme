// SOLO SVILUPPO LOCALE: piccolo "database" nel browser (localStorage) che imita Supabase,
// così sito e area admin si possono provare senza un progetto Supabase attivo.
// In produzione non viene mai caricato (gli hook lo importano solo con import.meta.env.DEV).
import { devCourses, devPromotions, devSettings } from './devData';

const KEY = 'forme-dev-db-v1';

const seed = () => ({
  courses: devCourses.map((c) => ({ ...c })),
  promotions: devPromotions.map((p) => ({ ...p })),
  site_settings: { ...devSettings },
});

const read = () => {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* localStorage non disponibile: si riparte dai dati iniziali */ }
  const db = seed();
  write(db);
  return db;
};

const write = (db) => {
  try {
    localStorage.setItem(KEY, JSON.stringify(db));
  } catch {
    throw new Error('Spazio del browser esaurito: prova con una foto più leggera.');
  }
};

const byOrder = (a, b) => (a.order_index ?? 0) - (b.order_index ?? 0);
const newId = (prefix) => `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
const delay = () => new Promise((r) => setTimeout(r, 120));

export const devTable = (table) => ({
  async list() {
    await delay();
    return [...read()[table]].sort(byOrder);
  },
  async insert(row) {
    await delay();
    const db = read();
    const created = { id: newId(table), created_at: new Date().toISOString(), ...row };
    db[table].push(created);
    write(db);
    return created;
  },
  async update(id, changes) {
    await delay();
    const db = read();
    const i = db[table].findIndex((r) => r.id === id);
    if (i === -1) throw new Error('Elemento non trovato.');
    db[table][i] = { ...db[table][i], ...changes, updated_at: new Date().toISOString() };
    write(db);
    return db[table][i];
  },
  async remove(id) {
    await delay();
    const db = read();
    db[table] = db[table].filter((r) => r.id !== id);
    write(db);
  },
});

export const devSettingsStore = {
  async get() {
    await delay();
    return { ...read().site_settings };
  },
  async upsert(values) {
    await delay();
    const db = read();
    db.site_settings = { ...db.site_settings, ...values };
    write(db);
  },
};

// Login di prova: accetta qualsiasi email e password non vuote
const AUTH_KEY = 'forme-dev-auth';
export const devAuth = {
  getUser() {
    try {
      const raw = localStorage.getItem(AUTH_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },
  login(email) {
    const user = { id: 'dev-admin', email };
    localStorage.setItem(AUTH_KEY, JSON.stringify(user));
    return user;
  },
  logout() {
    localStorage.removeItem(AUTH_KEY);
  },
};

export const resetDevDb = () => {
  localStorage.removeItem(KEY);
};
