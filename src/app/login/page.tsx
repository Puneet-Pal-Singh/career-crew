// src/app/login/page.tsx
import AuthForm from "@/components/auth/AuthForm";
import AuthPageLayout from "@/components/auth/AuthPageLayout";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Login - CareerCrew',
  description: 'Log in to your CareerCrew account.',
};

export default function LoginPage() {
  // Note: We don't pass a role here, as AuthForm will be updated to handle a universal login.
  return (
    <AuthPageLayout>
      <AuthForm mode="login" />
    </AuthPageLayout>
  );
}