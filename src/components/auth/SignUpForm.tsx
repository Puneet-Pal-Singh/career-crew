// src/components/auth/SignUpForm.tsx
"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { registerUserAction } from '@/app/actions/auth/registerUserAction';
import { supabase } from '@/lib/supabaseClient';
import type { UserRole } from '@/types';
import { SignUpUI } from '@/components/ui/authui/SignUpUI';

interface SignUpFormProps {
  role: UserRole;
}

const formSchema = z.object({
  fullName: z.string().min(2, 'Full name is required.'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export type FormValues = z.infer<typeof formSchema>;

export default function SignUpForm({ role }: SignUpFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { fullName: '', email: '', password: '' },
  });

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    setError(null);

    // FIX: The 'data' property is removed. It is no longer a valid option.
    // The role information for Google OAuth must be handled by a different mechanism,
    // such as a state parameter in the redirect URL or a subsequent onboarding step.
    // For now, we will sign them up and let the onboarding flow handle role confirmation if needed.
    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (oauthError) {
        setError(oauthError.message);
        setIsGoogleLoading(false);
    }
  };

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    setError(null);
    const result = await registerUserAction({ ...values, role: role });

    if (result.success) {
      // After email signup, the user needs to confirm their email.
      // Redirecting to a "check your email" page is better UX than straight to dashboard.
      // For now, we will redirect to login with a message.
      router.push('/login?message=check-email');
    } else {
      setError(result.error?.message || "An unexpected error occurred.");
      setIsLoading(false);
    }
  };

  return (
    <SignUpUI
      form={form}
      onSubmit={onSubmit}
      onGoogleSignIn={handleGoogleSignIn}
      isLoading={isLoading}
      isGoogleLoading={isGoogleLoading}
      error={error}
      role={role}
    />
  );
}