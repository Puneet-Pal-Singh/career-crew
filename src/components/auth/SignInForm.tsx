// src/components/auth/SignInForm.tsx
"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { loginUserAction } from '@/app/actions/auth/loginUserAction';
import { supabase } from '@/lib/supabaseClient';
import { SignInUI } from '@/components/ui/authui/SignInUI';

const formSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

// Export the type so our UI component can use it
export type FormValues = z.infer<typeof formSchema>;

export default function SignInForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: '', password: '' },
  });

  // Logic for handling Google Sign-In
  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    setError(null);

    // Use environment variable or Next.js config for base URL
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || window.location.origin;

    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { 
        redirectTo: `${baseUrl}/auth/callback`,
        queryParams: {
          prompt: 'select_account', // Force account selection for a better UX
        }
      },
    });

    if (oauthError) {
      setError(oauthError.message);
    }

    // Always reset loading state
    setIsGoogleLoading(false);
  };

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    setError(null);
    const result = await loginUserAction(values);

    if (result.success) {
      router.push('/dashboard');
      router.refresh();
    } else {
      setError(result.error?.message || "An unexpected error occurred.");
      setIsLoading(false);
    }
  };

  return (
    <SignInUI
      form={form}
      onSubmit={onSubmit}
      onGoogleSignIn={handleGoogleSignIn}
      isLoading={isLoading}
      isGoogleLoading={isGoogleLoading}
      error={error}
      // FIX: The "Sign up" link in the UI now points to the new contextual route
      signupLink="/jobs/signup"
    />
  );
}