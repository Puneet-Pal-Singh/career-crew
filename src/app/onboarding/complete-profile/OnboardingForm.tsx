// src/app/onboarding/complete-profile/OnboardingForm.tsx
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { updateOnboardingAction } from './updateOnboardingAction';
// REMOVED: No longer need the broad UserRole type.
// import type { UserRole } from '@/types';

const formSchema = z.object({
  fullName: z.string().min(2, 'Please enter your full name.'),
  phone: z.string().min(10, 'A valid 10-digit phone number is required.'), // Removed .optional()
});

type FormValues = z.infer<typeof formSchema>;

// FIX: Define a stricter type for the role that this form can handle.
// This aligns with the security fix in the server action.
type OnboardingRole = 'JOB_SEEKER' | 'EMPLOYER';

interface OnboardingFormProps {
  fullName: string;
  role: OnboardingRole;
  // FIX: Add a prop to receive the redirect URL
  afterSignIn: string | null;
}

// FIX: Update the component's props to use the new, stricter type.
export default function OnboardingForm({ fullName, role, afterSignIn }: OnboardingFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { fullName: fullName, phone: '' },
  });

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    setError(null);
    // This call is now type-safe. The 'role' prop can no longer be 'ADMIN'.
    const result = await updateOnboardingAction({ ...values, role: role, redirectTo: afterSignIn});

    if (result.success && result.redirectTo) {

      // FIX: Use the redirect path returned from the server action
      router.push(result.redirectTo);
      router.refresh();
    } else {
      // Assuming result.error is a string now based on previous refactors
      const errorMessage = typeof result.error === 'string' ? result.error : 'An unexpected error occurred.';
      setError(errorMessage);
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full shadow-xl">
      <CardHeader>
        <CardTitle className="text-2xl">Welcome to CareerCrew!</CardTitle>
        <CardDescription>
          {role === 'EMPLOYER' ? "Let's set up your company profile." : "Let's complete your profile to get you started."}
        </CardDescription>
      </CardHeader>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input id="fullName" {...form.register('fullName')} disabled={isLoading} />
            {form.formState.errors.fullName && <p className="text-sm text-destructive">{form.formState.errors.fullName.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number *</Label> {/* Added asterisk */}
            <Input id="phone" type="tel" {...form.register('phone')} required /> {/* Added required */}
            {form.formState.errors.phone && <p className="text-sm text-destructive">{form.formState.errors.phone.message}</p>}
          </div>
        </CardContent>
        <CardFooter className="flex-col items-stretch">
          {error && <p className="text-sm font-medium text-destructive text-center mb-4">{error}</p>}
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save and Continue to Dashboard
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}