// src/lib/auth/hooks/useRecoverySession.ts
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { toast } from '@/hooks/use-toast';
import type { AuthChangeEvent } from '@supabase/supabase-js';

type VerificationStatus = 'VERIFYING' | 'VERIFIED' | 'FAILED';

export const useRecoverySession = (): VerificationStatus => {
  const router = useRouter();
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus>('VERIFYING');
  const [isExchangingCode, setIsExchangingCode] = useState(false);

  useEffect(() => {
    const exchangeCode = async () => {
      const searchParams = new URLSearchParams(window.location.search);
      const code = searchParams.get('code');
      if (code) {
        setIsExchangingCode(true);
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        setIsExchangingCode(false);
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
      if (isExchangingCode) return;

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
  }, [isExchangingCode]);

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