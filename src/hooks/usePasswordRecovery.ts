// src/hooks/usePasswordRecovery.ts
"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

type RecoveryStatus = 'LOADING' | 'AUTHENTICATED' | 'UNAUTHENTICATED';

export function usePasswordRecovery(): RecoveryStatus {
  const [status, setStatus] = useState<RecoveryStatus>('LOADING');
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const timeoutId = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    console.log("--- [usePasswordRecovery] 🚀 HOOK MOUNTED ---");

    // --- 1. Robust, Copilot-Powered Recovery Flow Detection ---
    console.log("[usePasswordRecovery] 🔍 Performing multi-signal recovery detection...");

    // Signal A: Is the user physically on the update-password page?
    const isOnUpdatePasswordPage = pathname === '/update-password';
    console.log(`[usePasswordRecovery]   - Signal A (Pathname): On /update-password page? ${isOnUpdatePasswordPage}`);

    // Signal B: Does the URL hash contain classic recovery info?
    const hasRecoveryHash = typeof window !== 'undefined' && 
      (window.location.hash.includes('type=recovery') || window.location.hash.includes('access_token'));
    console.log(`[usePasswordRecovery]   - Signal B (URL Hash): Hash contains recovery token? ${hasRecoveryHash}`);
      
    // Signal C: Do the URL query params contain recovery info?
    const hasRecoveryParams = searchParams.has('token') || searchParams.has('access_token');
    console.log(`[usePasswordRecovery]   - Signal C (URL Params): Search params contain recovery token? ${hasRecoveryParams}`);

    // Signal D: Was this a redirect from Supabase that was INTENDED for the update-password page?
    const isRedirectedToRecovery = searchParams.get('redirect_to')?.includes('/update-password') ?? false;
    console.log(`[usePasswordRecovery]   - Signal D (Redirect Intent): Was redirected to recovery page? ${isRedirectedToRecovery}`);
    
    // FINAL VERDICT: The flow is a recovery flow if ANY of these signals are true.
    const isRecoveryFlow = isOnUpdatePasswordPage || hasRecoveryHash || hasRecoveryParams || isRedirectedToRecovery;
    console.log(`[usePasswordRecovery] ✅ FINAL VERDICT: Is this a recovery flow? ${isRecoveryFlow}`);
    console.log("-----------------------------------------");

    // If it's not a recovery flow, do nothing. This hook is only for the update-password page.
    // Let the middleware and other components handle redirects.
    if (!isRecoveryFlow) {
      console.log("[usePasswordRecovery] Not a recovery flow. Hook will stand down.");
      setStatus('UNAUTHENTICATED'); // Set a safe default
      router.replace('/login');
      return;
    }

    // --- 2. Auth State Listener ---
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log(`[usePasswordRecovery] 🔔 EVENT RECEIVED: ${event}. Session exists: ${!!session}`);

      if (event === 'PASSWORD_RECOVERY') {
        console.log("[usePasswordRecovery]   ✅ SUCCESS: PASSWORD_RECOVERY event is the golden ticket. Authenticating.");
        if (timeoutId.current) {
          console.log("[usePasswordRecovery]     - Clearing fallback timeout.");
          clearTimeout(timeoutId.current);
        }
        if (typeof window !== 'undefined') {
          console.log("[usePasswordRecovery]     - Scrubbing token from URL for security.");
          window.history.replaceState({}, document.title, window.location.pathname);
        }
        setStatus('AUTHENTICATED');
        return;
      }

      if (event === 'INITIAL_SESSION') {
        console.log("[usePasswordRecovery]   - Handling INITIAL_SESSION event.");
        // Because isRecoveryFlow is TRUE, we always wait.
        console.log("[usePasswordRecovery]     - ⏳ This is a recovery flow. WAITING for PASSWORD_RECOVERY event or timeout. No action taken.");
      }
    });

    // --- 3. Fallback Timeout ---
    console.log("[usePasswordRecovery] ⏰ Setting up 3-second fallback timeout in case token is expired/invalid.");
    timeoutId.current = setTimeout(() => {
      console.log("[usePasswordRecovery] ⏰ TIMEOUT FIRED. PASSWORD_RECOVERY event never arrived. REDIRECTING to /login.");
      router.replace('/login?error=expired_token');
    }, 3000);

    // --- 4. Cleanup ---
    return () => {
      console.log("[usePasswordRecovery] 🧹 Unsubscribing and cleaning up on component unmount.");
      subscription.unsubscribe();
      if (timeoutId.current) clearTimeout(timeoutId.current);
    };
  }, [router, searchParams, pathname]);

  return status;
}