// src/components/dashboard/DashboardLayoutClient.tsx
"use client";

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import type { User } from '@supabase/supabase-js';
import type { UserProfile } from '@/types';
import DashboardSidebar from './DashboardSidebar';
import DashboardHeader from './DashboardHeader';

// This component receives server-fetched data and manages client-side state.
interface DashboardLayoutClientProps {
  children: React.ReactNode;
  user: User;
  profile: UserProfile | null;
}

export default function DashboardLayoutClient({ children, user, profile }: DashboardLayoutClientProps) {
  // The state for the sidebar now lives here, in the top-level client layout.
  const [isCollapsed, setIsCollapsed] = useState(false);

  // The grid column definition dynamically changes based on the state.
  // This is the key to making the border move correctly.
  const gridClasses = cn(
    "grid min-h-screen w-full transition-all duration-300 ease-in-out",
    isCollapsed 
      ? "md:grid-cols-[70px_1fr]" 
      : "md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]"
  );

  return (
    <div className={gridClasses}>
      {/* Sidebar Column */}
      <div className="hidden border-r bg-background md:block">
        {/* Pass the state and the function to update it down to the sidebar */}
        <DashboardSidebar 
          isCollapsed={isCollapsed} 
          setIsCollapsed={setIsCollapsed}
          role={profile?.role}
        />
      </div>
      
      {/* Main Content Column */}
      <div className="flex flex-col overflow-hidden">
        {/* The header receives the server-fetched data */}
        <DashboardHeader user={user} profile={profile} />
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}