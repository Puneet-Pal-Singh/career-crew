// src/components/auth/AuthForm.tsx
"use client";

import React, { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
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
  const [confirmPassword, setConfirmPassword] = useState(""); // Only for register mode
  const [formError, setFormError] = useState<string | null>(null);

  const { signIn, signUp, isLoading, error: authError, user } = useAuth();
  const router = useRouter();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null); // Clear previous form-specific errors

    if (mode === "register" && password !== confirmPassword) {
      setFormError("Passwords do not match.");
      return;
    }

    try {
      let response;
      if (mode === "login") {
        response = await signIn({ email, password });
      } else {
        // For Supabase, additional data or options can be passed to signUp if needed
        response = await signUp({ email, password });
      }

      if (response && !response.error) {
        // Supabase onAuthStateChange will update context.
        // Redirect after successful operation.
        // For new signups, Supabase might require email confirmation.
        // The user object in context will be populated even if email isn't confirmed yet.
        if (mode === "register" && response.data.user && !response.data.session) {
          // User created, email confirmation likely pending
          // You might want to show a message here or redirect to a specific page
          router.push("/?message=signup_success_confirmation_pending"); // Example
        } else {
          router.push("/dashboard"); // Or a more sophisticated redirect logic
        }
      } else if (response && response.error) {
        // Error is already set in AuthContext by signIn/signUp,
        // but we can also set formError for more specific UI if needed.
        // For now, relying on authError from context.
      }
    } catch (err) {
      // This catch is for unexpected errors not handled by Supabase client's return
      console.error(`Unexpected error during ${mode}:`, err);
      setFormError(`An unexpected error occurred. Please try again.`);
    }
  };

  // If user is already logged in and somehow lands on login/register, redirect them
  React.useEffect(() => {
    if (user) {
      router.replace("/dashboard"); // Or appropriate authenticated user page
    }
  }, [user, router]);


  return (
    <div className="mx-auto w-full max-w-md rounded-lg bg-card p-6 shadow-xl md:p-8">
      <h2 className="mb-6 text-center text-2xl font-bold text-foreground">
        {mode === "login" ? "Welcome Back" : "Create Account"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label htmlFor="email" className="text-sm font-medium text-muted-foreground">
            Email Address
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className="mt-1 block w-full"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
          />
        </div>

        <div>
          <Label
            htmlFor="password"
            className="text-sm font-medium text-muted-foreground"
          >
            Password
          </Label>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete={mode === "login" ? "current-password" : "new-password"}
            required
            className="mt-1 block w-full"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
          />
        </div>

        {mode === "register" && (
          <div>
            <Label
              htmlFor="confirm-password"
              className="text-sm font-medium text-muted-foreground"
            >
              Confirm Password
            </Label>
            <Input
              id="confirm-password"
              name="confirm-password"
              type="password"
              autoComplete="new-password"
              required
              className="mt-1 block w-full"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={isLoading}
            />
          </div>
        )}

        {(authError || formError) && (
          <div className="flex items-center space-x-2 rounded-md border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <p>{authError?.message || formError}</p>
          </div>
        )}

        <div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : mode === "login" ? (
              "Sign In"
            ) : (
              "Create Account"
            )}
          </Button>
        </div>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        {mode === "login" ? "Don't have an account? " : "Already have an account? "}
        <a
          href={mode === "login" ? "/register" : "/login"}
          className="font-medium text-primary hover:underline"
        >
          {mode === "login" ? "Sign up" : "Sign in"}
        </a>
      </p>
    </div>
  );
}