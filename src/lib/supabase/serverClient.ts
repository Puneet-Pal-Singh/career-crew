// src/lib/supabase/serverClient.ts
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers'; // For Next.js 15, cookies() returns a Promise
import type { SupabaseClient } from '@supabase/supabase-js';

/**
 * Creates a Supabase client instance suitable for use in Next.js Server Components,
 * Server Actions, and Route Handlers. It correctly handles cookie management for
 * server-side Supabase operations, supporting asynchronous cookie retrieval for Next.js 15+.
 * 
 * @returns {Promise<SupabaseClient>} A promise that resolves to a Supabase client instance.
 */
export const getSupabaseServerClient = async (): Promise<SupabaseClient> => {
  const cookieStoreInstance = await cookies(); // Await for Next.js 15+

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStoreInstance.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStoreInstance.set(name, value, options);
          } catch (error) {
            console.error(`Supabase Server Client: Failed to set cookie "${name}". Error:`, error);
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStoreInstance.set(name, '', { ...options, maxAge: 0 });
          } catch (error) {
            console.error(`Supabase Server Client: Failed to remove cookie "${name}". Error:`, error);
          }
        },
      },
    }
  );
};