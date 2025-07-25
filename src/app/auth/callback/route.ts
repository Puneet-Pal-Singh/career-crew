// src/app/auth/callback/route.ts
import { NextResponse, type NextRequest } from 'next/server';
import { type CookieOptions, createServerClient } from '@supabase/ssr';

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const intendedRole = searchParams.get('intended_role');
  // Allowed roles for validation
  const allowedRoles = ['employer', 'job-seeker', 'admin'];
  let next = '/onboarding/complete-profile';
  // Only append intended_role if it is valid
  if (intendedRole && allowedRoles.includes(intendedRole)) {
    next = `${next}?intended_role=${intendedRole}`;
  }

  // FIX: Create a response object at the beginning, just like in the middleware.
  const response = NextResponse.redirect(new URL(next, origin));

  if (code) {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          // This is the correct, synchronous pattern that your project uses.
          get(name: string) {
            return request.cookies.get(name)?.value;
          },
          set(name: string, value: string, options: CookieOptions) {
            response.cookies.set({ name, value, ...options });
          },
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
      // Return the response object, which now has the session cookie and the redirect.
      return response;
    }
  }

  const errorDesc = searchParams.get('error_description');
  console.error("Authentication callback error:", errorDesc ? 'OAuth error occurred' : 'Unknown error');
  return NextResponse.redirect(new URL('/auth/auth-code-error', origin));
}