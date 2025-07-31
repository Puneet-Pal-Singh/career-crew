// src/app/auth/callback/route.ts
import { NextResponse, type NextRequest } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabase/serverClient';

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const intendedRole = searchParams.get('intended_role');

  if (!code) {
    return NextResponse.redirect(`${origin}/auth/auth-code-error`);
  }

  const supabase = await getSupabaseServerClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error('Callback Error:', error.message);
    return NextResponse.redirect(`${origin}/auth/auth-code-error`);
  }
  
  // ✅ THE FIX: Simply forward the intended_role to the onboarding page.
  // This avoids all race conditions.
  const redirectParams = new URLSearchParams();
  if (intendedRole === 'EMPLOYER' || intendedRole === 'JOB_SEEKER') {
    redirectParams.set('intended_role', intendedRole);
  }

  return NextResponse.redirect(`${origin}/onboarding/complete-profile?${redirectParams.toString()}`);
}