// src/app/auth/auth-code-error/page.tsx
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

export default function AuthErrorPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4 text-center">
      <div className="max-w-md">
        <AlertTriangle className="mx-auto h-12 w-12 text-destructive" />
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground">
          Authentication Error
        </h1>
        <p className="mt-4 text-muted-foreground">
          Sorry, we couldn&apos;t sign you in. There was a problem with the authentication provider. Please try again.
        </p>
        <div className="mt-6">
          <Button asChild>
            <Link href="/login">Return to Login</Link>
          </Button>
        </div>
      </div>
    </div> 
  );
}