// src/components/layout/ClientLayout.tsx
"use client";

import { usePathname } from 'next/navigation';
import Header from './Header';
import Footer from './Footer';
import type { User } from '@supabase/supabase-js';

interface ClientLayoutProps {
  children: React.ReactNode;
  user: User | null;
}

export default function ClientLayout({ children, user }: ClientLayoutProps) {
  const pathname = usePathname();

  // Define routes that should NOT have the public header/footer ---
  const noLayoutRoutes = [
    '/login',
    '/jobs/signup',
    '/employer/signup',
    '/onboarding/complete-profile',
    '/auth/auth-code-error',
    '/forgot-password',
    '/update-password'
  ];

  const isDashboardRoute = pathname.startsWith('/dashboard');
  const isAuthRoute = noLayoutRoutes.includes(pathname);

  // If the route is a dashboard or a specified no-layout route,
  // render the children directly without the public Header and Footer.
  if (isDashboardRoute || isAuthRoute) {
    return <>{children}</>;
  }

  // For all other pages (e.g., '/', '/jobs'), render with the full public layout.
  return (
    <>
      <Header user={user} />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </>
  );
}