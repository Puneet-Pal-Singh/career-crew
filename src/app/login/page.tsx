// src/app/login/page.tsx
import AuthForm from "@/components/auth/AuthForm";
import AuthPageLayout from "@/components/auth/AuthPageLayout";
import { UserRole } from "@/types";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Login - CareerCrew',
  description: 'Log in to your CareerCrew account.',
};

export default function LoginPage({ 
  searchParams 
}: { 
  searchParams: { as?: string } 
}) {
  // Determine the role from the URL, defaulting to JOB_SEEKER for safety.
  const role: UserRole = searchParams.as === 'employer' ? 'EMPLOYER' : 'JOB_SEEKER';

  return (
    <AuthPageLayout>
      <AuthForm mode="login" role={role} />
    </AuthPageLayout>
  );
}