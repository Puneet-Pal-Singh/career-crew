// src/components/auth/UpdatePasswordForm.tsx
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { updatePasswordAction } from '@/app/actions/auth/updatePasswordAction';
import { CheckCircle, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient'; // ✅ Import client-side supabase

const formSchema = z.object({
  password: z.string().min(8, 'Password must be at least 8 characters.'),
  confirmPassword: z.string().min(8, 'Please confirm your password.'),
})
.refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match.",
  path: ["confirmPassword"], // Point the error to the confirmPassword field
});

type FormValues = z.infer<typeof formSchema>;

export default function UpdatePasswordForm() {
     // ✅ THE FIX: Introduce a sessionStatus state to manage the UI.
  const [sessionStatus, setSessionStatus] = useState<'LOADING' | 'AUTHENTICATED' | 'UNAUTHENTICATED'>('LOADING');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'INITIAL_SESSION' || event === 'SIGNED_IN') {
        if (session) {
          setSessionStatus('AUTHENTICATED');
        } else {
          setSessionStatus('UNAUTHENTICATED');
          router.replace('/login?error=invalid_token'); // Use replace to avoid adding to history
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { password: '', confirmPassword: '' },
  });

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    const result = await updatePasswordAction({ password: values.password });

    if (result.success) {
      setSuccess(true);
      // After a short delay, redirect to the login page with a success message
      setTimeout(() => {
        router.push('/login?message=password-updated');
      }, 2000);
    } else {
      setError(result.error?.message || 'An unexpected error occurred.');
      setIsLoading(false);
    }
  };
  
  // ✅ THE FIX: Render UI based on the session status.
  if (sessionStatus === 'LOADING') {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (success) {
    return (
      <div className="text-center">
        <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
        <h3 className="mt-4 text-lg font-medium">Password Updated!</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          You will be redirected to the login page shortly.
        </p>
      </div>
    );
  }

  return  sessionStatus === 'AUTHENTICATED' ? (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <Label htmlFor="password">New Password</Label>
              <FormControl>
                <Input id="password" type="password" {...field} disabled={isLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <FormControl>
                <Input id="confirmPassword" type="password" {...field} disabled={isLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {error && (
          <p className="text-sm font-medium text-destructive">{error}</p>
        )}
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save New Password'}
        </Button>
      </form>
    </Form>
  ): null; // Render nothing while redirecting
}