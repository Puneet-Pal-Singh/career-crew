// src/contexts/AuthContext.tsx
"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  AuthChangeEvent,
  AuthError,
  AuthResponse,
  AuthTokenResponsePassword,
  Session,
  User,
  SignInWithPasswordCredentials,
  SignUpWithPasswordCredentials,
  Subscription,
} from "@supabase/supabase-js";
import { supabase } from "@/lib/supabaseClient";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  error: AuthError | null;
  signIn: (
    credentials: SignInWithPasswordCredentials
  ) => Promise<AuthTokenResponsePassword>;
  signUp: (
    credentials: SignUpWithPasswordCredentials
  ) => Promise<AuthResponse>;
  signOut: () => Promise<{ error: AuthError | null }>;
  isInitialized: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoadingAction, setIsLoadingAction] = useState<boolean>(false);
  const [error, setError] = useState<AuthError | null>(null);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  useEffect(() => {
    let listenerSubscription: Subscription | undefined;

    const getInitialSession = async () => {
      try {
        const {
          data: { session: initialSession },
          error: initialError,
        } = await supabase.auth.getSession();

        if (initialError) {
          console.error("Error getting initial session:", initialError);
          setError(initialError);
        }
        setSession(initialSession);
        setUser(initialSession?.user ?? null);
      } catch (e: unknown) {
         console.error("Unexpected error getting initial session:", e);
         const message = e instanceof Error ? e.message : "Failed to fetch initial session";
         const authError = { name: "InitialSessionError", message, status: undefined } as AuthError;
         setError(authError);
      } finally {
        setIsInitialized(true);
      }
    };

    getInitialSession();

    const { data: authListenerData } = supabase.auth.onAuthStateChange(
      async (_event: AuthChangeEvent, newSession: Session | null) => {
        setSession(newSession);
        setUser(newSession?.user ?? null);
        setError(null);
        
        if (!isInitialized) {
            setIsInitialized(true);
        }
      }
    );
    listenerSubscription = authListenerData.subscription;


    return () => {
      listenerSubscription?.unsubscribe();
    };
  }, [isInitialized]);

  const signIn = async (credentials: SignInWithPasswordCredentials): Promise<AuthTokenResponsePassword> => {
    setIsLoadingAction(true);
    setError(null);
    try {
      const response = await supabase.auth.signInWithPassword(credentials);
      if (response.error) setError(response.error);
      return response;
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "An unexpected error occurred during sign in.";
      const authError = { name: "SignInError", message, status: undefined } as AuthError;
      setError(authError);
      return { data: { user: null, session: null }, error: authError };
    } finally {
      setIsLoadingAction(false);
    }
  };

  const signUp = async (credentials: SignUpWithPasswordCredentials): Promise<AuthResponse> => {
    setIsLoadingAction(true);
    setError(null);
    try {
      const response = await supabase.auth.signUp(credentials);
      if (response.error) {
        setError(response.error);
        return response; // Supabase response object is already correctly shaped
      }
      return response; // Success case
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "An unexpected client-side error occurred during sign up.";
      const authError = { name: "ClientSignUpError", message, status: undefined } as AuthError;
      setError(authError);
      return { 
        data: { user: null, session: null }, // Correct shape for data on client-side error
        error: authError 
      };
    } finally {
      setIsLoadingAction(false);
    }
  };

  const signOut = async (): Promise<{ error: AuthError | null }> => {
    setIsLoadingAction(true);
    setError(null);
    const { error: signOutError } = await supabase.auth.signOut();
    if (signOutError) setError(signOutError);
    setIsLoadingAction(false);
    return { error: signOutError };
  };

  const value = {
    user,
    session,
    isLoading: isLoadingAction,
    error,
    signIn,
    signUp,
    signOut,
    isInitialized,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};