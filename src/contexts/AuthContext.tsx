// src/contexts/AuthContext.tsx
"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
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

  useEffect(() => {
    console.log("AuthContext: Setting up Supabase auth listener.");
    
    // Set initial state from getSession (synchronous if tokens are in localStorage)
    // This helps set isInitialized quickly.
    // Note: getSession() might not give the absolute latest state if tokens just changed,
    // onAuthStateChange is the source of truth for updates.
    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
        console.log("AuthContext: Initial getSession() completed. Session exists:", !!initialSession);
        if (!isInitialized) { // Only set initial state if not already done by onAuthStateChange
            setSession(initialSession);
            setUser(initialSession?.user ?? null);
            setIsInitialized(true); // Mark as initialized
        }
    });
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event: AuthChangeEvent, currentSession: Session | null) => {
        console.log("AuthContext: onAuthStateChange event:", _event, "Session ID:", currentSession?.access_token.slice(-6), "User ID:", currentSession?.user?.id);
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        setAuthError(null); // Clear previous auth errors
        setIsInitialized(true); // Ensure initialized is true after first event
      }
    );

    return () => {
      console.log("AuthContext: Unsubscribing Supabase auth listener.");
      subscription?.unsubscribe();
    };
  }, [isInitialized]); // Re-run if isInitialized changes (though it should only change once to true)

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