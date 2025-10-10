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
    
    // Check if this looks like a recovery link
    if (typeof window !== 'undefined') {
      const hash = window.location.hash;
      const fullUrl = window.location.href;
      isRecoveryFlow = hash.includes('type=recovery') || hash.includes('access_token');
      console.log('🔍 Full URL:', fullUrl);
      console.log('🔍 Hash:', hash);
      console.log('🔍 Is Recovery Flow:', isRecoveryFlow);
    }

    // Set up the auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('🔔 Auth event:', event, 'Has session:', !!session, 'Is Recovery Flow:', isRecoveryFlow);

      if (event === 'PASSWORD_RECOVERY') {
        // Valid recovery token detected
        console.log('✅ PASSWORD_RECOVERY event received');
        if (timeoutId.current) clearTimeout(timeoutId.current);
        hasProcessedHash.current = true;
        setSessionStatus('AUTHENTICATED');
      } 
      else if (event === 'SIGNED_IN' && !hasProcessedHash.current) {
        // User is already logged in (not from password recovery)
        if (timeoutId.current) clearTimeout(timeoutId.current);
        router.replace('/dashboard');
      }
      else if (event === 'INITIAL_SESSION') {
        console.log('🔄 INITIAL_SESSION - Recovery flow:', isRecoveryFlow, 'Has session:', !!session);
        
        // CRITICAL: Do NOT redirect immediately if it's a recovery flow
        // We need to wait for PASSWORD_RECOVERY event
        if (isRecoveryFlow) {
          console.log('⏳ Recovery flow detected - waiting for PASSWORD_RECOVERY event');
          // Do nothing - let the timeout handle invalid tokens
          return;
        }
        
        // Only redirect if it's NOT a recovery flow and there's no session
        if (!session) {
          console.log('❌ No recovery flow and no session - redirecting to login');
          setSessionStatus('UNAUTHENTICATED');
          router.replace('/login?error=invalid_token');
        }
      }
    });

    // Set fallback timeout only for recovery flows
    if (isRecoveryFlow) {
      timeoutId.current = setTimeout(() => {
        if (!hasProcessedHash.current) {
          console.log('⏰ Timeout: No PASSWORD_RECOVERY event received - token likely expired');
          setSessionStatus('UNAUTHENTICATED');
          router.replace('/login?error=expired_token');
        }
      }, 5000); // 5 seconds to wait for PASSWORD_RECOVERY
    } else {
      // If not a recovery flow and we reach here, check session immediately
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (!session) {
          setSessionStatus('UNAUTHENTICATED');
          router.replace('/login?error=invalid_token');
        }
      });
    }

    // Cleanup
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