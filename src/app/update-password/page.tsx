// src/app/update-password/page.tsx
import type { Metadata } from 'next';
import AuthPageLayout from '@/components/auth/AuthPageLayout';
import UpdatePasswordForm from '@/components/auth/UpdatePasswordForm';

export const metadata: Metadata = {
  title: 'Update Your Password - CareerCrew',
};

export default async function UpdatePasswordPage() {
  return (
    <AuthPageLayout>
      {/* ✅ THE FIX: Render the title and subtitle as elements inside the layout */}
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Create a New Password</h1>
        <p className="text-sm text-muted-foreground mt-2">
          Please enter your new password below. Make sure it&apos;s secure.
        </p>
      </div>
      <UpdatePasswordForm />
    </AuthPageLayout>
  );
}