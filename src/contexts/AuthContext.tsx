// src/contexts/AuthContext.tsx
"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
// ✅ STEP 1: Import usePathname to know which page we're on.
import { usePathname } from "next/navigation"; 
import { AuthChangeEvent, AuthError, AuthResponse, AuthTokenResponsePassword, Session, User, SignInWithPasswordCredentials, SignUpWithPasswordCredentials } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabaseClient";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean; // For signIn/signUp/signOut actions
  error: AuthError | null;
  isInitialized: boolean; // True after initial session check by Supabase client
  signIn: (credentials: SignInWithPasswordCredentials) => Promise<AuthTokenResponsePassword>;
  signUp: (credentials: SignUpWithPasswordCredentials) => Promise<AuthResponse>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoadingAction, setIsLoadingAction] = useState<boolean>(false);
  const [authError, setAuthError] = useState<AuthError | null>(null);
  const [isInitialized, setIsInitialized] = useState<boolean>(false); // Tracks if onAuthStateChange has fired at least once

  // ✅ STEP 2: Get the current URL path.
  const pathname = usePathname();

  useEffect(() => {
    // ✅ ADDING DETAILED LOGS
    console.log(`[AuthContext] 🚀 useEffect triggered. Current pathname: "${pathname}"`);

    if (pathname === '/update-password') {
      console.log("[AuthContext] 🛑 Path is /update-password. STANDING DOWN. AuthContext will not run.");
      setIsInitialized(true);
      return; // Exit early and do nothing.
    }

    console.log("[AuthContext] ▶️ Path is NOT /update-password. Proceeding with auth setup.");
    
    // This console log will now only appear on pages where the context is active
    console.log("[AuthContext] Setting up Supabase auth listener.");
    
    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
        console.log("[AuthContext] Initial getSession() completed. Session exists:", !!initialSession);
        if (!isInitialized) {
            setSession(initialSession);
            setUser(initialSession?.user ?? null);
            setIsInitialized(true);
        }
    });
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event: AuthChangeEvent, currentSession: Session | null) => {
        console.log("[AuthContext] onAuthStateChange event:", _event);
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        setAuthError(null);
        setIsInitialized(true);
      }
    );

    return () => {
      console.log("[AuthContext] Unsubscribing Supabase auth listener.");
      subscription?.unsubscribe();
    };
  }, [isInitialized, pathname]); 

  const signIn = async (credentials: SignInWithPasswordCredentials): Promise<AuthTokenResponsePassword> => {
    setIsLoadingAction(true);
    setAuthError(null);
    const response = await supabase.auth.signInWithPassword(credentials);
    if (response.error) setAuthError(response.error);
    setIsLoadingAction(false);
    return response;
  };

  const signUp = async (credentials: SignUpWithPasswordCredentials): Promise<AuthResponse> => {
    setIsLoadingAction(true);
    setAuthError(null);
    const response = await supabase.auth.signUp(credentials);
    if (response.error) setAuthError(response.error);
    setIsLoadingAction(false);
    return response;
  };

  const signOut = async (): Promise<void> => {
    setIsLoadingAction(true);
    setAuthError(null);
    const { error } = await supabase.auth.signOut();
    if (error) setAuthError(error);
    // onAuthStateChange will set user/session to null
    setIsLoadingAction(false);
  };

  return (
    <AuthContext.Provider value={{ user, session, isLoading: isLoadingAction, error: authError, isInitialized, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};