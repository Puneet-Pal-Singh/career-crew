// src/app/auth/callback/route.ts
import { NextResponse, type NextRequest } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabase/serverClient';
import { getPostAuthRedirectUrl } from '@/lib/utils';

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const intendedRole = searchParams.get('intended_role');
  const redirectTo = searchParams.get('redirectTo');

  if (!code) {
    return NextResponse.redirect(`${origin}/auth/auth-code-error`);
  }

  const supabase = await getSupabaseServerClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error('Callback Error:', error.message);
    return NextResponse.redirect(`${origin}/auth/auth-code-error`);
  }

  // Check if user needs onboarding
  const { data: { user } } = await supabase.auth.getUser();
  
  // --- THE CRITICAL FIX: Treat 'undefined' as needing onboarding ---
  const needsOnboarding = user?.app_metadata?.onboarding_complete !== true;

  if (needsOnboarding) {
    const redirectParams = new URLSearchParams();
    if (intendedRole === 'EMPLOYER' || intendedRole === 'JOB_SEEKER') {
      redirectParams.set('intended_role', intendedRole);
    }
    if (redirectTo) {
      redirectParams.set('redirectTo', redirectTo);
    }
    return NextResponse.redirect(`${origin}/onboarding/complete-profile?${redirectParams.toString()}`);
  }

  // If no onboarding needed, redirect to the validated URL or dashboard
  const finalRedirectTo = getPostAuthRedirectUrl(redirectTo);
  return NextResponse.redirect(`${origin}${finalRedirectTo}`);
}