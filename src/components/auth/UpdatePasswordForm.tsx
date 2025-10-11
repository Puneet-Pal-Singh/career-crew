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
    // Improved recovery flow detection - check for various Supabase reset URL patterns
    let isRecoveryFlow = false;
    if (typeof window !== 'undefined') {
      const hash = window.location.hash;
      const searchParams = new URLSearchParams(window.location.search);

      // Check for various recovery flow indicators
      isRecoveryFlow = hash.includes('access_token') ||
                      hash.includes('type=recovery') ||
                      hash.includes('token_type=recovery') ||
                      searchParams.has('access_token') ||
                      searchParams.has('token_type');
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('[UpdatePasswordForm] Auth event:', event, 'Session exists:', !!session, 'Recovery flow:', isRecoveryFlow);

      // Handles the successful validation of a password recovery token.
      if (event === 'PASSWORD_RECOVERY') {
        if (timeoutId.current) clearTimeout(timeoutId.current);
        hasProcessedHash.current = true;
        setSessionStatus('AUTHENTICATED');
        console.log('[UpdatePasswordForm] Password recovery successful');
      }
      // Handles a fully signed-in user who might navigate here.
      else if (event === 'SIGNED_IN' && !hasProcessedHash.current) {
        if (timeoutId.current) clearTimeout(timeoutId.current);
        // Only redirect to dashboard if this is NOT a recovery flow
        if (!isRecoveryFlow) {
          console.log('[UpdatePasswordForm] Signed in event - redirecting to dashboard');
          router.replace('/dashboard');
        } else {
          console.log('[UpdatePasswordForm] Signed in during recovery flow - staying on update password');
        }
      }
      // This is the most critical event on page load.
      else if (event === 'INITIAL_SESSION') {
        // If it's a recovery flow, we do nothing and wait for the PASSWORD_RECOVERY event.
        if (isRecoveryFlow) {
          console.log('[UpdatePasswordForm] Recovery flow detected - waiting for PASSWORD_RECOVERY event');
          return;
        }

        // It's NOT a recovery flow. Check for an existing session.
        if (session) {
          // A logged-in user landed here. Redirect them to their dashboard.
          console.log('[UpdatePasswordForm] Logged in user on update password page - redirecting to dashboard');
          router.replace('/dashboard');
        } else {
          // A logged-out user landed here with no token. Redirect them to login.
          console.log('[UpdatePasswordForm] No session and no recovery flow - redirecting to login');
          setSessionStatus('UNAUTHENTICATED');
          router.replace('/login?error=invalid_token');
        }
      }
    });

    // If it's a recovery flow, set a timeout. If PASSWORD_RECOVERY doesn't fire,
    // it means the token was invalid or expired.
    if (isRecoveryFlow) {
      console.log('[UpdatePasswordForm] Setting recovery timeout');
      timeoutId.current = setTimeout(() => {
        if (!hasProcessedHash.current) {
          console.log('[UpdatePasswordForm] Recovery timeout - token expired');
          setSessionStatus('UNAUTHENTICATED');
          router.replace('/login?error=expired_token');
        }
      }, 5000);
    }

    // Cleanup function to prevent memory leaks.
    return () => {
      subscription.unsubscribe();
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

  return sessionStatus === 'AUTHENTICATED' ? (
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
  ) : null;
}