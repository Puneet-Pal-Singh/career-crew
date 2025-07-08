// src/app/login/page.tsx
import AuthForm from "@/components/auth/AuthForm";
import AuthPageLayout from "@/components/auth/AuthPageLayout";
import type { Metadata } from 'next';

// This page is dynamic and should always be revalidated on each request.
// Prevents the searchParams error
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Login - CareerCrew',
  description: 'Log in to your CareerCrew account.',
};

export default function LoginPage() {
  return (
    <AuthPageLayout>
      <AuthForm mode="login" role="JOB_SEEKER" />
    </AuthPageLayout>
  );
}