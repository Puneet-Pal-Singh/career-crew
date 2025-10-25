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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/lib/supabaseClient';
import { toast } from '@/hooks/use-toast';

const formSchema = z.object({
  email: z.string().email('Please enter a valid email address.'),
});

type FormValues = z.infer<typeof formSchema>;

export default function ForgotPasswordForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState('');

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);

    // THE OTP IMPLEMENTATION:
    // This now calls the client-side Supabase library to send a magic link.
    const { error } = await supabase.auth.signInWithOtp({
      email: values.email,
      options: {
        // This is the URL the user will be sent to after clicking the link in the email.
        // It points to our existing callback route.
        emailRedirectTo: `${window.location.origin}/auth/callback?next=/update-password`,
      },
    });

    setIsLoading(false);

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      // For security, always show the success message to prevent email enumeration.
      setSubmittedEmail(values.email);
      setIsSuccess(true);
    }
  };

  if (isSuccess) {
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
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Forgot password?</CardTitle>
        <CardDescription>No worries, we&apos;ll send you a secure link to reset it.</CardDescription>
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
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Sending Link...' : 'Send Reset Link'}
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