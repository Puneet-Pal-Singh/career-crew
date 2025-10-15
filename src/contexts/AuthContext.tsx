// src/contexts/AuthContext.tsx
"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { usePathname } from "next/navigation"; 
import { AuthChangeEvent, AuthError, AuthResponse, AuthTokenResponsePassword, Session, User, SignInWithPasswordCredentials, SignUpWithPasswordCredentials } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabaseClient";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  error: AuthError | null;
  isInitialized: boolean;
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
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  const pathname = usePathname();
  
  useEffect(() => {
    console.log("--- AuthContext Build Version: 1.0.4 ---"); 
    console.log(`[AuthContext] 🚀 useEffect triggered. Current pathname: "${pathname}"`);

    // Set up initial session
    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
        console.log("[AuthContext] Initial getSession() completed. Session exists:", !!initialSession);
        if (!isInitialized) {
            setSession(initialSession);
            setUser(initialSession?.user ?? null);
            setIsInitialized(true);
        }
    });
    
    // Set up auth listener
    console.log("[AuthContext] Setting up Supabase auth listener.");
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event: AuthChangeEvent, currentSession: Session | null) => {
        console.log("[AuthContext] onAuthStateChange event:", _event, "on path:", pathname);
        
        // CRITICAL FIX: Always ignore PASSWORD_RECOVERY events
        // Let the usePasswordRecovery hook handle these exclusively
        if (_event === 'PASSWORD_RECOVERY') {
          console.log("[AuthContext] 🛑 Ignoring PASSWORD_RECOVERY event - delegating to usePasswordRecovery hook");
          setIsInitialized(true); // Still mark as initialized
          return; // Don't update session/user
        }
        
        // Process all other events normally
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
  }); // Removed isInitialized from deps to prevent loops

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