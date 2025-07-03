// src/app/register/page.tsx
import AuthForm from "@/components/auth/AuthForm";
import AuthPageLayout from "@/components/auth/AuthPageLayout";
import { UserRole } from "@/types";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Register - CareerCrew',
  description: 'Create a new account with CareerCrew.',
};

export default function RegisterPage({ 
  searchParams 
}: { 
  searchParams: { as?: string } 
}) {
  // Determine the role from the URL, defaulting to JOB_SEEKER.
  const role: UserRole = searchParams.as === 'employer' ? 'EMPLOYER' : 'JOB_SEEKER';
  
  return (
    <AuthPageLayout>
      <AuthForm mode="register" role={role} />
    </AuthPageLayout>
  );
}