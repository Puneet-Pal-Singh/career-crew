// src/app/auth/callback/route.ts
import { NextResponse, type NextRequest } from 'next/server';
import { type CookieOptions, createServerClient } from '@supabase/ssr';

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const intendedRole = searchParams.get('intended_role');
  
  // Build the redirect URL first, passing the role intent to the onboarding page.
  let next = '/onboarding/complete-profile';
  if (intendedRole) {
    next = `${next}?intended_role=${intendedRole}`;
  }
  const response = NextResponse.redirect(new URL(next, origin));

  if (code) {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) { return request.cookies.get(name)?.value; },
          set(name: string, value: string, options: CookieOptions) { response.cookies.set({ name, value, ...options }); },
          remove(name: string, options: CookieOptions) { response.cookies.set({ name, value: '', ...options }); },
        },
      }
    );
    
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error) {
      // Safeguard: Force a session refresh to ensure the browser's cookie
      // has the initial JWT metadata from our database trigger.
      await supabase.auth.refreshSession();
      return response;
    }
  }

  console.error("Authentication callback error:", searchParams.get('error_description'));
  return NextResponse.redirect(new URL('/auth/auth-code-error', origin));
}