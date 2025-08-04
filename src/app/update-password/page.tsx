// src/app/update-password/page.tsx
import type { Metadata } from 'next';
import UpdatePasswordForm from '@/components/auth/UpdatePasswordForm';

export const metadata: Metadata = {
  title: 'Update Your Password - CareerCrew',
};

export default function UpdatePasswordPage() {
  return (
    // This layout centers the form on the page, matching the inspiration.
    <div className="min-h-screen flex items-center justify-center bg-muted/40 p-4">
      <div className="w-full max-w-md">
        <UpdatePasswordForm />
      </div>
    </div>
  );
}