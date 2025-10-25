// src/app/update-password/page.tsx
import type { Metadata } from 'next';
import AuthPageLayout from '@/components/auth/layout/AuthPageLayout';
import UpdatePasswordPageClient from './UpdatePasswordPageClient';

export const metadata: Metadata = {
  title: 'Update Your Password',
  description: 'Set a new password for your CareerCrew account.',
};

// This Server Component renders the layout and the client-side orchestrator.
export default function UpdatePasswordPage() {
  return (
    <AuthPageLayout>
      <UpdatePasswordPageClient />
    </AuthPageLayout>
  );
}