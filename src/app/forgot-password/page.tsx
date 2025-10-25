// src/app/forgot-password/page.tsx
import type { Metadata } from 'next';
import ForgotPasswordForm from '@/components/auth/forgot-password/ForgotPasswordForm';

export const metadata: Metadata = {
  title: 'Forgot Password - CareerCrew',
  description: 'Reset your password to regain access to your account.',
};

export default function ForgotPasswordPage() {
  return (
    // This layout centers the form on the page, matching the inspiration.
    <div className="min-h-screen flex items-center justify-center bg-muted/40 p-4">
      <div className="w-full max-w-md">
        <ForgotPasswordForm />
      </div>
    </div>
  );
}