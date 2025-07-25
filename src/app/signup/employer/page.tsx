// src/app/signup/employer/page.tsx
import SignUpForm from "@/components/auth/SignUpForm";
import AuthPageLayout from "@/components/auth/AuthPageLayout";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign Up as an Employer - CareerCrew',
};

export default function EmployerSignUpPage() {
  return (
    <AuthPageLayout>
      {/* Use the new SignUpForm, passing the 'EMPLOYER' role */}
      <SignUpForm role="EMPLOYER" />
    </AuthPageLayout>
  );
}