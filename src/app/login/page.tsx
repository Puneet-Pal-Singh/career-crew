// src/app/login/page.tsx
import SignInForm from "@/components/auth/SignInForm";
import AuthPageLayout from "@/components/auth/AuthPageLayout";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Login - CareerCrew',
  description: 'Log in to your CareerCrew account.',
};

export default function LoginPage() {
  return (
    // The AuthPageLayout provides the centered container
    <AuthPageLayout>
      {/* Use the new, clean SignInForm component */}
      <SignInForm />
    </AuthPageLayout>
  );
}