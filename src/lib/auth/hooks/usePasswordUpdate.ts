// src/lib/auth/hooks/usePasswordUpdate.ts
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabase } from '@/lib/supabaseClient';
import { toast } from '@/hooks/use-toast';
import { type UpdatePasswordFormData } from '@/lib/formSchemas';

// Co-locate the schema with the hook that uses it.
const updatePasswordFormSchema = z
  .object({
    password: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters long.' }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match.",
    path: ['confirmPassword'],
  });

// Export the type for the dumb component to use.
// The schema is now imported, not defined here.
// The exported type now uses the imported schema.
export type { UpdatePasswordFormData };

export const usePasswordUpdate = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<UpdatePasswordFormData>({
    resolver: zodResolver(updatePasswordFormSchema),
    defaultValues: { password: '', confirmPassword: '' },
  });

  const onSubmit = async (values: UpdatePasswordFormData) => {
    setIsLoading(true);
    setError(null);
    const { error } = await supabase.auth.updateUser({ password: values.password });

    if (error) {
      setError(error.message);
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      setIsSuccess(true);
      toast({ title: 'Success!', description: 'Your password has been updated.' });
    }
    setIsLoading(false);
  };
  
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  return {
    form,
    isLoading,
    isSuccess,
    error,
    onSubmit,
    handleSignOut,
  };
};