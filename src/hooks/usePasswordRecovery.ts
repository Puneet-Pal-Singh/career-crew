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
  const hasProcessedRecovery = useRef(false);

  useEffect(() => {
    // 1. Determine if this is a password recovery attempt by checking the URL.
    console.log("[usePasswordRecovery] 🚀 Hook has mounted.");
    
    // Check for hash-based recovery token (implicit flow)
    const hasRecoveryHash = typeof window !== 'undefined' && 
      (window.location.hash.includes('type=recovery') || window.location.hash.includes('access_token'));
    
    // Check for PKCE code-based recovery (authorization code flow)
    const hasRecoveryCode = searchParams.has('code');
    
    // Check for other recovery params
    const hasRecoveryParams = searchParams.has('token') || searchParams.has('access_token');
    
    const isRecoveryFlow = hasRecoveryHash || hasRecoveryParams || hasRecoveryCode;

    console.log(`[usePasswordRecovery] 🔍 URL: ${window.location.href}`);
    console.log(`[usePasswordRecovery] 🔍 Hash: ${window.location.hash}`);
    console.log(`[usePasswordRecovery] 🔍 Has recovery hash: ${hasRecoveryHash}`);
    console.log(`[usePasswordRecovery] 🔍 Has PKCE code: ${hasRecoveryCode}`);
    console.log(`[usePasswordRecovery] 🔍 Is this a recovery flow? ${isRecoveryFlow}`);

    // 2. Listen for Supabase auth events.
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log(`[usePasswordRecovery] 🔔 onAuthStateChange event received: ${event}. Session exists: ${!!session}`);
      
      // The ONLY event that confirms a valid recovery token and allows form rendering.
      if (event === 'PASSWORD_RECOVERY') {
        console.log("[usePasswordRecovery] ✅ PASSWORD_RECOVERY event SUCCESS. Setting status to AUTHENTICATED.");
        if (timeoutId.current) clearTimeout(timeoutId.current);
        hasProcessedRecovery.current = true;
        
        // Immediately scrub the token from the URL after it has been validated.
        if (typeof window !== 'undefined') {
          // Remove both hash and query params for security
          const cleanUrl = window.location.pathname;
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
          console.log("[usePasswordRecovery] ⏳ INITIAL_SESSION on recovery flow. WAITING for PASSWORD_RECOVERY or timeout.");
          return; // CRITICAL: Don't redirect yet, wait for PASSWORD_RECOVERY
        }

        // If it's NOT a recovery flow, the user should not be on this page.
        // Redirect them based on whether they have a normal session or not.
        if (session) {
          console.log("[usePasswordRecovery] ❌ INITIAL_SESSION with normal session. REDIRECTING to /dashboard.");
          router.replace('/dashboard'); // Logged-in user, send to dashboard.
        } else {
          console.log("[usePasswordRecovery] ❌ INITIAL_SESSION with NO session. REDIRECTING to /login.");
          router.replace('/login?error=invalid_token'); // Logged-out user with no token, send to login.
        }
      }
    });

    // 3. Set a fallback timeout ONLY for recovery attempts.
    if (isRecoveryFlow) {
      console.log("[usePasswordRecovery] ⏰ Setting up 5-second fallback timeout for expired token.");
      timeoutId.current = setTimeout(() => {
        if (!hasProcessedRecovery.current) {
          console.log("[usePasswordRecovery] ⏰ TIMEOUT FIRED. Token likely expired. REDIRECTING to /login.");
          // If this timeout fires, PASSWORD_RECOVERY never arrived, so the token is invalid/expired.
          router.replace('/login?error=expired_token');
        }
      }, 5000); // Increased to 5 seconds for better reliability
    }

    // 4. Cleanup function to prevent memory leaks.
    return () => {
      console.log("[usePasswordRecovery] 🧹 Unsubscribing and cleaning up.");
      subscription.unsubscribe();
      if (timeoutId.current) clearTimeout(timeoutId.current);
    };
  }, [router, searchParams]);

  return status;
}