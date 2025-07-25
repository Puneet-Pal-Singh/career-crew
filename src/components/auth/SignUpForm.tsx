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

    // FIX: The role is now passed as a query parameter in the redirect URL.
    // This is the correct way to preserve the user's intent.
    const redirectTo = `${window.location.origin}/auth/callback?intended_role=${role}`;
    
    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectTo,
        queryParams: { prompt: 'select_account' },
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