// src/lib/auth/hooks/useAuthSession.ts
"use client";

import { useState, useEffect, useRef } from 'react'; // Import useRef
import { usePathname } from 'next/navigation';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabaseClient';

interface AuthSession {
  session: Session | null;
  user: User | null;
  isInitialized: boolean;
}

export const useAuthSession = (): AuthSession => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const pathname = usePathname();
  const isMounted = useRef(false); // THE FIX: Use a ref to track mount status

  useEffect(() => {
    isMounted.current = true; // Component has mounted

    if (pathname === '/update-password') {
      setIsInitialized(true);
      return;
    }

    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      // Only set initial session if the component is still mounted
      if (isMounted.current && !isInitialized) {
        setSession(initialSession);
        setUser(initialSession?.user ?? null);
        setIsInitialized(true);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        // THE CRITICAL FIX: The global listener must ignore the special
        // password recovery event. This allows the dedicated useRecoverySession
        // hook to handle it without interference.
        if (event === 'PASSWORD_RECOVERY') {
          return;
        }

        // Only update state if the component is still mounted
        if (isMounted.current) {
          setSession(currentSession);
          setUser(currentSession?.user ?? null);
          setIsInitialized(true);
        }
      }
    );

    return () => {
      isMounted.current = false; // Component is unmounting
      subscription?.unsubscribe();
    };
  // THE FIX: The dependency array is now correct, preventing re-runs
  }, [pathname, isInitialized]); 

  return { session, user, isInitialized };
};