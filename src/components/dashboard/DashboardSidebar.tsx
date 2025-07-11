// src/components/dashboard/DashboardSidebar.tsx
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import type { UserRole } from '@/types';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  LayoutDashboard, ListChecks, PlusCircle, FileText, ShieldCheck, Briefcase, PanelLeftClose, PanelRightClose
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useState } from 'react';

export interface DashboardNavLink {
  href: string;
  label: string;
  icon: React.ElementType;
}

const getNavLinksForRole = (role?: UserRole): DashboardNavLink[] => {
  // ... (this function remains the same as before)
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

export function DashboardSidebarNav({ role, isCollapsed }: { role?: UserRole, isCollapsed: boolean }) {
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
          <Tooltip key={link.href} delayDuration={0}>
            <TooltipTrigger asChild>
              <Link
                href={link.href}
                className={cn(
                  "flex items-center gap-4 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                  isActive && "bg-muted text-primary font-semibold",
                  isCollapsed ? "justify-center" : ""
                )}
              >
                <link.icon className="h-5 w-5" />
                {/* FIX: The label is now hidden when collapsed */}
                <span className={cn(isCollapsed ? "hidden" : "block")}>{link.label}</span>
              </Link>
            </TooltipTrigger>
            {/* Show tooltip only when collapsed */}
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

export default function DashboardSidebar({ role }: { role?: UserRole }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    // FIX: The parent div no longer has a border. It's on the layout.
    <aside className="flex h-full max-h-screen flex-col gap-2 transition-all duration-300 ease-in-out" 
           style={{ width: isCollapsed ? '70px' : '280px' }}>
      <div className="flex h-16 items-center px-4">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Briefcase className="h-6 w-6 text-primary" />
          {/* Hide text when collapsed */}
          <span className={cn("font-display text-xl font-bold", isCollapsed ? "hidden" : "block")}>CareerCrew</span>
        </Link>
      </div>
      
      {/* Navigation Links */}
      <nav className="flex-1 overflow-auto px-2">
        <div className="grid gap-1 text-sm font-medium">
          <DashboardSidebarNav role={role} isCollapsed={isCollapsed} />
        </div>
      </nav>
      
      {/* NEW FEATURE: Collapse button at the bottom */}
      <div className="mt-auto p-4">
        <Button variant="outline" size="icon" className="w-full" onClick={() => setIsCollapsed(!isCollapsed)}>
          {isCollapsed ? <PanelRightClose className="h-5 w-5" /> : <PanelLeftClose className="h-5 w-s" />}
          <span className="sr-only">Toggle sidebar</span>
        </Button>
      </div>
    </aside>
  );
}