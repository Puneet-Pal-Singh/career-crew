// src/components/auth/SignUpForm.tsx

"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { registerUserAction } from '@/app/actions/auth/registerUserAction';
import { supabase } from '@/lib/supabaseClient';
// ❌ We no longer need the broad UserRole type here, as it's too permissive.
// import type { UserRole } from '@/types';
import { SignUpUI } from '@/components/ui/authui/SignUpUI';

// ✅ THE FIX: Define a stricter type for the roles this form can handle.
// This component should never be used to create an Admin.
type PublicSignUpRole = 'EMPLOYER' | 'JOB_SEEKER';

interface SignUpFormProps {
  // Use the new, more specific type for the role prop.
  role: PublicSignUpRole;
}

const formSchema = z.object({
  fullName: z.string().min(2, 'Full name is required.'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export type FormValues = z.infer<typeof formSchema>;

// The component now correctly enforces that its role can only be one of the public types.
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
    
    // This logic is correct.
    const redirectTo = `${window.location.origin}/auth/callback?intended_role=${role}`;
    
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo,
        queryParams: { prompt: 'select_account' },
      },
    });
    
    if (error) {
      setError('Failed to sign in with Google. Please try again.');
      setIsGoogleLoading(false);
    }
  };

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    setError(null);

    // ✅ This call is now type-safe. TypeScript knows that 'role' cannot be 'ADMIN'.
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