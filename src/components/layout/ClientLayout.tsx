// src/components/layout/ClientLayout.tsx
"use client";

import { usePathname } from 'next/navigation';
import Header from './Header';
import Footer from './Footer';

// This component intelligently wraps children with a header and footer
// ONLY on pages outside of the dashboard.
export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isDashboardRoute = pathname.startsWith('/dashboard');

  if (isDashboardRoute) {
    // For dashboard routes, we don't want the public Header or Footer.
    // The dashboard's own layout will handle its structure.
    return <>{children}</>;
  }

  // For all public-facing pages (homepage, /login, /signup, etc.)
  return (
    <>
      <Header />
      {/* 
        FIX: We apply flex-grow here. This is the main content area that
        needs to expand vertically to fill the space between the Header
        and the Footer, pushing the Footer to the bottom of the viewport.
      */}
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </>
  );
}