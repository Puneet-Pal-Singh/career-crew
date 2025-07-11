// src/components/layout/Header.tsx
"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { User } from '@supabase/supabase-js';
import UserNav from './Header/UserNav';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { cn } from '@/lib/utils';
import ThemeToggleButton from '@/components/theme/ThemeToggleButton';
import { useUserProfile } from '@/contexts/UserProfileContext';
import { Menu, X, ChevronDown } from 'lucide-react';

interface HeaderProps {
  user: User | null;
}

export default function Header({ user }: HeaderProps) {
  const pathname = usePathname();
  const { userProfile } = useUserProfile();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isLandingPage = pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    // Always add scroll listener for consistent behavior
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Set initial state based on page type
    if (!isLandingPage) {
      setIsScrolled(true);
    }
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isLandingPage]);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      if (isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isMobileMenuOpen]);

  const headerClasses = cn(
    "sticky top-0 z-50 w-full transition-all duration-500 ease-out",
    {
      // TRANSLUCENT CUSTOMIZATION SECTION: Adjust backdrop blur and background opacity here
      "border-b border-border/40 bg-background/80 backdrop-blur-md shadow-lg": isScrolled,
      // Alternative translucent options:
      // "bg-background/70 backdrop-blur-sm": isScrolled, // Less translucent
      // "bg-background/90 backdrop-blur-lg": isScrolled, // More opaque
      // "bg-background/60 backdrop-blur-xl": isScrolled, // Very translucent
      "border-transparent bg-transparent": !isScrolled,
    }
  );

  const logoClasses = cn(
    "font-bold text-xl transition-all duration-300 text-slate-800 hover:text-slate-900"
  );

  const navLinkClasses = "relative text-sm font-medium transition-all duration-300 text-slate-700 hover:text-slate-900 group";
  const navLinkUnderline = "absolute -bottom-1 left-0 w-0 h-0.5 bg-slate-800 transition-all duration-300 group-hover:w-full";

  return (
    <header className={headerClasses}>
      {/* Enhanced Container with better responsive design */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Left Section: Logo with enhanced styling */}
          <div className="flex-shrink-0">
            <Link href="/" className={logoClasses}>
              CareerCrew
            </Link>
          </div>

          {/* Center Section: Navigation - NOW PROPERLY CENTERED */}
          <nav className="hidden lg:flex items-center justify-center flex-1 px-4 xl:px-8">
            <div className="flex items-center space-x-6 xl:space-x-8">
              <Link href="/jobs" className={navLinkClasses}>
                Jobs
                <span className={navLinkUnderline}></span>
              </Link>
              <Link href="/#features-for-seekers" className={navLinkClasses}>
                For Job Seekers
                <span className={navLinkUnderline}></span>
              </Link>
              <Link href="/#features-for-companies" className={navLinkClasses}>
                For Companies
                <span className={navLinkUnderline}></span>
              </Link>
            </div>
          </nav>
          
          {/* Right Section: Auth controls with enhanced styling */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="hidden sm:block">
              <ThemeToggleButton />
            </div>
            {user ? (
              <UserNav user={user} profile={userProfile} />
            ) : (
              <>
                <Button 
                  variant="ghost" 
                  asChild 
                  className="hidden sm:inline-flex text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-all duration-300"
                >
                  <Link href="/login">Log In</Link>
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button className="bg-primary hover:bg-primary/90 transition-all duration-300 shadow-lg hover:shadow-xl text-sm sm:text-base">
                      Sign Up
                      <ChevronDown className="ml-1 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent 
                    align="end" 
                    className="w-56 sm:w-64 mt-2 bg-background/95 backdrop-blur-sm border border-border/50 shadow-xl"
                  >
                    <DropdownMenuItem asChild>
                      <Link href="/signup/job-seeker" className="cursor-pointer flex items-center px-4 py-3 hover:bg-primary/10 transition-colors">
                        <div className="flex flex-col">
                          <span className="font-medium">I&apos;m looking for a job</span>
                          <span className="text-xs text-muted-foreground">Find your dream position</span>
                        </div>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/signup/employer" className="cursor-pointer flex items-center px-4 py-3 hover:bg-primary/10 transition-colors">
                        <div className="flex flex-col">
                          <span className="font-medium">I&apos;m looking for candidates</span>
                          <span className="text-xs text-muted-foreground">Build your dream team</span>
                        </div>
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden text-slate-700 hover:text-slate-900 hover:bg-slate-100 p-2"
              onClick={(e) => {
                e.stopPropagation();
                setIsMobileMenuOpen(!isMobileMenuOpen);
              }}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Enhanced Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 bg-white/98 backdrop-blur-sm shadow-lg">
            <div className="px-4 pt-4 pb-6 space-y-3">
              {/* Mobile Navigation Links */}
              <div className="space-y-2">
                <Link
                  href="/jobs"
                  className="block px-4 py-3 text-base font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Jobs
                </Link>
                <Link
                  href="/#features-for-seekers"
                  className="block px-4 py-3 text-base font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  For Job Seekers
                </Link>
                <Link
                  href="/#features-for-companies"
                  className="block px-4 py-3 text-base font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  For Companies
                </Link>
              </div>

              {/* Mobile Auth Section */}
              {!user && (
                <div className="pt-4 border-t border-slate-200 space-y-3">
                  <Button 
                    variant="ghost" 
                    asChild 
                    className="w-full justify-center text-slate-700 hover:text-slate-900 hover:bg-slate-100 h-11 text-base"
                  >
                    <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                      Log In
                    </Link>
                  </Button>
                  <div className="space-y-2">
                    <Button 
                      asChild 
                      className="w-full justify-center bg-primary hover:bg-primary/90 h-11 text-base shadow-md"
                    >
                      <Link href="/signup/job-seeker" onClick={() => setIsMobileMenuOpen(false)}>
                        I&apso;m looking for a job
                      </Link>
                    </Button>
                    <Button 
                      asChild 
                      variant="outline"
                      className="w-full justify-center border-primary text-primary hover:bg-primary/10 h-11 text-base"
                    >
                      <Link href="/signup/employer" onClick={() => setIsMobileMenuOpen(false)}>
                        I&apos;m looking for candidates
                      </Link>
                    </Button>
                  </div>
                </div>
              )}

              {/* Mobile Theme Toggle */}
              <div className="pt-4 border-t border-slate-200 flex justify-center">
                <ThemeToggleButton />
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}