// src/lib/auth/authActions.ts
import { 
  AuthResponse, 
  AuthTokenResponsePassword, 
  SignInWithPasswordCredentials, 
  SignUpWithPasswordCredentials 
} from "@supabase/supabase-js";
import { supabase } from "@/lib/supabaseClient";

/**
 * SRP: This file's ONLY responsibility is to provide stateless functions
 * for interacting with the Supabase Auth API. It knows nothing about
 * React state. This makes the functions reusable and easy to test.
 */

export const signInWithPassword = (
  credentials: SignInWithPasswordCredentials
): Promise<AuthTokenResponsePassword> => {
  return supabase.auth.signInWithPassword(credentials);
};

export const signUpWithPassword = (
  credentials: SignUpWithPasswordCredentials
): Promise<AuthResponse> => {
  return supabase.auth.signUp(credentials);
};

export const signOut = async (): Promise<{ error: null }> => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error("Error signing out:", error);
    // Even if there's an error, we proceed as if successful on the client.
  }
  return { error: null }; // Ensure consistent return shape
};