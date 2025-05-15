// src/components/auth/AuthForm.tsx
"use client";

import React, { useState, FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation"; // Keep for potential future client-side nav if needed
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, Loader2 } from "lucide-react";

interface AuthFormProps {
  mode: "login" | "register";
}

export default function AuthForm({ mode }: AuthFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [formSpecificError, setFormSpecificError] = useState<string | null>(null);

  // Get auth functions and state from context
  const { signIn, signUp, isLoading: authActionIsLoading, error: authContextError, user, isInitialized } = useAuth();
  const router = useRouter(); // Initialize router

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormSpecificError(null); // Clear local form error

    if (mode === "register" && password !== confirmPassword) {
      setFormSpecificError("Passwords do not match.");
      return;
    }

    let response;
    if (mode === "login") {
      console.log("AuthForm: Submitting login...");
      response = await signIn({ email, password });
    } else {
      console.log("AuthForm: Submitting register...");
      response = await signUp({ email, password });
    }
    
    console.log(`AuthForm: ${mode} response received. Error:`, response.error?.message);
    // No explicit redirect here. AuthContext's onAuthStateChange will update the user state.
    // Middleware and potentially an effect watching `user` in a higher-level component or page will handle redirects.
    // If there's a Supabase error, it's set in AuthContext and displayed.
  };
  
  // This useEffect is a client-side guard. If a logged-in user lands here,
  // it attempts to redirect them. Middleware should be the primary guard.
  useEffect(() => {
     if (isInitialized && user) {
         const currentPath = window.location.pathname;
         if (currentPath.startsWith('/login') || currentPath.startsWith('/register')) {
             console.log("AuthForm useEffect: Authenticated user on auth page, redirecting to /dashboard.");
             router.replace('/dashboard');
         }
     }
  }, [user, isInitialized, router]);


  return (
    <div className="mx-auto w-full max-w-md rounded-lg bg-card p-6 shadow-xl md:p-8">
      <h2 className="mb-6 text-center text-2xl font-bold text-foreground">
        {mode === "login" ? "Welcome Back" : "Create Account"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label htmlFor="email">Email Address</Label>
          <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={authActionIsLoading} />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required disabled={authActionIsLoading} />
        </div>
        {mode === "register" && (
          <div>
            <Label htmlFor="confirm-password">Confirm Password</Label>
            <Input id="confirm-password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required disabled={authActionIsLoading} />
          </div>
        )}
        {(authContextError || formSpecificError) && (
          <div className="text-destructive text-sm p-3 bg-destructive/10 border border-destructive/50 rounded-md flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            {authContextError?.message || formSpecificError}
          </div>
        )}
        <Button type="submit" className="w-full" disabled={authActionIsLoading}>
          {authActionIsLoading ? <Loader2 className="animate-spin mr-2" /> : (mode === "login" ? "Sign In" : "Create Account")}
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        {mode === "login" ? "Don't have an account? " : "Already have an account? "}
        <Link href={mode === "login" ? "/register" : "/login"} className="font-medium text-primary hover:underline">
          {mode === "login" ? "Sign up" : "Sign in"}
        </Link>
      </p>
    </div>
  );
}