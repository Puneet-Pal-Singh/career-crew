// src/lib/auth/contexts/AuthContext.tsx
"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { 
  AuthError, 
  AuthResponse, 
  AuthTokenResponsePassword, 
  Session, 
  User, 
  SignInWithPasswordCredentials, 
  SignUpWithPasswordCredentials 
} from "@supabase/supabase-js";
import { useAuthSession } from "../hooks/useAuthSession";
import { signInWithPassword, signUpWithPassword, signOut as signOutAction } from "../authActions";

// The context shape remains the same for consumers of the hook.
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

/**
 * SRP: This provider's ONLY responsibility is to orchestrate the auth state.
 * 1. It uses `useAuthSession` to get the live session.
 * 2. It manages the loading/error state for auth actions.
 * 3. It wraps the stateless functions from `authActions` with state management.
 */
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { user, session, isInitialized } = useAuthSession();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<AuthError | null>(null);

  const signIn = async (credentials: SignInWithPasswordCredentials) => {
    setIsLoading(true);
    setError(null);
    const response = await signInWithPassword(credentials);
    if (response.error) setError(response.error);
    setIsLoading(false);
    return response;
  };

  const signUp = async (credentials: SignUpWithPasswordCredentials) => {
    setIsLoading(true);
    setError(null);
    const response = await signUpWithPassword(credentials);
    if (response.error) setError(response.error);
    setIsLoading(false);
    return response;
  };

  const signOut = async () => {
    setIsLoading(true);
    setError(null);
    await signOutAction();
    // The onAuthStateChange listener in useAuthSession will handle clearing the user/session.
    setIsLoading(false);
  };

  return (
    <AuthContext.Provider 
      value={{ user, session, isLoading, error, isInitialized, signIn, signUp, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// The consumer hook remains unchanged.
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};