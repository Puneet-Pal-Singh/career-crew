// src/components/auth/UpdatePasswordForm.tsx
"use client";

import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UpdatePasswordFormData } from '@/lib/formSchemas';

interface UpdatePasswordFormProps {
  form: ReturnType<typeof useForm<UpdatePasswordFormData>>;
  // The type of this prop is now correct and will match what the hook provides.
  onSubmit: (values: UpdatePasswordFormData) => void;
  isLoading: boolean;
  error: string | null;
}

export default function UpdatePasswordForm({
  form,
  onSubmit,
  isLoading,
  error,
}: UpdatePasswordFormProps) {
  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Set New Password</CardTitle>
        <CardDescription>Your new password must be at least 8 characters long.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          {/* CORRECTED: The form's onSubmit now correctly uses the react-hook-form handler */}
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor="password">New Password</Label>
                  <FormControl>
                    <Input id="password" type="password" {...field} disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <FormControl>
                    <Input id="confirmPassword" type="password" {...field} disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {error && <p className="text-sm font-medium text-destructive">{error}</p>}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Reset Password'}
            </Button>
            <div className="text-center">
              <Button variant="link" asChild className="text-muted-foreground">
                <Link href="/login">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Log In
                </Link>
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}