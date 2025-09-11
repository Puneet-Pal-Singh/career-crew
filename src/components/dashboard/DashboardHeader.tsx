// src/components/dashboard/DashboardHeader.tsx
"use client";

import React from 'react';
import Link from 'next/link';
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription, SheetHeader } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import UserNav from '@/components/layout/Header/UserNav';
import { usePathname } from 'next/navigation'; // Import for mobile nav active state
import { cn } from '@/lib/utils';
import type { User } from '@supabase/supabase-js';
import type { UserProfile } from '@/types';
import { getNavLinksForRole } from '@/lib/dashboardNavLinks';

interface MobileSidebarNavProps {
  role?: UserProfile['role'];
  onLinkClick: () => void;
}

// The navigation component for the mobile sheet menu
function MobileSidebarNav({ role, onLinkClick }: MobileSidebarNavProps){
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
            onClick={onLinkClick}
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
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (isOpen: boolean) => void;
  isSideBarCollapsed: boolean;
}

export default function DashboardHeader({ user, profile, isMobileMenuOpen, setIsMobileMenuOpen, isSideBarCollapsed }: DashboardHeaderProps){
  return (
    <header className={cn(
      "fixed top-0 right-0 z-20 flex h-14 items-center gap-4 border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60 lg:h-[60px] lg:px-6 transition-all duration-300 ease-in-out",
      // Use the same dynamic left offset as the layout's padding
      // "left-0 md:left-auto", // Full width on mobile, offset on desktop
      "left-0", // Full width on mobile, offset on desktop
      isSideBarCollapsed 
      ? "md:left-[70px]"  // If collapsed, the header starts 70px from the left
      : "md:left-[220px] lg:left-[280px]" // If expanded, it starts at the sidebar's width
    )}>
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col">
          {/* We keep the header for semantic structure, but the key is associating it with SheetContent */}
          <SheetHeader className="text-left sr-only">
            <SheetTitle>Navigation Menu</SheetTitle>
            <SheetDescription>Main navigation links for the CareerCrew dashboard.</SheetDescription>
          </SheetHeader>
          {/* The props below are what actually fix the console warning */}
          <div aria-describedby={undefined} />
          <MobileSidebarNav role={profile?.role} onLinkClick={() => setIsMobileMenuOpen(false)} />
        </SheetContent>
      </Sheet>

      <div className="w-full flex-1">
        {/* Future elements like breadcrumbs or a search bar can go here */}
      </div>

      <UserNav user={user} profile={profile} />
    </header>
  );
}