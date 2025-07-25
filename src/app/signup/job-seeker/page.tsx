// src/app/signup/job-seeker/page.tsx
import SignUpForm from "@/components/auth/SignUpForm";
import AuthPageLayout from "@/components/auth/AuthPageLayout";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign Up as a Job Seeker - CareerCrew',
};

export default function JobSeekerSignUpPage() {
  return (
    <AuthPageLayout>
      {/* Use the new SignUpForm, passing the 'JOB_SEEKER' role */}
      <SignUpForm role="JOB_SEEKER" />
    </AuthPageLayout>
  );
}