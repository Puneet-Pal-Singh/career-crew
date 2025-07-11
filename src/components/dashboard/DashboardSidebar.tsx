// src/components/dashboard/DashboardSidebar.tsx
"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import type { UserRole } from '@/types';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { LayoutDashboard, ListChecks, PlusCircle, FileText, ShieldCheck, Briefcase, PanelLeft, PanelRight } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

// Define the structure for a dashboard navigation link
export interface DashboardNavLink {
  href: string;
  label: string;
  icon: React.ElementType;
}

// A pure function to get nav links based on a role
const getNavLinksForRole = (role?: UserRole): DashboardNavLink[] => {
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
      return []; // Return empty for unknown or loading roles
  }
};

// The navigation component, refactored for clarity
function DashboardSidebarNav({ isCollapsed, role }: { isCollapsed: boolean, role?: UserRole }) {
  const pathname = usePathname();
  const availableLinks = getNavLinksForRole(role);

  if (!role) {
    return (
      <div className="space-y-2 px-2">
        <Skeleton className="h-10 w-full rounded-lg" />
        <Skeleton className="h-10 w-full rounded-lg" />
      </div>
    );
  }

  return (
    <TooltipProvider>
      {availableLinks.map((link) => {
        const isActive = link.href === '/dashboard' ? pathname === link.href : pathname.startsWith(link.href);
        return (
          <Tooltip key={link.href} delayDuration={100}>
            <TooltipTrigger asChild>
              <Link
                href={link.href}
                className={cn(
                  "flex items-center gap-4 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                  isActive && "bg-muted text-primary font-semibold",
                  isCollapsed && "justify-center"
                )}
              >
                <link.icon className="h-5 w-5 flex-shrink-0" />
                <span className={cn("truncate", isCollapsed && "hidden")}>{link.label}</span>
              </Link>
            </TooltipTrigger>
            {isCollapsed && (
              <TooltipContent side="right" className="flex items-center gap-4">
                {link.label}
              </TooltipContent>
            )}
          </Tooltip>
        );
      })}
    </TooltipProvider>
  );
}

// FIX: This component now receives state and a setter function as props.
interface DashboardSidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (isCollapsed: boolean) => void;
  role?: UserRole;
}

// The main sidebar component, now a Client Component managing its own state.
export default function DashboardSidebar({ isCollapsed, setIsCollapsed, role }: DashboardSidebarProps) {
  return (
    <div className="flex h-full max-h-screen flex-col">
     <div className="flex h-14 items-center px-4 lg:h-[60px] lg:px-6">
        <Link href="/" className={cn("flex items-center gap-2 font-semibold", isCollapsed && "justify-center")}>
          <Briefcase className="h-6 w-6 text-primary flex-shrink-0" />
          <span className={cn("font-display text-xl font-bold", isCollapsed && "hidden")}>CareerCrew</span>
        </Link>
      </div>
      
      <nav className="flex-1 overflow-auto py-4 px-2">
        <div className="grid gap-1 text-sm font-medium">
          <DashboardSidebarNav isCollapsed={isCollapsed} role={role} />
        </div>
      </nav>
      
      <div className="mt-auto border-t p-2">
        <Button variant="outline" size="icon" className="w-full" onClick={() => setIsCollapsed(!isCollapsed)}>
          {isCollapsed ? <PanelRight className="h-5 w-5" /> : <PanelLeft className="h-5 w-5" />}
          <span className="sr-only">Toggle Sidebar</span>
        </Button>
      </div>
    </div>
  );
}