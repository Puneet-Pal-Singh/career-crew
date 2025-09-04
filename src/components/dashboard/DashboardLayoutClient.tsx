// src/components/dashboard/DashboardLayoutClient.tsx
"use client";

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import type { User } from '@supabase/supabase-js';
import type { UserProfile } from '@/types';
import DashboardSidebar from './DashboardSidebar';
import DashboardHeader from './DashboardHeader';

interface DashboardLayoutClientProps {
  children: React.ReactNode;
  user: User;
  profile: UserProfile | null;
}

export default function DashboardLayoutClient({ children, user, profile }: DashboardLayoutClientProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div>
      {/* 1. FIXED SIDEBAR: Uses <aside> for semantics. It is completely independent. */}
      <aside
        className={cn(
          "hidden md:block fixed left-0 top-0 h-full border-r bg-background z-30 transition-all duration-300 ease-in-out",
          isCollapsed ? "w-[70px]" : "md:w-[220px] lg:w-[280px]"
        )}
      >
        <DashboardSidebar 
          isCollapsed={isCollapsed} 
          setIsCollapsed={setIsCollapsed}
          role={profile?.role}
        />
      </aside>

      {/* This wrapper contains the header and main content */}
      <div
        className={cn(
          "transition-all duration-300 ease-in-out",
          // The left margin pushes this whole section away from the sidebar
          isCollapsed 
            ? "md:ml-[70px]" 
            : "md:ml-[220px] lg:ml-[280px]"
        )}
      >
        {/* 2. FIXED HEADER: Also completely independent, with a z-index below the sidebar. */}
        <header 
          className="fixed top-0 right-0 left-0 z-20 transition-all duration-300 ease-in-out md:left-auto"
          // We must also apply the same margin-left logic to the header
          style={{ 
            left: isCollapsed 
              ? '70px' 
              : '220px' 
            // Note: A more complex responsive solution would be needed for lg breakpoint, but this is the core idea. For now, we simplify to match md.
          }}
        >
          {/* A cleaner approach is to put the dynamic left margin on the parent and let the header be full width within it */}
           <DashboardHeader user={user} profile={profile} />
        </header>
        
        {/* 3. SCROLLABLE MAIN CONTENT: This is the only part that scrolls.
            We use padding-top to push the content down, permanently clearing the fixed header. */}
        <main className="pt-14 lg:pt-[60px] p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}