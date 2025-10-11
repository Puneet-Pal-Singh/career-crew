"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { updatePasswordAction } from '@/app/actions/auth/updatePasswordAction';
import { supabase } from '@/lib/supabaseClient';
import { CheckCircle, ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const formSchema = z.object({
  password: z.string().min(8, 'Password must be at least 8 characters.'),
  confirmPassword: z.string(),
})
.refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match.",
  path: ["confirmPassword"],
});

type FormValues = z.infer<typeof formSchema>;

export default function UpdatePasswordForm() {
  const [sessionStatus, setSessionStatus] = useState<'LOADING' | 'AUTHENTICATED' | 'UNAUTHENTICATED'>('LOADING');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const router = useRouter();
  
  const timeoutId = useRef<NodeJS.Timeout | null>(null);
  const hasProcessedHash = useRef(false); // Track if we've processed the hash

  useEffect(() => {
    let isRecoveryFlow = false;

    // Check for recovery flow indicators
    if (typeof window !== 'undefined') {
      const hash = window.location.hash;
      const search = window.location.search;
      const fullUrl = window.location.href;

      isRecoveryFlow = hash.includes('access_token') ||
                      hash.includes('token_type=recovery') ||
                      search.includes('access_token') ||
                      fullUrl.includes('access_token');

      console.log('[UpdatePasswordForm] Full URL:', fullUrl);
      console.log('[UpdatePasswordForm] Hash:', hash);
      console.log('[UpdatePasswordForm] Is recovery flow:', isRecoveryFlow);
    }

    // Get current session and handle logic
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('[UpdatePasswordForm] Current session exists:', !!session);

      if (isRecoveryFlow) {
        console.log('[UpdatePasswordForm] Recovery flow detected - allowing password reset');
        setSessionStatus('AUTHENTICATED');

        // Set up auth state listener for recovery events
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, currentSession) => {
          console.log('[UpdatePasswordForm] Auth event:', event, 'Session exists:', !!currentSession);

          if (event === 'PASSWORD_RECOVERY') {
            console.log('[UpdatePasswordForm] Password recovery successful');
          }
        });

        // Set timeout for recovery flow
        timeoutId.current = setTimeout(() => {
          console.log('[UpdatePasswordForm] Recovery timeout - token may be expired');
          setError('Password reset link may have expired. Please request a new one.');
        }, 10000);

        return () => {
          subscription.unsubscribe();
          if (timeoutId.current) clearTimeout(timeoutId.current);
        };
      } else {
        // No recovery flow - invalid access
        console.log('[UpdatePasswordForm] No recovery flow detected - invalid access');
        setSessionStatus('UNAUTHENTICATED');
        setError('Invalid access. Please use the password reset link from your email.');
      }
    });

    // Cleanup
    return () => {
      if (timeoutId.current) clearTimeout(timeoutId.current);
    };
  }, [router]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { password: '', confirmPassword: '' },
  });

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    setError(null);
    const result = await updatePasswordAction({ password: values.password });
    if (result.success) {
      setSuccess(true);
    } else {
      setError(result.error?.message || 'An unexpected error occurred.');
      setIsLoading(false);
    }
  };

  if (sessionStatus === 'LOADING') {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (success) {
    const handleContinueToLogin = async () => {
      await supabase.auth.signOut();
      router.push('/login');
    };

    return (
      <Card className="text-center">
        <CardHeader>
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 mb-4">
              <CheckCircle className="h-6 w-6 text-green-600" />
          </div>
          <CardTitle className="text-2xl">Password reset</CardTitle>
          <CardDescription>
            Your password has been successfully reset. <br /> Click below to log in.
          </CardDescription>
        </CardHeader>
        <CardContent>
            <Button onClick={handleContinueToLogin} className="w-full">
              Back to Log in
            </Button>
        </CardContent>
      </Card>
    );
  }

  if (sessionStatus === 'AUTHENTICATED') {
    return (
      <Card>
         <CardHeader className="text-center">
           <CardTitle className="text-2xl">Set new password</CardTitle>
           <CardDescription>Your new password must be different to previously used passwords.</CardDescription>
         </CardHeader>
         <CardContent>
           <Form {...form}>
             <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
               <FormField
                 control={form.control}
                 name="password"
                 render={({ field }) => (
                   <FormItem>
                     <Label htmlFor="password">Password</Label>
                     <FormControl><Input id="password" type="password" {...field} disabled={isLoading} /></FormControl>
                     <p className="text-xs text-muted-foreground">Must be at least 8 characters.</p>
                     <FormMessage />
                   </FormItem>
                 )}
               />
               <FormField
                 control={form.control}
                 name="confirmPassword"
                 render={({ field }) => (
                   <FormItem>
                     <Label htmlFor="confirmPassword">Confirm password</Label>
                     <FormControl><Input id="confirmPassword" type="password" {...field} disabled={isLoading} /></FormControl>
                     <FormMessage />
                   </FormItem>
                 )}
               />
               {error && <p className="text-sm font-medium text-destructive">{error}</p>}
               <Button type="submit" className="w-full" disabled={isLoading}>
                 {isLoading ? 'Saving...' : 'Reset password'}
               </Button>
               <div className="text-center">
                   <Button variant="link" asChild className="text-muted-foreground">
                       <Link href="/login"><ArrowLeft className="mr-2 h-4 w-4" />Back to log in</Link>
                   </Button>
               </div>
             </form>
           </Form>
         </CardContent>
       </Card>
    );
  }

  if (sessionStatus === 'UNAUTHENTICATED') {
    return (
      <Card className="text-center">
        <CardHeader>
          <CardTitle className="text-2xl text-destructive">Access Denied</CardTitle>
          <CardDescription>
            {error || 'You do not have permission to access this page.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
            <Button variant="link" asChild className="text-muted-foreground">
              <Link href="/login">← Back to Login</Link>
            </Button>
        </CardContent>
      </Card>
    );
  }

  return null;
}