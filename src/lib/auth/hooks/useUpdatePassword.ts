// src/lib/auth/hooks/useUpdatePassword.ts
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { supabase } from '@/lib/supabaseClient';
import { toast } from '@/hooks/use-toast';
import { updatePasswordFormSchema, UpdatePasswordFormData } from '@/lib/formSchemas';
import { useRouter } from 'next/navigation';

export const useUpdatePassword = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<UpdatePasswordFormData>({
    resolver: zodResolver(updatePasswordFormSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  // This is the raw submit handler. Its signature matches what our form component expects.
  const onSubmit = async (values: UpdatePasswordFormData) => {
    setIsLoading(true);
    setError(null);
    const { error } = await supabase.auth.updateUser({ password: values.password });

    if (error) {
      setError(error.message);
      setIsLoading(false);
      toast({ title: 'Error updating password', description: error.message, variant: 'destructive' });
    } else {
      setIsSuccess(true);
      setIsLoading(false);
      toast({ title: 'Success!', description: 'Your password has been updated.' });
    }
  };
  
  const handleContinueToLogin = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  return {
    form,
    isLoading,
    isSuccess,
    error,
    // CORRECTED: Export the raw onSubmit function.
    // The form component will be responsible for wrapping it with form.handleSubmit.
    onSubmit, 
    handleContinueToLogin,
  };
};