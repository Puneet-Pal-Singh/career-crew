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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="relative min-h-screen w-full bg-background">
      <aside
        className={cn(
          "hidden md:fixed md:left-0 md:top-0 md:flex h-full border-r bg-card z-30 transition-all duration-300 ease-in-out",
          isCollapsed ? "w-[70px]" : "w-[220px] lg:w-[280px]"
        )}
      >
        <DashboardSidebar 
          isCollapsed={isCollapsed} 
          setIsCollapsed={setIsCollapsed}
          role={profile?.role}
        />
      </aside>
      
      <div
        className={cn(
          "flex flex-col min-h-screen",
          "transition-all duration-300 ease-in-out",
          isCollapsed 
            ? "md:pl-[70px]" 
            : "md:pl-[220px] lg:pl-[280px]"
        )}
      >
        <DashboardHeader 
          user={user} 
          profile={profile}
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
          isSideBarCollapsed={isCollapsed} 
        />

        <main className="flex-1 p-4 pt-20 md:p-6 lg:p-8 lg:pt-24">
          {children}
        </main>
      </div>
    </div>
  );
}