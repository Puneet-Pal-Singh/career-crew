// src/lib/auth/hooks/useRecoverySession.ts
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient'; // CORRECTED IMPORT
import { toast } from '@/hooks/use-toast';
import type { AuthChangeEvent } from '@supabase/supabase-js'; // IMPORT TYPE FOR EVENT

type VerificationStatus = 'VERIFYING' | 'VERIFIED' | 'FAILED';

/**
 * SRP: This hook's ONLY responsibility is to verify if the user is in a
 * valid password recovery session. It handles the PKCE code exchange and
 * listens to auth state, returning a simple status.
 */
export const useRecoverySession = (): VerificationStatus => {
  const router = useRouter();
  // No need to call a function, use the imported client directly.
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus>('VERIFYING');

  useEffect(() => {
    const exchangeCode = async () => {
      const searchParams = new URLSearchParams(window.location.search);
      const code = searchParams.get('code');
      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (error) {
          console.error('Password Recovery Error:', error.message);
          toast({
            title: 'Invalid Link',
            description: 'Your password recovery link is invalid or has expired.',
            variant: 'destructive',
          });
          router.replace('/login?error=invalid_token');
          return;
        }
      }
    };
    exchangeCode();

    // CORRECTLY TYPED EVENT PARAMETER
    const { data: authListener } = supabase.auth.onAuthStateChange((event: AuthChangeEvent) => {
      if (event === 'PASSWORD_RECOVERY') {
        setVerificationStatus('VERIFIED');
        window.history.replaceState(null, '', window.location.pathname);
      }
    });

    return () => authListener.subscription.unsubscribe();
  }, [router]);

  useEffect(() => {
    const checkInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        const searchParams = new URLSearchParams(window.location.search);
        if (!searchParams.has('code')) {
            setVerificationStatus('FAILED');
        }
      }
    };
    const timer = setTimeout(checkInitialSession, 1000); 
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (verificationStatus === 'FAILED') {
      toast({
        title: 'Authentication Error',
        description: 'Invalid or expired recovery link.',
        variant: 'destructive',
      });
      router.replace('/login?error=auth_required');
    }
  }, [verificationStatus, router]);

  return verificationStatus;
};