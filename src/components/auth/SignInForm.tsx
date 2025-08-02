// src/components/auth/SignInForm.tsx
"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter, useSearchParams } from 'next/navigation'; // ✅ Import useSearchParams
import { loginUserAction } from '@/app/actions/auth/loginUserAction';
import { supabase } from '@/lib/supabaseClient';
import { SignInUI } from '@/components/ui/authui/SignInUI';

const formSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export type FormValues = z.infer<typeof formSchema>;

// ✅ The component no longer accepts any props. It's self-contained.
export default function SignInForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  
  // ✅ THE FIX: Use the hook to get URL search parameters.
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirectTo'); // Gets the value of 'redirectTo'

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: '', password: '' },
  });

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    setError(null);
    const baseUrl = window.location.origin;

    const redirectUrl = new URL(`${baseUrl}/auth/callback`);
    if (redirectTo) {
      redirectUrl.searchParams.set('redirectTo', redirectTo);
    }

    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { 
        redirectTo: redirectUrl.toString(),
        queryParams: { prompt: 'select_account' }
      },
    });
    setIsGoogleLoading(false);
  };

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    setError(null);
    
    // Pass the redirectTo parameter to the action.
    const result = await loginUserAction({ ...values, redirectTo: redirectTo || undefined });

    if (result.success) {
      // ✅ THE FIX: Instead of pushing to a new URL, just refresh the page.
      // This will re-run the middleware. The middleware will see that the
      // user is now logged in on an auth route (`/login`) and will perform
      // the authoritative redirect to the dashboard. This breaks the loop.
      router.refresh();
      
      // We no longer need to check for result.redirectTo here, because
      // the middleware will handle all post-login navigation.
      
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
      signupLink="/jobs/signup"
    />
  );
}
