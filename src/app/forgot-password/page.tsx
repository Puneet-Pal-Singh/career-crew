// src/app/forgot-password/page.tsx
import type { Metadata } from 'next';
import AuthPageLayout from '@/components/auth/AuthPageLayout';
import ForgotPasswordForm from '@/components/auth/ForgotPasswordForm';

export const metadata: Metadata = {
  title: 'Forgot Password - CareerCrew',
  description: 'Reset your password to regain access to your account.',
};

export default function ForgotPasswordPage() {
  return (
    <AuthPageLayout>
      {/* This structure is now correct and will not cause a type error. */}
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Forgot Your Password?</h1>
        <p className="text-sm text-muted-foreground mt-2">
          No problem. Enter your email below and we&apos;ll send you a link to reset it.
        </p>
      </div>
      <ForgotPasswordForm />
    </AuthPageLayout>
  );
}