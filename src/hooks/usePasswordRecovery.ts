// src/hooks/usePasswordRecovery.ts
"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { exchangeCodeForSession } from '@/lib/supabase/authHelpers';

type RecoveryStatus = 'LOADING' | 'AUTHENTICATED' | 'UNAUTHENTICATED';

export function usePasswordRecovery(): RecoveryStatus {
  const [status, setStatus] = useState<RecoveryStatus>('LOADING');
  const router = useRouter();
  const searchParams = useSearchParams();
  const timeoutId = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasProcessedRecovery = useRef(false);

  useEffect(() => {
    const hasRecoveryCode = searchParams.has('code');
    const isRecoveryFlow = hasRecoveryCode;

    // ✅ THE FINAL, BULLETPROOF FIX (from Coderabbit):
    // 1. Establish the subscription FIRST to ensure we don't miss any events.
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
          return; // Wait for the exchange to trigger PASSWORD_RECOVERY
        }
        if (session) {
          router.replace('/dashboard');
        } else {
          router.replace('/login?error=invalid_token');
        }
      }
    });

    // 2. Now that we are subscribed, trigger the code exchange.
    // We use `void` to explicitly tell TypeScript we are not awaiting the promise,
    // as the onAuthStateChange listener is responsible for handling the result.
    if (isRecoveryFlow) {
      void exchangeCodeForSession();

      // 3. Set the fallback timeout.
      timeoutId.current = setTimeout(() => {
        if (!hasProcessedRecovery.current) {
          router.replace('/login?error=expired_token');
        }
      }, 5000);
    }

    // 4. Cleanup.
    return () => {
      subscription.unsubscribe();
      if (timeoutId.current) clearTimeout(timeoutId.current);
    };
  }, [router, searchParams]);

  return status;
}