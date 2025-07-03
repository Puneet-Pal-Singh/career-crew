// src/app/login/page.tsx
import AuthForm from "@/components/auth/AuthForm"; // Adjust path if AuthForm is elsewhere
import { Suspense } from "react";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Login - CareerCrew Consulting',
  description: 'Log in to your CareerCrew Consulting account.',
};

// A simple component to show a message based on query params, e.g., after signup
// We can enhance this later.
function AuthMessages() {
  // This component needs to be a Client Component to read searchParams
  // For now, we'll keep page.tsx as Server Component and handle messages differently if needed
  // Or make the page a client component if dynamic messages are critical here.
  // For simplicity, this example doesn't read searchParams directly here.
  return null;
}


export default function LoginPage() {
  return (
    <div className="flex min-h-[calc(100vh-var(--header-height,80px)-var(--footer-height,80px))] flex-col items-center justify-center bg-gradient-to-br from-background via-background-light to-surface-light dark:from-background dark:via-background-dark dark:to-surface-dark px-4 py-12 sm:px-6 lg:px-8">
      {/* 
        Header and Footer height variables would need to be defined in globals.css 
        if you want to use them for precise min-height calculation.
        Example: :root { --header-height: 80px; --footer-height: 80px; }
        For now, a simpler min-h-screen or flex-grow on main content in layout is common.
        The min-h calculation provided is illustrative.
      */}
      <Suspense fallback={<div>Loading...</div>}> {/* Suspense for potential server-side data fetching in children later */}
        <AuthMessages />
      </Suspense>
      <AuthForm mode="login" />
    </div>
  );
}