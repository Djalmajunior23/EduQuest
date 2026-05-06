import { createClient } from '@supabase/supabase-js';

const env = (typeof import.meta !== 'undefined' && (import.meta as any).env) ? (import.meta as any).env : (typeof process !== 'undefined' ? process.env : {});

const supabaseUrl = env.VITE_SUPABASE_URL || import.meta.env?.VITE_SUPABASE_URL || '';
const supabaseKey = env.VITE_SUPABASE_ANON_KEY || import.meta.env?.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.warn(
    'Supabase configuration missing. Ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set in your environment.'
  );
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseKey || 'placeholder_key'
);

export const isSupabaseConfigured = !!(supabaseUrl && supabaseKey);
