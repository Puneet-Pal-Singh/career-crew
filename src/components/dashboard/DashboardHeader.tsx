// src/components/dashboard/DashboardHeader.tsx
"use client";

import React from 'react';
import Link from 'next/link';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu, PlusCircle } from 'lucide-react';
import UserNav from '@/components/layout/Header/UserNav';
// FIX: We need the full DashboardSidebarNav component here.
import { DashboardSidebarNav } from './DashboardSidebar'; 
import type { User } from '@supabase/supabase-js';
import type { UserProfile, UserRole } from '@/types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DashboardHeaderProps {
  user: User;
  profile: UserProfile | null;
}

// A helper to determine quick actions based on role
const getQuickActions = (role?: UserRole) => {
  if (role === 'EMPLOYER') {
    return [{ href: '/dashboard/post-job', label: 'Post a New Job' }];
  }
  if (role === 'JOB_SEEKER') {
    return [{ href: '/jobs', label: 'Browse Open Jobs' }];
  }
  return [];
};

export default function DashboardHeader({ user, profile }: DashboardHeaderProps) {
  const quickActions = getQuickActions(profile?.role);

  return (
    <header className="flex h-14 items-center gap-4 border-b bg-background px-4 lg:h-[60px] lg:px-6">
      {/* Mobile Menu (Sheet) */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col">
          {/* FIX: The mobile sheet menu is now consistent and clean */}
          <nav className="grid gap-2 text-lg font-medium">
            <Link href="/" className="flex items-center gap-2 text-lg font-semibold mb-4 border-b pb-4">
              CareerCrew
            </Link>
           {/* 
              FIX: The mobile navigation now also receives the 'isCollapsed' prop.
              For the mobile sheet menu, it's always expanded, so we pass `isCollapsed={false}`.
            */}
            <DashboardSidebarNav role={profile?.role} isCollapsed={false} />
          </nav>
        </SheetContent>
      </Sheet>

      {/* Main Header Content */}
      <div className="w-full flex-1">
        {/* NEW FEATURE: Quick Actions Dropdown */}
        {quickActions.length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1">
                <PlusCircle className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  Quick Actions
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              {quickActions.map(action => (
                <DropdownMenuItem key={action.href} asChild>
                  <Link href={action.href}>{action.label}</Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {/* User Navigation is always present on the right */}
      <UserNav user={user} profile={profile} />
    </header>
  );
}