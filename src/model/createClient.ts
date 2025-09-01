import { createClient, SupabaseClient } from '@supabase/supabase-js';

const {
    VITE_APP_SUPABASE_URL: url,
    VITE_APP_SUPABASE_ANON_KEY: anonKey
} = import.meta.env;

const supabaseUrl = url!;
const supabaseAnonKey = anonKey!;

export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey);