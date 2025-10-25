// src/components/auth/password-reset/PasswordUpdateSuccess.tsx
"use client";

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';

interface PasswordUpdateSuccessProps {
  onContinue: () => void;
}

export default function PasswordUpdateSuccess({ onContinue }: PasswordUpdateSuccessProps) {
  return (
    <Card className="text-center">
      <CardHeader>
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 mb-4">
          <CheckCircle className="h-6 w-6 text-green-600" />
        </div>
        <CardTitle className="text-2xl">Password Reset Successful</CardTitle>
        <CardDescription>
          Your password has been changed. Please log in with your new credentials.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button onClick={onContinue} className="w-full">
          Back to Log In
        </Button>
      </CardContent>
    </Card>
  );
}