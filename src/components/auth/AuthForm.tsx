// src/components/auth/AuthForm.tsx
"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import type { UserRole } from '@/types';
import { useRouter } from 'next/navigation';
import { loginUserAction } from '@/app/actions/auth/loginUserAction';
import { registerUserAction } from '@/app/actions/auth/registerUserAction';

type AuthFormProps = { mode: 'login' } | { mode: 'register', role: UserRole };

const formSchema = z.object({
  fullName: z.string().optional(),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

type FormValues = z.infer<typeof formSchema>;

export default function AuthForm(props: AuthFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { fullName: '', email: '', password: '' },
  });

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    setError(null);
    let result;

    if (props.mode === 'register') {
      if (!values.fullName || values.fullName.trim().length < 2) {
        form.setError("fullName", { type: "manual", message: "Full name is required." });
        setIsLoading(false);
        return;
      }
      result = await registerUserAction({ ...values, fullName: values.fullName, role: props.role });
    } else {
      result = await loginUserAction({ email: values.email, password: values.password });
    }

    if (result.success) {
      router.push('/dashboard'); // On success, always go to dashboard
    } else {
      setError(result.error?.message || "An unexpected error occurred.");
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">{props.mode === 'register' ? 'Create Account' : 'Log In'}</CardTitle>
      </CardHeader>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          {props.mode === 'register' && (
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input id="fullName" {...form.register('fullName')} disabled={isLoading} />
              {form.formState.errors.fullName && <p className="text-sm text-destructive">{form.formState.errors.fullName.message}</p>}
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="email">{props.mode === 'register' && props.role === 'EMPLOYER' ? 'Work Email' : 'Email'}</Label>
            <Input id="email" type="email" {...form.register('email')} disabled={isLoading} />
            {form.formState.errors.email && <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" {...form.register('password')} disabled={isLoading} />
            {form.formState.errors.password && <p className="text-sm text-destructive">{form.formState.errors.password.message}</p>}
          </div>
          {error && <p className="text-sm font-medium text-destructive text-center">{error}</p>}
        </CardContent>
        <CardFooter>
          <div className="w-full flex flex-col gap-4">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {props.mode === 'register' ? 'Create Account' : 'Log In'}
            </Button>
            <p className="text-sm text-muted-foreground text-center">
              {props.mode === 'register' ? 'Already have an account?' : "Don't have an account?"}
              {/* FIX: Login page now correctly links to the seeker signup page. */}
              <Link href={props.mode === 'register' ? '/login' : '/signup/job-seeker'} className="ml-1 font-semibold text-primary hover:underline">
                {props.mode === 'register' ? 'Log In' : 'Create an Account'}
              </Link>
            </p>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}