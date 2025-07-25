// src/components/dashboard/DashboardHeader.tsx
"use client";

import React from 'react';
import Link from 'next/link';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import UserNav from '@/components/layout/Header/UserNav';
import { usePathname } from 'next/navigation'; // Import for mobile nav active state
import { cn } from '@/lib/utils';
import type { User } from '@supabase/supabase-js';
import type { UserRole, UserProfile } from '@/types';
import { LayoutDashboard, ListChecks, PlusCircle, FileText, ShieldCheck } from 'lucide-react';

// A helper function for nav links, can be co-located or imported
const getNavLinksForRole = (role?: UserRole) => {
  switch (role) {
    case 'JOB_SEEKER':
      return [
        { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
        { href: "/dashboard/seeker/applications", label: "My Applications", icon: FileText },
      ];
    case 'EMPLOYER':
      return [
        { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
        { href: "/dashboard/my-jobs", label: "My Jobs", icon: ListChecks },
        { href: "/dashboard/post-job", label: "Post a New Job", icon: PlusCircle },
      ];
    case 'ADMIN':
      return [
        { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
        { href: "/dashboard/admin/pending-approvals", label: "Pending Jobs", icon: ShieldCheck },
      ];
    default:
      return [];
  }
};


// The navigation component for the mobile sheet menu
function MobileSidebarNav({ role }: { role?: UserRole }) {
  const pathname = usePathname();
  const availableLinks = getNavLinksForRole(role);

  return (
    <nav className="grid gap-2 text-lg font-medium">
      <Link href="/" className="flex items-center gap-2 text-lg font-semibold mb-4 border-b pb-4">
        CareerCrew
      </Link>
      {availableLinks.map((link) => {
        const isActive = link.href === '/dashboard' ? pathname === link.href : pathname.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground",
              isActive && "bg-muted text-foreground"
            )}
          >
            <link.icon className="h-5 w-5" />
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}

// The main header component, receives props from the server layout
interface DashboardHeaderProps {
  user: User;
  profile: UserProfile | null;
}

export default function DashboardHeader({ user, profile }: DashboardHeaderProps) {
  return (
    <header className="flex h-14 items-center gap-4 border-b bg-background px-4 lg:h-[60px] lg:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col">
          <MobileSidebarNav role={profile?.role} />
        </SheetContent>
      </Sheet>

      <div className="w-full flex-1">
        {/* Future elements like breadcrumbs or a search bar can go here */}
      </div>

      <UserNav user={user} profile={profile} />
    </header>
  );
}