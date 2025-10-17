// src/lib/auth/hooks/useAuthSession.ts
"use client";

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabaseClient';

interface AuthSession {
  session: Session | null;
  user: User | null;
  isInitialized: boolean;
}

/**
 * SRP: This hook's ONLY responsibility is to listen to Supabase's auth state
 * and provide the current session, user, and initialization status. It also
 * handles the route-specific logic for the password update page.
 */
export const useAuthSession = (): AuthSession => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const pathname = usePathname();

  useEffect(() => {
    // Exclude the listener from running on the password update page.
    if (pathname === '/update-password') {
      setIsInitialized(true); // Mark as initialized to prevent app-wide loaders.
      return;
    }

    // Get the initial session.
    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      // This runs only once, setting the initial state.
      if (!isInitialized) {
        setSession(initialSession);
        setUser(initialSession?.user ?? null);
        setIsInitialized(true);
      }
    });

    // Set up the listener for auth state changes.
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, currentSession) => {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        setIsInitialized(true);
      }
    );

    // Cleanup the subscription on component unmount.
    return () => {
      subscription?.unsubscribe();
    };
  }, [pathname, isInitialized]);

  return { session, user, isInitialized };
};