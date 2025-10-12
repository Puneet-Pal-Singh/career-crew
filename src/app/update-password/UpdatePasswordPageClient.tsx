// src/app/update-password/UpdatePasswordPageClient.tsx
"use client";

import { usePasswordRecovery } from '@/hooks/usePasswordRecovery';
import UpdatePasswordForm from '@/components/auth/UpdatePasswordForm';
import { Loader2 } from 'lucide-react';

/**
 * This is the client-side orchestrator for the update password page.
 * Its single responsibility is to use the `usePasswordRecovery` hook
 * to determine the auth state and then render the correct component.
 */
export default function UpdatePasswordPageClient() {
  const status = usePasswordRecovery();

  if (status === 'LOADING') {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-4 text-muted-foreground">Verifying your link...</p>
      </div>
    );
  }

  if (status === 'AUTHENTICATED') {
    return <UpdatePasswordForm />;
  }

  // If the status is 'UNAUTHENTICATED', the hook has already handled the redirect,
  // so we can just render null here while the page transitions.
  return null;
}