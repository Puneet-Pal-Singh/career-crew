// src/lib/supabase/authHelpers.ts
import { supabase } from '@/lib/supabaseClient';

/**
 * Tries to exchange a PKCE code from the URL search params for a session.
 * This is a critical step for the password recovery flow to work.
 * It explicitly calls the necessary Supabase function instead of relying on
 * the client to do it automatically.
 */
export async function exchangeCodeForSession(): Promise<boolean> {
  const searchParams = new URLSearchParams(window.location.search);
  const code = searchParams.get('code');

  if (code) {
    console.log("[AuthHelper] 🔑 Found PKCE code in URL. Attempting to exchange for session...");
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (error) {
      console.error("[AuthHelper] ❌ Error exchanging code for session:", error.message);
      return false;
    }

    console.log("[AuthHelper] ✅ Code exchange successful.");
    // After a successful exchange, the `onAuthStateChange` listener will
    // now correctly receive the `PASSWORD_RECOVERY` event.
    return true;
  }
  
  return false;
}