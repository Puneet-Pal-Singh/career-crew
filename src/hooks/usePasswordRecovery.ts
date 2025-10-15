// src/hooks/usePasswordRecovery.ts
"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

type RecoveryStatus = 'LOADING' | 'AUTHENTICATED' | 'UNAUTHENTICATED';

/**
 * A robust hook to manage the client-side logic for the password recovery flow.
 * It now explicitly handles the PKCE code exchange to trigger the recovery event.
 */
export function usePasswordRecovery(): RecoveryStatus {
  const [status, setStatus] = useState<RecoveryStatus>('LOADING');
  const router = useRouter();
  const searchParams = useSearchParams();
  const timeoutId = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasProcessedRecovery = useRef(false);

  useEffect(() => {
    // --- 1. The Critical Missing Step: Explicitly Exchange the Code ---
    const exchangeCode = async () => {
      const code = searchParams.get('code');
      if (code) {
        console.log("[usePasswordRecovery] 🔑 Found PKCE code in URL. Attempting to exchange for session...");
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (error) {
          console.error("[usePasswordRecovery] ❌ Error exchanging code:", error.message);
          // If exchange fails, the token is bad. Redirect immediately.
          router.replace('/login?error=invalid_token');
        } else {
          console.log("[usePasswordRecovery] ✅ Code exchange successful. Waiting for PASSWORD_RECOVERY event.");
          // A successful exchange will trigger the onAuthStateChange listener with PASSWORD_RECOVERY.
        }
      }
    };
    
    // Run the exchange as soon as the hook mounts.
    exchangeCode();

    // --- 2. Robustly Detect if this is a Recovery Flow ---
    const hasRecoveryCode = searchParams.has('code');
    const isRecoveryFlow = hasRecoveryCode; // Simplified and now definitive

    console.log(`[usePasswordRecovery] 🔍 Is this a recovery flow? ${isRecoveryFlow}`);

    // --- 3. Listen for Supabase Auth Events ---
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log(`[usePasswordRecovery] 🔔 onAuthStateChange event received: ${event}. Session exists: ${!!session}`);
      
      // The ONLY event that confirms a valid recovery token. This will now fire after the exchange.
      if (event === 'PASSWORD_RECOVERY') {
        console.log("[usePasswordRecovery] ✅ PASSWORD_RECOVERY event SUCCESS. Setting status to AUTHENTICATED.");
        if (timeoutId.current) clearTimeout(timeoutId.current);
        hasProcessedRecovery.current = true;
        
        if (typeof window !== 'undefined') {
          window.history.replaceState({}, document.title, window.location.pathname);
        }
        setStatus('AUTHENTICATED');
        return;
      }

      // Handle initial page load.
      if (event === 'INITIAL_SESSION') {
        if (isRecoveryFlow) {
          console.log("[usePasswordRecovery] ⏳ INITIAL_SESSION on recovery flow. WAITING for PASSWORD_RECOVERY or timeout.");
          return;
        }

        if (session) {
          router.replace('/dashboard');
        } else {
          router.replace('/login?error=invalid_token');
        }
      }
    });

    // --- 4. Set a Fallback Timeout ---
    if (isRecoveryFlow) {
      console.log("[usePasswordRecovery] ⏰ Setting up 5-second fallback timeout for expired token.");
      timeoutId.current = setTimeout(() => {
        if (!hasProcessedRecovery.current) {
          router.replace('/login?error=expired_token');
        }
      }, 5000);
    }

    // --- 5. Cleanup ---
    return () => {
      subscription.unsubscribe();
      if (timeoutId.current) clearTimeout(timeoutId.current);
    };
  }, [router, searchParams]);

  return status;
}