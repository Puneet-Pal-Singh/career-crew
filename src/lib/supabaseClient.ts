// src/lib/supabaseClient.ts
import { createClient, SupabaseClient, User as SupabaseUserType } from '@supabase/supabase-js';

// Ensure your environment variables are correctly typed or handled if undefined
const supabaseUrl: string = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey: string = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Basic check for environment variables
if (!supabaseUrl) {
  throw new Error(
    "Supabase URL is missing. Ensure NEXT_PUBLIC_SUPABASE_URL is set in your .env.local file."
  );
}
if (!supabaseAnonKey) {
  throw new Error(
    "Supabase Anon Key is missing. Ensure NEXT_PUBLIC_SUPABASE_ANON_KEY is set in your .env.local file."
  );
}

// Create and export the Supabase client
// We export the SupabaseClient type for convenience in other parts of the app
export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey);

// You can also export types if needed elsewhere, for example:
export type SupabaseUser = SupabaseUserType;