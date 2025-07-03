// src/components/auth/AuthForm.tsx
"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import type { UserRole } from '@/types';

// Define the props our new flexible form accepts
interface AuthFormProps {
  mode: 'login' | 'register';
  role: UserRole;
}

// Create dynamic schemas based on the mode.
// For 'register', 'fullName' is required. For 'login', it's not.
const formSchema = (mode: 'login' | 'register') => z.object({
  fullName: z.string().min(1, 'Full name is required').optional().or(z.literal('')),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
}).refine(data => mode === 'register' ? !!data.fullName && data.fullName.trim().length > 0 : true, {
  message: 'Full name is required',
  path: ['fullName'],
});

type FormValues = z.infer<ReturnType<typeof formSchema>>;

export default function AuthForm({ mode, role }: AuthFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isRegisterMode = mode === 'register';
  const roleText = role === 'JOB_SEEKER' ? 'Job Seeker' : 'Employer';

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema(mode)),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    setError(null);
    console.log(`Submitting for ${mode} as ${role}`, values);
    // In Phase 3, we will call our server actions here.
    // For now, we'll just simulate a delay.
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
    // setError("This is a test error message.");
  };

  return (
    <Card className="w-full">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">
          {isRegisterMode ? `Create a ${roleText} Account` : `${roleText} Login`}
        </CardTitle>
        <CardDescription>
          {isRegisterMode ? `Sign up to begin your journey with CareerCrew.` : `Welcome back! Please enter your details.`}
        </CardDescription>
      </CardHeader>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          {isRegisterMode && (
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input id="fullName" {...form.register('fullName')} placeholder="John Doe" disabled={isLoading} />
              {form.formState.errors.fullName && <p className="text-sm text-destructive">{form.formState.errors.fullName.message}</p>}
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" {...form.register('email')} placeholder="you@example.com" disabled={isLoading} />
            {form.formState.errors.email && <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" {...form.register('password')} placeholder="••••••••" disabled={isLoading} />
            {/* FIX: Check if the error object exists before accessing message */}
              {form.formState.errors.fullName && <p className="text-sm text-destructive">{form.formState.errors.fullName.message}</p>}
          </div>
          {error && <p className="text-sm font-medium text-destructive">{error}</p>}
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isRegisterMode ? 'Create Account' : 'Log In'}
          </Button>

          {/* TODO: We'll add Google Auth button here */}
          
          <p className="text-sm text-muted-foreground text-center">
            {isRegisterMode ? "Already have an account?" : "Don't have an account?"}
            <Link href={isRegisterMode ? `/login?as=${role.toLowerCase()}` : `/register?as=${role.toLowerCase()}`} className="ml-1 font-semibold text-primary hover:underline">
              {isRegisterMode ? "Log In" : "Register"}
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}