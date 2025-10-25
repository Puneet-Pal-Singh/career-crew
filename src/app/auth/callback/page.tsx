// src/app/auth/callback/page.tsx
"use client";

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/auth/contexts/AuthContext'; // Import our global auth hook
import { Loader2 } from 'lucide-react';
import { isValidInternalPath } from '@/lib/utils';

export default function AuthCallbackPage() {
  const { user, isInitialized } = useAuth(); // Get the user state from the global context
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // isInitialized ensures we have received at least one auth event from Supabase,
    // preventing a race condition on initial load.
    if (!isInitialized) {
      return; // Wait until the auth state is confirmed by our global listener.
    }

    // If our global context now has a user, the magic link was successful.
    if (user) {
      // THE FIX: Validate the 'next' parameter before redirecting.
      const rawNext = searchParams.get('next');
      const nextPath = isValidInternalPath(rawNext) ? rawNext : '/dashboard';
      router.replace(nextPath); // Redirect to the intended page (e.g., /update-password)
    } else {
      // If auth is initialized but there's no user, the link was likely invalid or expired.
      console.error("Auth callback: User not found after initialization. The link may be invalid.");
      router.replace('/login?error=invalid_link');
    }
    
  }, [user, isInitialized, router, searchParams]);

  // This is the loading state the user sees while the SDK works in the background.
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4 text-center">
      <div className="flex items-center space-x-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-lg text-muted-foreground">
          Finalizing your sign-in...
        </p>
      </div>
    </div>
  );
}