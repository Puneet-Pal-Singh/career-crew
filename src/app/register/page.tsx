// src/app/register/page.tsx
import AuthForm from "@/components/auth/AuthForm"; // Adjust path
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Register - CareerCrew Consulting',
  description: 'Create a new account with CareerCrew Consulting.',
};

export default function RegisterPage() {
  return (
    <div className="flex min-h-[calc(100vh-var(--header-height,80px)-var(--footer-height,80px))] flex-col items-center justify-center bg-gradient-to-br from-background via-background-light to-surface-light dark:from-background dark:via-background-dark dark:to-surface-dark px-4 py-12 sm:px-6 lg:px-8">
      <AuthForm mode="register" />
    </div>
  );
}