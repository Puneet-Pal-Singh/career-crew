// src/app/update-password/UpdatePasswordPageClient.tsx
"use client";

import { useRecoverySession } from '@/lib/auth/hooks/useRecoverySession';
import { useUpdatePassword } from '@/lib/auth/hooks/useUpdatePassword';
import UpdatePasswordForm from '@/components/auth/password-reset/UpdatePasswordForm';
import PasswordUpdateSuccess from '@/components/auth/password-reset/PasswordUpdateSuccess'; // Import the new component
import { Loader2 } from 'lucide-react';

export default function UpdatePasswordPageClient() {
  const verificationStatus = useRecoverySession();
  const {
    form,
    isLoading,
    isSuccess,
    error,
    onSubmit,
    handleContinueToLogin,
  } = useUpdatePassword();

  if (verificationStatus === 'VERIFYING') {
    return (
      <div className="flex flex-col justify-center items-center py-8 text-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Verifying your recovery link...</p>
      </div>
    );
  }

  // CLEANED UP: Now uses the dedicated success component.
  if (isSuccess) {
    return <PasswordUpdateSuccess onContinue={handleContinueToLogin} />;
  }
  
  if (verificationStatus === 'VERIFIED') {
    return (
      <UpdatePasswordForm
        form={form}
        onSubmit={onSubmit}
        isLoading={isLoading}
        error={error}
      />
    );
  }

  return (
    <div className="flex flex-col justify-center items-center py-8 text-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="mt-4 text-muted-foreground">Redirecting...</p>
    </div>
  );
}