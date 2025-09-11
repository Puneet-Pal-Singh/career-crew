// src/components/dashboard/DashboardSidebar.tsx
"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import type { UserRole } from '@/types';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Briefcase, PanelLeft, PanelRight } from 'lucide-react';
import { getNavLinksForRole } from '@/lib/dashboardNavLinks';
import { Skeleton } from '@/components/ui/skeleton';

function DashboardSidebarNav({ isCollapsed, role }: { isCollapsed: boolean, role?: UserRole }) {
  const pathname = usePathname();
  const availableLinks = getNavLinksForRole(role);

  if (!role) {
    return (
      <div className="space-y-1 px-3">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
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
                  // Fixed: Better padding and spacing for consistent appearance
                  "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground w-full",
                  isActive && "bg-accent text-accent-foreground",
                  isCollapsed && "justify-center px-3 py-3"
                )}
              >
                <link.icon className="h-5 w-5 flex-shrink-0" />
                <span className={cn("truncate", isCollapsed && "hidden")}>{link.label}</span>
              </Link>
            </TooltipTrigger>
            {isCollapsed && (
              <TooltipContent side="right">{link.label}</TooltipContent>
            )}
          </Tooltip>
        );
      })}
    </TooltipProvider>
  );
}

interface DashboardSidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (isCollapsed: boolean) => void;
  role?: UserRole;
}

export default function DashboardSidebar({ isCollapsed, setIsCollapsed, role }: DashboardSidebarProps) {
  return (
    <div className="flex h-full max-h-screen flex-col w-full">
      <div className="flex h-14 items-center px-4 lg:h-[60px] lg:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Briefcase className="h-6 w-6 text-primary flex-shrink-0" />
          <span className={cn("font-display text-xl font-bold", isCollapsed && "hidden")}>CareerCrew</span>
        </Link>
      </div>
      
      <nav className="flex-1 space-y-1 overflow-auto py-4 px-3">
        <DashboardSidebarNav isCollapsed={isCollapsed} role={role} />
      </nav>
      
      <div className="mt-auto border-t p-3">
        <Button 
          variant="outline" 
          size="icon" 
          className="w-full" 
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? <PanelRight className="h-5 w-5" /> : <PanelLeft className="h-5 w-5" />}
          <span className="sr-only">Toggle Sidebar</span>
        </Button>
      </div>
    </div>
  );
}