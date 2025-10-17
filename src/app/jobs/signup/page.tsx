// src/app/jobs/signup/page.tsx
import SignUpForm from "@/components/auth/sign-up/SignUpForm";
import AuthPageLayout from "@/components/auth/layout/AuthPageLayout";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign Up - CareerCrew',
  description: 'Create your account to start applying for jobs and building your career.',
};

export default function JobSeekerSignUpPage() {
  return (
    <AuthPageLayout>
      <SignUpForm role="JOB_SEEKER" />
    </AuthPageLayout>
  );
}