import { useCallback, useEffect, useState } from 'react';
import { supabase, isDevData } from '../lib/supabase';

const devMode = import.meta.env.DEV && isDevData;
// In produzione loadDev è null: il database di prova non finisce nel sito pubblicato
const loadDev = import.meta.env.DEV ? (table) => import('../lib/devStore').then((m) => m.devTable(table)) : null;

const byOrder = (a, b) => (a.order_index ?? 0) - (b.order_index ?? 0);

// Messaggi di errore leggibili per chi gestisce la palestra
export const friendlyError = (err, fallback) => {
  const msg = err?.message || '';
  if (/failed to fetch|network/i.test(msg)) return 'Connessione assente: controlla internet e riprova.';
  if (/jwt|permission|row-level|not authorized|401|403/i.test(msg)) return 'Sessione scaduta o permessi mancanti: esci e accedi di nuovo.';
  return msg || fallback;
};

// Lettura e scrittura di una tabella ordinata (corsi, promozioni) su Supabase,
// o sul database di prova nel browser durante lo sviluppo locale.
export const useTable = (table) => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refetch = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      if (devMode) {
        setRows(await (await loadDev(table)).list());
        return;
      }
      const { data, error: err } = await supabase.from(table).select('*').order('order_index', { ascending: true });
      if (err) throw err;
      setRows(data || []);
    } catch (err) {
      setError(err.message);
      console.error(`Error fetching ${table}:`, err);
    } finally {
      setLoading(false);
    }
  }, [table]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const create = async (values) => {
    const row = devMode
      ? await (await loadDev(table)).insert(values)
      : await (async () => {
        const { data, error: err } = await supabase.from(table).insert([values]).select().single();
        if (err) throw err;
        return data;
      })();
    setRows((prev) => [...prev, row].sort(byOrder));
    return row;
  };

  const update = async (id, values) => {
    const row = devMode
      ? await (await loadDev(table)).update(id, values)
      : await (async () => {
        const { data, error: err } = await supabase
          .from(table)
          .update({ ...values, updated_at: new Date() })
          .eq('id', id)
          .select()
          .single();
        if (err) throw err;
        return data;
      })();
    setRows((prev) => prev.map((r) => (r.id === id ? row : r)).sort(byOrder));
    return row;
  };

  const remove = async (id) => {
    if (devMode) await (await loadDev(table)).remove(id);
    else {
      const { error: err } = await supabase.from(table).delete().eq('id', id);
      if (err) throw err;
    }
    setRows((prev) => prev.filter((r) => r.id !== id));
  };

  // Sposta un elemento su o giù di una posizione: riscrive gli order_index a passi di 10
  const move = async (id, direction) => {
    const sorted = [...rows].sort(byOrder);
    const i = sorted.findIndex((r) => r.id === id);
    const j = i + direction;
    if (i < 0 || j < 0 || j >= sorted.length) return;
    [sorted[i], sorted[j]] = [sorted[j], sorted[i]];
    const previous = new Map(rows.map((r) => [r.id, r.order_index]));
    const next = sorted.map((r, k) => ({ ...r, order_index: (k + 1) * 10 }));
    const changed = next.filter((r) => previous.get(r.id) !== r.order_index);
    setRows(next);
    try {
      for (const r of changed) {
        if (devMode) await (await loadDev(table)).update(r.id, { order_index: r.order_index });
        else {
          const { error: err } = await supabase.from(table).update({ order_index: r.order_index }).eq('id', r.id);
          if (err) throw err;
        }
      }
    } catch (err) {
      await refetch();
      throw err;
    }
  };

  const nextOrderIndex = () => (rows.length ? Math.max(...rows.map((r) => r.order_index ?? 0)) + 10 : 10);

  return { rows, loading, error, refetch, create, update, remove, move, nextOrderIndex };
};
