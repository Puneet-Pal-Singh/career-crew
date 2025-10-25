// src/components/auth/password-reset/UpdatePasswordForm.tsx
"use client";

import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { UpdatePasswordFormData } from '@/lib/auth/hooks/usePasswordUpdate';

// This is a "Dumb" component. It only knows how to render UI based on props.
interface UpdatePasswordFormProps {
  form: ReturnType<typeof useForm<UpdatePasswordFormData>>;
  onSubmit: (values: UpdatePasswordFormData) => void;
  isLoading: boolean;
  error: string | null;
}

export default function UpdatePasswordForm({ form, onSubmit, isLoading, error }: UpdatePasswordFormProps) {
  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Set New Password</CardTitle>
        <CardDescription>
          You have been securely signed in. Please set a new password to continue.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
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
              {isLoading ? 'Saving...' : 'Set New Password'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}