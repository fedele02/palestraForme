import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// In sviluppo, senza chiavi reali (o con VITE_USE_DEV_DATA=true nel .env),
// gli hook leggono i dati di src/lib/devData.js. In produzione è sempre false.
export const isDevData =
  import.meta.env.DEV &&
  (import.meta.env.VITE_USE_DEV_DATA === 'true' || !supabaseUrl || supabaseUrl.includes('your-project'));

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder'
);
