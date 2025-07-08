// src/app/dashboard/DashboardPageClient.tsx
"use client";

import React from 'react';
// import RoleSelection from '@/components/dashboard/RoleSelection';
import { Loader2 } from 'lucide-react';

// This is the shape of the profile data passed from the server
interface ProfileData {
  role: string | null;
  has_made_role_choice: boolean;
}

interface DashboardPageClientProps {
  children: React.ReactNode; // This is where the rendered Server Component will go
  serverProfile: ProfileData | null;
}

function DashboardContentLoading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
      <Loader2 className="h-12 w-12 animate-spin text-primary" />
      <p className="mt-4 text-lg text-muted-foreground">Loading Your Dashboard...</p>
    </div>
  );
}

// This component is now MUCH simpler.
export default function DashboardPageClient({ children, serverProfile }: DashboardPageClientProps) {
  // We no longer need client-side hooks to fetch the profile!

  // --- Render Logic ---

  // 1. If profile data isn't available yet (e.g., initial load), show a spinner.
  if (!serverProfile) {
    return <DashboardContentLoading />;
  }

  // 2. If the user hasn't chosen a role, show the selection screen.
  // This remains a client-side responsibility.
  // if (!serverProfile.has_made_role_choice) {
  //   return <RoleSelection />;
  // }
  
  // 3. If a role has been chosen, `children` will contain the correct
  //    dashboard view, already rendered on the server. We just display it.
  if (serverProfile.role) {
    return <>{children}</>;
  }
  
  // 4. Fallback for any other case.
  return <DashboardContentLoading />;
}