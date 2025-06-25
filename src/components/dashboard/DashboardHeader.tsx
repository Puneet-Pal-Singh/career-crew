// src/components/dashboard/DashboardHeader.tsx
"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from '@/components/ui/button';
import { PanelLeft, Briefcase } from 'lucide-react';
import UserNav from '@/components/layout/Header/UserNav'; // Re-use the UserNav component
import { DashboardSidebarNav } from './DashboardSidebar'; // Import the nav links component

/**
 * The header component specifically for the dashboard layout.
 * It is NOT fixed/sticky globally, but is part of the dashboard's own layout.
 * It includes the mobile navigation trigger (Sheet) and the user profile menu.
 */
export default function DashboardHeader() {
  const pathname = usePathname();
  // Example of how to get a dynamic page title for the header
  const getPageTitle = () => {
    if (pathname === '/dashboard') return 'Overview';
    if (pathname.startsWith('/dashboard/my-jobs')) return 'My Job Postings';
    if (pathname.startsWith('/dashboard/post-job')) return 'Post a New Job';
    if (pathname.startsWith('/dashboard/job-listings')) return 'My Job Listings'; // Added
    if (pathname.startsWith('/dashboard/admin/pending-approvals')) return 'Pending Approvals';
    if (pathname.startsWith('/dashboard/seeker/applications')) return 'My Applications';
    return 'Dashboard';
  };

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
      
      {/* Mobile Sidebar Navigation using a Sheet component */}
      <Sheet>
        <SheetTrigger asChild>
          <Button size="icon" variant="outline" className="sm:hidden">
            <PanelLeft className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="sm:max-w-xs">
          <nav className="grid gap-6 text-lg font-medium">
            <Link
              href="/"
              className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
            >
              <Briefcase className="h-5 w-5 transition-all group-hover:scale-110" />
              <span className="sr-only">CareerCrew</span>
            </Link>
            {/* Render the navigation links inside the mobile sheet */}
            <DashboardSidebarNav />
          </nav>
        </SheetContent>
      </Sheet>

      {/* Page Title / Breadcrumbs for Desktop */}
      <div className="hidden md:flex">
        <h1 className="text-xl font-semibold">{getPageTitle()}</h1>
      </div>

      {/* Right-aligned items */}
      <div className="relative ml-auto flex-1 md:grow-0">
        {/* A dashboard-specific search bar could be added here later */}
      </div>

      {/* User profile button and dropdown */}
      <UserNav />
    </header>
  );
}