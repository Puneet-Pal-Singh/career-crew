// src/components/layout/ClientLayout.tsx
"use client"; // This directive is essential for using client-side hooks like usePathname

import { usePathname } from "next/navigation";
import Header from "./Header"; // Imports the main public-facing header
import Footer from "./Footer"; // Imports the main public-facing footer
import React from "react";

/**
 * ClientLayout is a client-side component responsible for wrapping the main page content (`children`).
 * Its primary purpose is to use client hooks like `usePathname` to determine the current route
 * and conditionally render the appropriate layout structure (e.g., public vs. dashboard).
 *
 * This pattern allows the root layout (`src/app/layout.tsx`) to remain a Server Component,
 * while delegating route-aware layout logic to this client component.
 */
export default function ClientLayout({ children }: { children: React.ReactNode }) {
  // usePathname() hook gets the current URL's path
  const pathname = usePathname();
  
  // Check if the current route is part of the dashboard
  const isDashboardRoute = pathname.startsWith('/dashboard');

  // If it's a dashboard route, we render *only* the children.
  // The dashboard-specific layout (with its own header and sidebar) is handled by
  // `src/app/dashboard/layout.tsx`, which will wrap the dashboard pages automatically.
  if (isDashboardRoute) {
    return <>{children}</>;
  }

  // If it's a public route (e.g., landing page, /jobs), wrap the children
  // with the public-facing Header and Footer.
  return (
    <>
      <Header />
      
      {/* 
        This top padding on the <main> element is crucial. 
        It must match the height of the fixed <Header> component to prevent
        page content from being hidden underneath it.
        Our header height is h-20 (5rem = 80px), so we use pt-20.
      */}
      <main className="flex-grow pt-20">
         {children}
      </main>

      <Footer />
    </>
  );
}