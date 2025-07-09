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
import { updateOnboardingAction } from './updateOnboardingAction'; // We will create this next
import type { UserRole } from '@/types';

const formSchema = z.object({
  fullName: z.string().min(2, 'Please enter your full name.'),
  // Add other fields here as needed, e.g., company name for employers
  companyName: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function OnboardingForm({ fullName, role }: { fullName: string, role: UserRole }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { fullName: fullName, companyName: '' },
  });

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    setError(null);
    
    const result = await updateOnboardingAction(values);

    if (result.success) {
      router.push('/dashboard'); // Success! Go to the real dashboard.
    } else {
      setError(result.error || 'An unexpected error occurred.');
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Welcome! Let&apos;s Complete Your Profile</CardTitle>
        <CardDescription>A complete profile helps you get the most out of CareerCrew.</CardDescription>
      </CardHeader>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input id="fullName" {...form.register('fullName')} disabled={isLoading} />
            {form.formState.errors.fullName && <p className="text-sm text-destructive">{form.formState.errors.fullName.message}</p>}
          </div>
          {role === 'EMPLOYER' && (
            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name (Optional)</Label>
              <Input id="companyName" {...form.register('companyName')} placeholder="e.g., Acme Inc." disabled={isLoading} />
            </div>
          )}
        </CardContent>
        <CardFooter className="flex-col items-stretch">
          {error && <p className="text-sm font-medium text-destructive text-center mb-4">{error}</p>}
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save and Continue
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}