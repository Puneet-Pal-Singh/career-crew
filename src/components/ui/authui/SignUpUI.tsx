// src/components/ui/authui/SignUpUI.tsx
"use client";

import type { UseFormReturn } from 'react-hook-form';
import type { FormValues as SignUpFormValues } from '@/components/auth/SignUpForm';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import type { UserRole } from '@/types';

const GoogleIcon = () => (
    <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4">
      <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.85 3.18-1.73 4.1-1.02 1.02-2.6 1.62-4.58 1.62-3.53 0-6.47-2.82-6.47-6.3s2.94-6.3 6.47-6.3c1.93 0 3.26.77 4.18 1.62l2.33-2.33C18.47 2.94 15.82 2 12.48 2c-5.52 0-10 4.48-10 10s4.48 10 10 10c5.73 0 9.5-3.87 9.5-9.66 0-.63-.06-1.22-.16-1.8z" fill="currentColor"/>
    </svg>
);

interface SignUpUIProps {
  form: UseFormReturn<SignUpFormValues>;
  onSubmit: (values: SignUpFormValues) => void;
  onGoogleSignIn: () => void;
  isLoading: boolean;
  isGoogleLoading: boolean;
  error: string | null;
  role: UserRole;
}

export function SignUpUI({ form, onSubmit, onGoogleSignIn, isLoading, isGoogleLoading, error, role }: SignUpUIProps) {
  return (
    <div className="mx-auto w-full max-w-md rounded-2xl bg-card p-8 shadow-2xl top-5">
      <div className="mb-8 flex flex-col items-center gap-4 text-center">
        {/* Removed icon */}
        {/* <div className="flex size-11 items-center justify-center rounded-full border">
          <svg className="stroke-foreground" width="20" height="20" viewBox="0 0 32 32"><circle cx="16" cy="16" r="12" fill="none" strokeWidth="8" /></svg>
        </div> */}
        <h1 className="text-2xl font-bold tracking-tight">
          {role === 'EMPLOYER' ? 'Create a Company Account' : 'Create an Account'}
        </h1>
        <p className="text-muted-foreground">We just need a few details to get you started.</p>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full name</Label>
            <Input id="fullName" placeholder="Matt Welsh" {...form.register('fullName')} disabled={isLoading || isGoogleLoading} />
            {form.formState.errors.fullName && <p className="text-sm text-destructive">{form.formState.errors.fullName.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">{role === 'EMPLOYER' ? 'Work Email' : 'Email'}</Label>
            <Input id="email" placeholder="you@example.com" type="email" {...form.register('email')} disabled={isLoading || isGoogleLoading} />
            {form.formState.errors.email && <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" placeholder="Enter your password" type="password" {...form.register('password')} disabled={isLoading || isGoogleLoading} />
            {form.formState.errors.password && <p className="text-sm text-destructive">{form.formState.errors.password.message}</p>}
          </div>
        </div>
        {error && <p className="text-sm font-medium text-destructive">{error}</p>}
        <Button type="submit" className="w-full !mt-6" disabled={isLoading || isGoogleLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Sign up
        </Button>
      </form>

      <div className="relative my-6"><div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div><div className="relative flex justify-center text-xs uppercase"><span className="bg-card px-2 text-muted-foreground">Or</span></div></div>
      <Button variant="outline" className="w-full" onClick={onGoogleSignIn} disabled={isLoading || isGoogleLoading}>
        {isGoogleLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <GoogleIcon />} Continue with Google
      </Button>
      <p className="mt-8 text-center text-xs text-muted-foreground">
        By signing up you agree to our <Link href="/terms" className="underline hover:no-underline">Terms</Link>.
      </p>
    </div>
  );
}