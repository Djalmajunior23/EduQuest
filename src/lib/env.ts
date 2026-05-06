/**
 * Validation for Environment Variables
 * This ensures the app doesn't start in a broken state if VITE_* keys are missing.
 */

interface EnvSchema {
  VITE_SUPABASE_URL: string;
  VITE_SUPABASE_ANON_KEY: string;
  GEMINI_API_KEY?: string; // Optional if using proxy
  VITE_APP_ENV: 'development' | 'production' | 'test';
}

const getEnv = (key: string) => {
  const envObj = (typeof import.meta !== 'undefined' && (import.meta as any).env) ? (import.meta as any).env : (typeof process !== 'undefined' ? process.env : {});
  return envObj[key];
};

export const env = {
  VITE_SUPABASE_URL: getEnv('VITE_SUPABASE_URL') || (import.meta as any).env?.VITE_SUPABASE_URL,
  VITE_SUPABASE_ANON_KEY: getEnv('VITE_SUPABASE_ANON_KEY') || (import.meta as any).env?.VITE_SUPABASE_ANON_KEY,
  GEMINI_API_KEY: getEnv('GEMINI_API_KEY') || (import.meta as any).env?.GEMINI_API_KEY,
  VITE_APP_ENV: getEnv('VITE_APP_ENV') || (import.meta as any).env?.VITE_APP_ENV || 'production',
} as EnvSchema;

export const isEnvValid = () => {
  const required = [
    'VITE_SUPABASE_URL',
    'VITE_SUPABASE_ANON_KEY'
  ];
  
  const envObj = (typeof import.meta !== 'undefined' && (import.meta as any).env) ? (import.meta as any).env : (typeof process !== 'undefined' ? process.env : {});
  const missing = required.filter(key => !(envObj[key] || (import.meta as any).env?.[key]));
  
  if (missing.length > 0) {
    console.error(`Missing required environment variables: ${missing.join(', ')}`);
    return false;
  }
  
  return true;
};
