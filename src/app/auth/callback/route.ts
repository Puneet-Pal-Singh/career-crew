// src/app/auth/callback/route.ts
import { NextResponse, type NextRequest } from 'next/server';
import { type CookieOptions, createServerClient } from '@supabase/ssr';

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/dashboard';

  // FIX: Create a response object at the beginning of the function.
  // This allows us to use the same synchronous cookie handling pattern as the middleware.
  const response = NextResponse.redirect(new URL(next, origin));

  if (code) {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          // Use the request object to get cookies.
          get(name: string) {
            return request.cookies.get(name)?.value;
          },
          // Use the response object to set cookies.
          set(name: string, value: string, options: CookieOptions) {
            response.cookies.set({ name, value, ...options });
          },
          // Use the response object to remove cookies.
          remove(name: string, options: CookieOptions) {
            response.cookies.set({ name, value: '', ...options });
          },
        },
      }
    );
    
    // Exchange the code for a session. This will automatically set the
    // session cookie on the 'response' object we created earlier.
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      // Return the response object, which now contains the session cookie and the redirect header.
      return response;
    }
  }

  // If there's an error at any point, redirect to our error page.
  console.error("Authentication callback error:", searchParams.get('error_description'));
  return NextResponse.redirect(new URL('/auth/auth-code-error', origin));
}