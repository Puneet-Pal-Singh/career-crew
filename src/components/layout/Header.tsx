// src/components/layout/Header.tsx
'use client'; // May need client interactivity later for auth state, theme toggle

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import ThemeToggleButton from '@/components/theme/ThemeToggleButton'; // We'll create this later

// Define a type for navigation links if you want more structure
interface NavLink {
  href: string;
  label: string;
}

const navLinks: NavLink[] = [
  { href: '/jobs', label: 'Browse Jobs' },
  // { href: '/post-a-job', label: 'Post a Job' }, // Conditional later
  // { href: '/dashboard', label: 'Dashboard' }, // Conditional later
];

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-700 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold font-display text-primary">
            CareerCrew
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8 items-center">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  pathname === link.href
                    ? 'text-primary dark:text-primary'
                    : 'text-content-light dark:text-content-dark hover:text-subtle-light dark:hover:text-subtle-dark'
                }`}
              >
                {link.label}
              </Link>
            ))}
            {/* Placeholder for conditional links */}
            <Link
              href="/login"
              className="text-sm font-medium text-content-light dark:text-content-dark hover:text-primary"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="text-sm font-medium px-4 py-2 border border-primary text-primary rounded-md hover:bg-primary hover:text-background-dark transition-colors"
            >
              Sign Up
            </Link>
            <ThemeToggleButton />
          </nav>

          {/* Mobile Menu Button (placeholder for future implementation) */}
          <div className="md:hidden">
            <ThemeToggleButton />
            <button className="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:text-primary">
              <span className="sr-only">Open menu</span>
              {/* Icon for menu - e.g., Hamburger icon */}
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}