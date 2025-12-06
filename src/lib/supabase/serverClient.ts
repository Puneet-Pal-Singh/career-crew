// src/lib/supabase/serverClient.ts
import { createServerClient, type CookieOptions  } from '@supabase/ssr';
import { cookies } from 'next/headers';

/**
 * Creates a Supabase client instance suitable for use in Next.js Server Components,
 * Server Actions, and Route Handlers. It correctly handles cookie management for
 * server-side Supabase operations, supporting asynchronous cookie retrieval for Next.js 15+.
 */
export const getSupabaseServerClient = async () => {
  const cookieStoreInstance = await cookies();
  
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStoreInstance.getAll();
        },
        // ✅ FIX: Explicitly type the 'cookiesToSet' parameter
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStoreInstance.set(name, value, options);
            });
          } catch (error) {
            console.error('Supabase Server Client: Failed to set cookies. Error:', error);
          }
        },
      },
    }
  );
};