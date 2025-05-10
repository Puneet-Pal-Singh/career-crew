// src/components/layout/Header.tsx
'use client'; // Needs to be a client component for scroll effects

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react'; // Assuming Menu and X for mobile
// import { useTheme } from 'next-themes';
import ThemeToggleButton from '@/components/theme/ThemeToggleButton'; // Reuse existing

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  // const { theme, setTheme } = useTheme(); // Already in ThemeToggleButton

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20); // Change background after scrolling 20px
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const headerBaseClasses = "fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out";
  const headerScrolledClasses = "bg-surface-light/80 dark:bg-surface-dark/80 backdrop-blur-md shadow-md";
  const headerTopClasses = "bg-transparent";

  const navLinkClasses = "text-sm font-medium text-content-light hover:text-primary dark:text-content-dark dark:hover:text-primary-dark transition-colors px-3 py-2 rounded-md";
  // const navLinkActiveClasses = "text-primary dark:text-primary-dark"; // Add logic for active link later

  return (
    <header className={`${headerBaseClasses} ${isScrolled ? headerScrolledClasses : headerTopClasses}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <span className={`font-display text-2xl font-bold ${isScrolled || mobileMenuOpen ? 'text-content-light dark:text-content-dark' : 'text-content-light dark:text-content-dark'}`}>
              Career<span className={isScrolled || mobileMenuOpen ? "text-primary dark:text-primary-dark" : "text-primary dark:text-primary-dark"}>Crew</span>
            </span>
            {/* Or an <Image /> logo */}
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex md:items-center md:space-x-2 lg:space-x-4">
            <Link href="/jobs" className={navLinkClasses}>Browse Jobs</Link>
            {/* Add conditional links for Employer/Admin Dashboard if logged in */}
            {/* <Link href="/dashboard/employer" className={navLinkClasses}>Post a Job</Link> */}
            {/* <Link href="/login" className={navLinkClasses}>Login</Link> */}
            {/* <Link href="/register" className={`${navLinkClasses} bg-primary text-white dark:bg-primary-dark dark:text-background-dark px-4 py-2 rounded-md hover:bg-primary/90 dark:hover:bg-primary-dark/90`}>Sign Up</Link> */}
             {/* Placeholder for auth links - to be implemented fully later */}
            <Link href="/login" className={navLinkClasses}>Login</Link>
            <Link
              href="/register"
              className="ml-4 inline-flex items-center justify-center rounded-md border border-transparent bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:bg-primary-dark dark:text-background-dark dark:hover:bg-primary-dark/90 dark:focus:ring-offset-background-dark"
            >
              Sign Up
            </Link>
          </nav>

          {/* Theme Toggle */}
          <div className="hidden md:block">
            <ThemeToggleButton />
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <ThemeToggleButton /> {/* Can also be inside mobile menu */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`ml-2 p-2 rounded-md ${isScrolled || mobileMenuOpen ? 'text-content-light dark:text-content-dark' : 'text-content-light dark:text-content-dark'} hover:bg-surface-light/50 dark:hover:bg-surface-dark/50 focus:outline-none`}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className={`md:hidden absolute top-16 left-0 right-0 shadow-lg ${headerScrolledClasses} pb-4`}> {/* Ensure background matches scrolled state */}
          <nav className="flex flex-col space-y-2 px-4 pt-2">
            <Link href="/jobs" className={navLinkClasses} onClick={() => setMobileMenuOpen(false)}>Browse Jobs</Link>
            {/* <Link href="/dashboard/employer" className={navLinkClasses} onClick={() => setMobileMenuOpen(false)}>Post a Job</Link> */}
            <Link href="/login" className={navLinkClasses} onClick={() => setMobileMenuOpen(false)}>Login</Link>
            <Link href="/register" className={`${navLinkClasses} bg-primary text-white dark:bg-primary-dark dark:text-background-dark px-4 py-2 rounded-md hover:bg-primary/90 dark:hover:bg-primary-dark/90 text-center`} onClick={() => setMobileMenuOpen(false)}>Sign Up</Link>
          </nav>
        </div>
      )}
    </header>
  );
}