import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Usamos el cliente sin tipos estrictos durante el desarrollo
// Una vez creadas las tablas, regenerar tipos con: npx supabase gen types typescript
export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Helper para generar email sintético desde identificación
export const generateSyntheticEmail = (identification: string): string => {
  return `${identification}@gustavogarcia.co`;
};

// Helper para extraer identificación desde email sintético
export const extractIdentificationFromEmail = (email: string): string => {
  return email.replace('@gustavogarcia.co', '');
};
