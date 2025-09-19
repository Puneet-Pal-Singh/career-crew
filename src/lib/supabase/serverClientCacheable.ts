// src/lib/supabase/serverClientCacheable.ts
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database.types'; // It's good practice to use our types

/**
 * Creates a Supabase client suitable for use in functions cached with `unstable_cache`.
 * This client is for public, anonymous data fetching and DOES NOT use cookies.
 */
export const getSupabaseServerClientCacheable = () => {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
};