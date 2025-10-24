// src/components/auth/forgot-password/ForgotPasswordForm.tsx
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
import { Mail, ArrowLeft } from 'lucide-react';
import { forgotPasswordAction } from '@/app/actions/auth/forgotPasswordAction';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const formSchema = z.object({
  email: z.string().email('Please enter a valid email address.'),
});

type FormValues = z.infer<typeof formSchema>;

export default function ForgotPasswordForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [submittedEmail, setSubmittedEmail] = useState<string>('');

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    setError(null);
    const result = await forgotPasswordAction(values);
    if (result.success) {
      setSubmittedEmail(values.email);
      setSuccess(true);
    } else {
      setError(result.error?.message || 'An unexpected error occurred.');
    }
    setIsLoading(false);
  };

  if (success) {
    return (
      <Card className="text-center">
        <CardHeader>
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-4">
                <Mail className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-2xl">Check your email</CardTitle>
            <CardDescription>
                We&apos;ve sent a password reset link to <br/>
                <span className="font-medium text-foreground">{submittedEmail}</span>
            </CardDescription>
        </CardHeader>
        <CardContent>
            <Button asChild className="w-full">
                <Link href="/login">Back to log in</Link>
            </Button>
            <p className="mt-4 text-xs text-muted-foreground">
                Didn&apos;t receive the email? <Button variant="link" size="sm" className="p-0 h-auto" onClick={() => {
                  setSuccess(false);
                  setError(null);
                  setSubmittedEmail('');
                }}>Click to resend</Button>
            </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="text-center">
        {/* You can add a logo icon here if you have one */}
        <CardTitle className="text-2xl">Forgot password?</CardTitle>
        <CardDescription>No worries, we&apos;ll send you reset instructions.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor="email">Email</Label>
                  <FormControl>
                    <Input id="email" type="email" placeholder="Enter your email" {...field} disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {error && <p className="text-sm font-medium text-destructive">{error}</p>}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Sending...' : 'Reset password'}
            </Button>
            <div className="text-center">
                <Button variant="link" asChild className="text-muted-foreground">
                    <Link href="/login"><ArrowLeft className="mr-2 h-4 w-4" />Back to log in</Link>
                </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}