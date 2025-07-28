import { NextResponse, type NextRequest } from 'next/server';
import { type CookieOptions, createServerClient } from '@supabase/ssr';
// Import the security utility
import { isValidInternalPath } from "@/lib/utils";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const intendedRole = searchParams.get('intended_role');
  
  // FIX: Get the after_sign_in parameter
  const afterSignIn = searchParams.get('after_sign_in');

  const allowedRoles = ['JOB_SEEKER', 'EMPLOYER'];
  const validatedRole = intendedRole && allowedRoles.includes(intendedRole) ? intendedRole : null;

  // FIX: Use URLSearchParams to safely construct the redirect URL
  const redirectParams = new URLSearchParams();
  if (validatedRole) {
    redirectParams.set('intended_role', validatedRole);
  }

  // --- FIX: Use the new robust validation function ---
  if (isValidInternalPath(afterSignIn)) {
    redirectParams.set('after_sign_in', afterSignIn);
  }
  
  const next = `/onboarding/complete-profile?${redirectParams.toString()}`;
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
      await supabase.auth.refreshSession();
      return response;
    }
  }

  console.error("Authentication callback error:", searchParams.get('error_description'));
  return NextResponse.redirect(new URL('/auth/auth-code-error', origin));
}