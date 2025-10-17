// src/app/login/page.tsx
import SignInForm from "@/components/auth/sign-in/SignInForm";
import AuthPageLayout from "@/components/auth/layout/AuthPageLayout";
import { createPageMetadata } from '@/lib/seo';

export const metadata = createPageMetadata({
  title: 'Login',
  description: 'Log in to your CareerCrew account to access your dashboard, applications, and job postings.',
  robots: {
    index: false, // Don't index login pages
    follow: false,
  },
});

export default function LoginPage() {
  return (
    // The AuthPageLayout provides the centered container
    <AuthPageLayout>
      {/* Use the new, clean SignInForm component */}
      <SignInForm />
    </AuthPageLayout>
  );
}