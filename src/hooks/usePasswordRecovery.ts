// src/hooks/usePasswordRecovery.ts
"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
// ✅ 1. ADD THIS IMPORT STATEMENT at the top of the file.
import { exchangeCodeForSession } from '@/lib/supabase/authHelpers';

type RecoveryStatus = 'LOADING' | 'AUTHENTICATED' | 'UNAUTHENTICATED';

/**
 * A robust hook to manage the client-side logic for the password recovery flow.
 * It now uses a dedicated helper to explicitly handle the PKCE code exchange.
 */
export function usePasswordRecovery(): RecoveryStatus {
  const [status, setStatus] = useState<RecoveryStatus>('LOADING');
  const router = useRouter();
  const searchParams = useSearchParams();
  const timeoutId = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasProcessedRecovery = useRef(false);

  useEffect(() => {
    // ✅ 2. REPLACE THE OLD `exchangeCode` block with this single line.
    // This is the CRITICAL missing step, now correctly implemented.
    exchangeCodeForSession();

    // The rest of the hook's logic remains the same. It will now correctly
    // receive the PASSWORD_RECOVERY event after the exchange helper runs.
    
    const hasRecoveryCode = searchParams.has('code');
    const isRecoveryFlow = hasRecoveryCode;

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY') {
        if (timeoutId.current) clearTimeout(timeoutId.current);
        hasProcessedRecovery.current = true;
        
        if (typeof window !== 'undefined') {
          window.history.replaceState({}, document.title, window.location.pathname);
        }
        setStatus('AUTHENTICATED');
        return;
      }

      if (event === 'INITIAL_SESSION') {
        if (isRecoveryFlow) {
          return; // Wait
        }
        if (session) {
          router.replace('/dashboard');
        } else {
          router.replace('/login?error=invalid_token');
        }
      }
    });

    if (isRecoveryFlow) {
      timeoutId.current = setTimeout(() => {
        if (!hasProcessedRecovery.current) {
          router.replace('/login?error=expired_token');
        }
      }, 5000);
    }

    return () => {
      subscription.unsubscribe();
      if (timeoutId.current) clearTimeout(timeoutId.current);
    };
  }, [router, searchParams]);

  return status;
}