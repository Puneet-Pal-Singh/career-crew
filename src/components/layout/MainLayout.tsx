// src/components/layout/MainLayout.tsx
"use client";

import React from 'react';
import type { User } from '@supabase/supabase-js';
import { AppProviders } from '@/components/providers/AppProviders';
import ClientLayout from '@/components/layout/ClientLayout';
import { Toaster } from "@/components/ui/toaster";
import type { UserRole } from '@/types';
// Import the PostHogProvider
import { PostHogProvider } from '@/components/providers/PostHogProvider';

interface MainLayoutProps {
  children: React.ReactNode;
  user: User | null;
  userRole: UserRole | null;
}

/**
 * This component is the main client-side entry point.
 * It wraps the application with all necessary context providers and
 * the ClientLayout, which handles showing/hiding the global header/footer.
 */
export default function MainLayout({ children, user, userRole }: MainLayoutProps) {
  return (
    <AppProviders>
      {/* PostHogProvider now correctly wraps the client-side layout */}
      <PostHogProvider>
        <ClientLayout user={user} userRole={userRole}>
          {children}
        </ClientLayout>
      </PostHogProvider>
      <Toaster />
    </AppProviders>
  );
}