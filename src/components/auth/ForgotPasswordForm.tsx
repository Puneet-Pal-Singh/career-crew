// src/components/auth/ForgotPasswordForm.tsx
"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import Link from 'next/link';
import { Mail } from 'lucide-react';
import { forgotPasswordAction } from '@/app/actions/auth/forgotPasswordAction';

const formSchema = z.object({
  email: z.string().email('Please enter a valid email address.'),
});

type FormValues = z.infer<typeof formSchema>;

export default function ForgotPasswordForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    const result = await forgotPasswordAction(values);

    if (result.success) {
      // We always show the success message to prevent email enumeration attacks.
      setSuccess(true);
    } else {
      // This will only show if the server action itself has a catastrophic failure.
      setError(result.error?.message || 'An unexpected error occurred. Please try again.');
    }
    
    setIsLoading(false);
  };

  if (success) {
    return (
      <div className="text-center">
        <Mail className="mx-auto h-12 w-12 text-green-500" />
        <h3 className="mt-4 text-lg font-medium">Check your email</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          If an account with that email exists, we have sent a password reset link.
        </p>
        <Button asChild className="mt-6 w-full">
          <Link href="/login">Back to Login</Link>
        </Button>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <Label htmlFor="email">Email Address</Label>
              <FormControl>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  {...field}
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {error && (
          <p className="text-sm font-medium text-destructive">{error}</p>
        )}
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? 'Sending...' : 'Send Reset Link'}
        </Button>
        <div className="text-center text-sm">
          <Link href="/login" className="font-medium text-primary hover:underline">
            Remember your password? Log in
          </Link>
        </div>
      </form>
    </Form>
  );
}