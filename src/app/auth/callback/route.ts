// src/app/auth/callback/route.ts

import { NextResponse, type NextRequest } from 'next/server';
// ✅ Import YOUR excellent helper function.
import { getSupabaseServerClient } from '@/lib/supabase/serverClient';
// This import is still needed for the logic below.
import { isValidInternalPath } from "@/lib/utils";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');

  // If there is a code, we will attempt to exchange it for a session.
  if (code) {
    // ✅ THE FIX: Use your helper function to get the Supabase client.
    // This correctly handles the async cookies and encapsulates the logic.
    const supabase = await getSupabaseServerClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    // If the exchange is successful, we proceed.
    if (!error) {
      // Preserve the original file's logic for constructing the redirect URL.
      const intendedRole = searchParams.get('intended_role');
      const afterSignIn = searchParams.get('after_sign_in');
      const allowedRoles = ['JOB_SEEKER', 'EMPLOYER'];
      const validatedRole = intendedRole && allowedRoles.includes(intendedRole) ? intendedRole : null;

      const redirectParams = new URLSearchParams();
      if (validatedRole) {
        redirectParams.set('intended_role', validatedRole);
      }
      if (isValidInternalPath(afterSignIn)) {
        redirectParams.set('after_sign_in', afterSignIn);
      }
      
      const next = `/onboarding/complete-profile?${redirectParams.toString()}`;
      // Redirect the user to the next step in the flow.
      return NextResponse.redirect(new URL(next, origin));
    }
  }

  // If there was no code, or if the code exchange failed, redirect to an error page.
  console.error("Authentication callback error:", searchParams.get('error_description'));
  return NextResponse.redirect(new URL('/auth/auth-code-error', origin));
}