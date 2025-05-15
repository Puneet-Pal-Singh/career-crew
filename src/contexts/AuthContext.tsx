// src/contexts/AuthContext.tsx
"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { AuthChangeEvent, AuthError, AuthResponse, AuthTokenResponsePassword, Session, User, SignInWithPasswordCredentials, SignUpWithPasswordCredentials, Subscription } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabaseClient"; // Our browser client
import { useRouter } from "next/navigation"; // For potential redirects triggered by context

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean; // For signIn/signUp actions
  error: AuthError | null;
  isInitialized: boolean; // True after initial session check
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
  const router = useRouter();

  useEffect(() => {
    console.log("AuthContext: Initializing...");
    let authListenerSubscription: Subscription | null = null;

    async function initializeSession() {
      const { data: { session: initialSession }, error } = await supabase.auth.getSession();
      console.log("AuthContext: Initial session fetched. Has session:", !!initialSession, "Error:", error?.message);
      setSession(initialSession);
      setUser(initialSession?.user ?? null);
      setIsInitialized(true); // Mark as initialized after first check

      // Listen for auth state changes AFTER initial check
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        (_event: AuthChangeEvent, currentSession: Session | null) => {
          console.log("AuthContext: onAuthStateChange - Event:", _event, "Session:", !!currentSession, "User:", currentSession?.user?.id);
          setSession(currentSession);
          setUser(currentSession?.user ?? null);
          setAuthError(null); // Clear previous errors on state change

          // Handle redirects based on auth state changes from here if desired
          // This ensures redirects happen *after* the cookie is likely set/cleared by Supabase client
          if (_event === "SIGNED_IN" && currentSession) {
             // Consider if redirect is needed here or if middleware/page logic is sufficient
             // router.push('/dashboard'); // Example
          } else if (_event === "SIGNED_OUT") {
             // router.push('/login'); // Example
          }
        }
      );
      authListenerSubscription = subscription;
    }

    initializeSession();

    return () => {
      console.log("AuthContext: Unsubscribing auth listener.");
      authListenerSubscription?.unsubscribe();
    };
  }, []); // Run only once on mount

  const signIn = async (credentials: SignInWithPasswordCredentials): Promise<AuthTokenResponsePassword> => {
    setIsLoadingAction(true);
    setAuthError(null);
    console.log("AuthContext: Attempting signIn...");
    const response = await supabase.auth.signInWithPassword(credentials);
    if (response.error) {
      console.error("AuthContext: signIn error", response.error.message);
      setAuthError(response.error);
    } else {
      console.log("AuthContext: signIn successful. User:", response.data.user?.id);
      // onAuthStateChange will update user/session state
    }
    setIsLoadingAction(false);
    return response;
  };

  const signUp = async (credentials: SignUpWithPasswordCredentials): Promise<AuthResponse> => {
    setIsLoadingAction(true);
    setAuthError(null);
    console.log("AuthContext: Attempting signUp...");
    const response = await supabase.auth.signUp(credentials);
    if (response.error) {
      console.error("AuthContext: signUp error", response.error.message);
      setAuthError(response.error);
    } else {
      console.log("AuthContext: signUp successful. User:", response.data.user?.id, "Session:", !!response.data.session);
      // onAuthStateChange will update user/session state
      // If email confirmation is OFF, session will be present.
      // If ON, session might be null until confirmed.
    }
    setIsLoadingAction(false);
    return response;
  };

  const signOut = async (): Promise<void> => {
    setIsLoadingAction(true);
    setAuthError(null);
    console.log("AuthContext: Attempting signOut...");
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("AuthContext: signOut error", error.message);
      setAuthError(error);
    } else {
      console.log("AuthContext: signOut successful.");
      // onAuthStateChange will clear user/session state
      // Redirect after sign out can be handled here or in component
      // router.push('/login'); // Ensure this doesn't cause loops with middleware
    }
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