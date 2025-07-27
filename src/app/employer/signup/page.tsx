// src/app/employer/signup/page.tsx
import SignUpForm from "@/components/auth/SignUpForm";
import AuthPageLayout from "@/components/auth/AuthPageLayout";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Employer Sign Up - CareerCrew',
  description: 'Create your employer account to post jobs and find the best candidates.',
};

export default function EmployerSignUpPage() {
  return (
    <AuthPageLayout>
      <SignUpForm role="EMPLOYER" />
    </AuthPageLayout>
  );
}