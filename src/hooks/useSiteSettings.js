import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export const useSiteSettings = () => {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('site_settings')
        .select('*');

      if (error) throw error;
      
      const settingsMap = {};
      if (data) {
        data.forEach(item => {
          settingsMap[item.key] = item.value;
        });
      }
      setSettings(settingsMap);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching settings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const updateSetting = async (key, value) => {
    try {
      const { error } = await supabase
        .from('site_settings')
        .upsert({ key, value });

      if (error) throw error;
      setSettings(prev => ({ ...prev, [key]: value }));
      return true;
    } catch (err) {
      console.error(`Error updating setting ${key}:`, err);
      throw err;
    }
  };

  const updateMultipleSettings = async (settingsObj) => {
    try {
      const updates = Object.entries(settingsObj).map(([key, value]) => ({ key, value }));
      const { error } = await supabase
        .from('site_settings')
        .upsert(updates);

      if (error) throw error;
      setSettings(prev => ({ ...prev, ...settingsObj }));
      return true;
    } catch (err) {
      console.error('Error updating multiple settings:', err);
      throw err;
    }
  };

  return { settings, loading, error, refetch: fetchSettings, updateSetting, updateMultipleSettings };
};
