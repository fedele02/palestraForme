import { useCallback, useEffect, useState } from 'react';
import { supabase, isDevData } from '../lib/supabase';

const devMode = import.meta.env.DEV && isDevData;
const loadDev = import.meta.env.DEV ? () => import('../lib/devStore').then((m) => m.devSettingsStore) : null;

// Impostazioni del sito (chiave/valore): telefono, email, indirizzo, orari, social, mappa...
export const useSiteSettings = () => {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refetch = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      if (devMode) {
        setSettings(await (await loadDev()).get());
        return;
      }
      const { data, error: err } = await supabase.from('site_settings').select('*');
      if (err) throw err;
      const map = {};
      (data || []).forEach((item) => { map[item.key] = item.value; });
      setSettings(map);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching settings:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const updateMultipleSettings = async (values) => {
    if (devMode) await (await loadDev()).upsert(values);
    else {
      const updates = Object.entries(values).map(([key, value]) => ({ key, value: value ?? '' }));
      const { error: err } = await supabase.from('site_settings').upsert(updates);
      if (err) throw err;
    }
    setSettings((prev) => ({ ...prev, ...values }));
    return true;
  };

  const updateSetting = (key, value) => updateMultipleSettings({ [key]: value });

  return { settings, loading, error, refetch, updateSetting, updateMultipleSettings };
};
