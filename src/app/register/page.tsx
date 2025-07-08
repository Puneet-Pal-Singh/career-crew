// src/app/register/page.tsx
import AuthForm from "@/components/auth/AuthForm";
import AuthPageLayout from "@/components/auth/AuthPageLayout";
import type { Metadata } from 'next';

// This page is dynamic and should always be revalidated on each request.
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Register - CareerCrew',
  description: 'Create a new account with CareerCrew.',
};

export default function RegisterPage() {
  return (
    <AuthPageLayout>
      <AuthForm mode="register" role="JOB_SEEKER" />
    </AuthPageLayout>
  );
}