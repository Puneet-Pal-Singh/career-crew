// /app/update-password/page.tsx
import AuthPageLayout from '@/components/auth/layout/AuthPageLayout';
import UpdatePasswordPageClient from './UpdatePasswordPageClient'; // Import our new client component
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Update Your Password',
  description: 'Set a new password for your CareerCrew account.',
};

// This page remains a Server Component, as is best practice.
// Its only job is to render the layout and the client-side orchestrator.
export default function UpdatePasswordPage() {
  return (
    <AuthPageLayout>
      <UpdatePasswordPageClient />
    </AuthPageLayout>
  );
}