// // src/hooks/usePasswordRecovery.ts
// "use client";

// import { useState, useEffect, useRef } from 'react';
// import { useRouter, useSearchParams } from 'next/navigation';
// import { supabase } from '@/lib/supabaseClient';

// type RecoveryStatus = 'LOADING' | 'AUTHENTICATED' | 'UNAUTHENTICATED';

// /**
//  * A custom hook to manage the client-side logic for the password recovery flow.
//  * Its single responsibility is to determine the user's authentication status
//  * on the /update-password page and perform necessary redirects.
//  */
// export function usePasswordRecovery(): RecoveryStatus {
//   const [status, setStatus] = useState<RecoveryStatus>('LOADING');
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const timeoutId = useRef<ReturnType<typeof setTimeout> | null>(null);

//   useEffect(() => {
//     // 1. Determine if this is a password recovery attempt by checking the URL.
//     console.log("[usePasswordRecovery] 🚀 Hook has mounted.");
//     const hasRecoveryHash = typeof window !== 'undefined' && 
//       (window.location.hash.includes('type=recovery') || window.location.hash.includes('access_token'));
//     const hasRecoveryParams = searchParams.has('token') || searchParams.has('access_token');
//     const isRecoveryFlow = hasRecoveryHash || hasRecoveryParams;

//     console.log(`[usePasswordRecovery] 🔍 Is this a recovery flow? ${isRecoveryFlow}`);

//     // 2. Listen for Supabase auth events.
//     const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
//       console.log(`[usePasswordRecovery] 🔔 onAuthStateChange event received: ${event}. Session exists: ${!!session}`);
      
//       // The ONLY event that confirms a valid recovery token and allows form rendering.
//       if (event === 'PASSWORD_RECOVERY') {
//         console.log("[usePasswordRecovery] ✅ PASSWORD_RECOVERY event SUCCESS. Setting status to AUTHENTICATED.");
//         if (timeoutId.current) clearTimeout(timeoutId.current);
        
//         // Immediately scrub the token from the URL after it has been validated.
//         if (typeof window !== 'undefined') {
//           const cleanUrl = `${window.location.pathname}${window.location.search}`;
//           window.history.replaceState({}, document.title, cleanUrl);
//         }
//         setStatus('AUTHENTICATED');
//         return;
//       }

//       // This event fires on initial page load.
//       if (event === 'INITIAL_SESSION') {
//         console.log("[usePasswordRecovery] ⏳ INITIAL_SESSION on recovery flow. WAITING for PASSWORD_RECOVERY or timeout.");

//         // If the URL indicates a recovery attempt, we must wait for the PASSWORD_RECOVERY event.
//         // We do nothing here and let the fallback timeout handle invalid/expired tokens.
//         if (isRecoveryFlow) {
//           console.log("[usePasswordRecovery] ⏳ INITIAL_SESSION on recovery flow. WAITING for PASSWORD_RECOVERY or timeout.");
//           return;
//         }

//         // If it's NOT a recovery flow, the user should not be on this page.
//         // Redirect them based on whether they have a normal session or not.
//         if (session) {
//           console.log("[usePasswordRecovery] ❌ INITIAL_SESSION with normal session. REDIRECTING to /dashboard.");
//           router.replace('/dashboard'); // Logged-in user, send to dashboard.
//         } else {
//           console.log("[usePasswordRecovery] ❌ INITIAL_SESSION with NO session. REDIRECTING to /login.");
//           router.replace('/login?error=invalid_token'); // Logged-out user with no token, send to login.
//         }
//       }
//     });

//     // 3. Set a fallback timeout ONLY for recovery attempts.
//     if (isRecoveryFlow) {
//       console.log("[usePasswordRecovery] ⏰ Setting up 3-second fallback timeout for expired token.");
//       timeoutId.current = setTimeout(() => {
//         console.log("[usePasswordRecovery] ⏰ TIMEOUT FIRED. Token likely expired. REDIRECTING to /login.");

//         // If this timeout fires, PASSWORD_RECOVERY never arrived, so the token is invalid/expired.
//         router.replace('/login?error=expired_token');
//       }, 3000); // 3-second wait is sufficient.
//     }

//     // 4. Cleanup function to prevent memory leaks.
//     return () => {
//       console.log("[usePasswordRecovery] 🧹 Unsubscribing and cleaning up.");

//       subscription.unsubscribe();
//       if (timeoutId.current) clearTimeout(timeoutId.current);
//     };
//   }, [router, searchParams]);

//   return status;
// }



// src/hooks/usePasswordRecovery.ts
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

type RecoveryStatus = 'LOADING' | 'AUTHENTICATED' | 'UNAUTHENTICATED';

/**
 * A simplified, robust hook to manage the client-side logic for the password recovery flow.
 * It directly checks the URL hash for a recovery token to determine the user's state.
 * This version ABANDONS the complex onAuthStateChange listener to avoid all race conditions.
 */
export function usePasswordRecovery(): RecoveryStatus {
  const [status, setStatus] = useState<RecoveryStatus>('LOADING');
  const router = useRouter();

  useEffect(() => {
    console.log("[usePasswordRecovery] 🚀 Hook has mounted. Analyzing URL...");

    // 1. Directly parse the URL hash to check for a recovery token.
    // This is the undeniable source of truth and avoids all event-based race conditions.
    const hash = window.location.hash;
    const params = new URLSearchParams(hash.substring(1)); // Remove the '#'
    
    const hasRecoveryToken = params.get('type') === 'recovery' && params.get('access_token');

    console.log(`[usePasswordRecovery] 🔍 URL Hash: "${hash}"`);
    console.log(`[usePasswordRecovery] 🔍 Does it contain a recovery token? ${hasRecoveryToken}`);

    if (hasRecoveryToken) {
      console.log("[usePasswordRecovery] ✅ Valid recovery token found in URL. Setting status to AUTHENTICATED.");
      
      // The user is authenticated for the purpose of password reset. Show the form.
      setStatus('AUTHENTICATED');

      // Security Best Practice: Immediately scrub the sensitive token from the URL.
      console.log("[usePasswordRecovery] 🧹 Scrubbing token from URL for security.");
      window.history.replaceState({}, document.title, window.location.pathname);

    } else {
      console.log("[usePasswordRecovery] ⚠️ No recovery token found in URL. Checking for a normal session.");
      
      // 2. If no recovery token is found, check for a normal, existing session.
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session) {
          console.log("[usePasswordRecovery] ❌ Normal session found. User should not be here. REDIRECTING to /dashboard.");
          router.replace('/dashboard');
        } else {
          console.log("[usePasswordRecovery] ❌ No token and no session. User should not be here. REDIRECTING to /login.");
          router.replace('/login?error=invalid_token');
        }
      });
    }

    // Since we are not using onAuthStateChange, there is no subscription to clean up.
    // This makes the hook simpler and less prone to memory leaks.

  }, [router]); // Only depends on the router for redirects.

  return status;
}