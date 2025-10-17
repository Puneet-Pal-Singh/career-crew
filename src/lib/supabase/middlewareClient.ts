// src/lib/supabase/middlewareClient.ts
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { type NextRequest, type NextResponse } from 'next/server';

/**
 * SRP: This file's ONLY responsibility is to create a Supabase client
 * specifically for use within Next.js middleware.
 */
export const createSupabaseMiddlewareClient = (
  request: NextRequest,
  response: NextResponse
) => {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        // THE FIX: Use the modern getAll/setAll API to avoid deprecation warnings.
        // This is more efficient and aligns with the latest @supabase/ssr standards.
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              request.cookies.set(name, value); // Required for Server Components to see the change
              response.cookies.set({ name, value, ...options });
            });
          } catch (error) {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
            console.error("Middleware: Failed to set cookies.", error)
          }
        },
      },
    }
  );
};