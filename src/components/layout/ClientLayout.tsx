// src/components/layout/ClientLayout.tsx
"use client";

import { usePathname } from 'next/navigation';
import Header from './Header';
import Footer from './Footer';
import type { User } from '@supabase/supabase-js';

// FIX: Define props to accept the user object from the server layout
interface ClientLayoutProps {
  children: React.ReactNode;
  user: User | null;
}

// This component intelligently wraps children with a header and footer
// ONLY on pages outside of the dashboard.
// Accept the user object as a prop from the server layout
export default function ClientLayout({ children, user }: ClientLayoutProps) {
  const pathname = usePathname();
  const isDashboardRoute = pathname.startsWith('/dashboard');

  if (isDashboardRoute) {
    return <>{children}</>;
  }

  return (
    <>
      {/* FIX: Pass the user prop down to the Header */}
      <Header user={user} />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </>
  );
}