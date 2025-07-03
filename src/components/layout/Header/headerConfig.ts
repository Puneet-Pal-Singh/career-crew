// src/components/layout/Header/headerConfig.ts

/**
 * Defines the structure for a navigation link item.
 */
export interface NavLink {
  href: string;
  label: string;
}

/**
 * Navigation links shown in the header for all logged-out (public) users.
 */
export const publicHeaderNavLinks: NavLink[] = [
  { href: '/jobs', label: 'Browse Jobs' },
  { href: '/#for-job-seekers', label: 'For Job Seekers' },
  { href: '/#for-employers', label: 'For Employers' },
  // { href: '/about', label: 'About Us' }, // Can be uncommented later
];

/**
 * Navigation links for ANY authenticated user when they are viewing PUBLIC pages.
 * Once they are on a /dashboard route, this header is not shown.
 * This keeps the header simple and provides a consistent way back to the dashboard.
 */
export const authenticatedHeaderNavLinks: NavLink[] = [
  { href: '/jobs', label: 'Browse Jobs' },
  { href: '/dashboard', label: 'Dashboard' },
];