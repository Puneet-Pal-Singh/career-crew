// src/app/update-password/UpdatePasswordPageClient.tsx
"use client";

import { usePasswordUpdate } from '@/lib/auth/hooks/usePasswordUpdate';
import UpdatePasswordForm from '@/components/auth/password-reset/UpdatePasswordForm';
import PasswordUpdateSuccess from '@/components/auth/password-reset/PasswordUpdateSuccess';

// This "Controller" component connects the logic (hook) to the UI (dumb components).
export default function UpdatePasswordPageClient() {
  const {
    form,
    isLoading,
    isSuccess,
    error,
    onSubmit,
    handleSignOut,
  } = usePasswordUpdate();

  if (isSuccess) {
    return <PasswordUpdateSuccess onContinue={handleSignOut} />;
  }
  
  return (
    <UpdatePasswordForm
      form={form}
      onSubmit={onSubmit}
      isLoading={isLoading}
      error={error}
    />
  );
}