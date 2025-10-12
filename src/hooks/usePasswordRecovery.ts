// src/hooks/usePasswordRecovery.ts
"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

type RecoveryStatus = 'LOADING' | 'AUTHENTICATED' | 'UNAUTHENTICATED';

/**
 * A custom hook to manage the client-side logic for the password recovery flow.
 * Its single responsibility is to determine the user's authentication status
 * on the /update-password page and perform necessary redirects.
 */
export function usePasswordRecovery(): RecoveryStatus {
  const [status, setStatus] = useState<RecoveryStatus>('LOADING');
  const router = useRouter();
  const searchParams = useSearchParams();
  const timeoutId = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // 1. Determine if this is a password recovery attempt by checking the URL.
    const hasRecoveryHash = typeof window !== 'undefined' && 
      (window.location.hash.includes('type=recovery') || window.location.hash.includes('access_token'));
    const hasRecoveryParams = searchParams.has('token') || searchParams.has('access_token');
    const isRecoveryFlow = hasRecoveryHash || hasRecoveryParams;

    // 2. Listen for Supabase auth events.
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      // The ONLY event that confirms a valid recovery token and allows form rendering.
      if (event === 'PASSWORD_RECOVERY') {
        if (timeoutId.current) clearTimeout(timeoutId.current);
        
        // Immediately scrub the token from the URL after it has been validated.
        if (typeof window !== 'undefined') {
          const cleanUrl = `${window.location.pathname}${window.location.search}`;
          window.history.replaceState({}, document.title, cleanUrl);
        }
        setStatus('AUTHENTICATED');
        return;
      }

      // This event fires on initial page load.
      if (event === 'INITIAL_SESSION') {
        // If the URL indicates a recovery attempt, we must wait for the PASSWORD_RECOVERY event.
        // We do nothing here and let the fallback timeout handle invalid/expired tokens.
        if (isRecoveryFlow) {
          return;
        }

        // If it's NOT a recovery flow, the user should not be on this page.
        // Redirect them based on whether they have a normal session or not.
        if (session) {
          router.replace('/dashboard'); // Logged-in user, send to dashboard.
        } else {
          router.replace('/login?error=invalid_token'); // Logged-out user with no token, send to login.
        }
      }
    });

    // 3. Set a fallback timeout ONLY for recovery attempts.
    if (isRecoveryFlow) {
      timeoutId.current = setTimeout(() => {
        // If this timeout fires, PASSWORD_RECOVERY never arrived, so the token is invalid/expired.
        router.replace('/login?error=expired_token');
      }, 3000); // 3-second wait is sufficient.
    }

    // 4. Cleanup function to prevent memory leaks.
    return () => {
      subscription.unsubscribe();
      if (timeoutId.current) clearTimeout(timeoutId.current);
    };
  }, [router, searchParams]);

  return status;
}