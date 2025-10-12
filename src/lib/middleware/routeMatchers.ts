// src/lib/middleware/routeMatchers.ts

/**
 * Route Configuration for the Middleware.
 * This file centralizes all route definitions for easier management.
 */

// Core authentication routes that a normally logged-in user should NOT be able to access.
export const publicOnlyRoutes = [
  '/login', 
  '/jobs/signup', 
  '/employer/signup',
  '/forgot-password'
];

// The mandatory onboarding route for new users.
export const onboardingRoute = '/onboarding/complete-profile';

// Routes that are protected and require a user to be logged in.
// We use a prefix here to protect all sub-routes under /dashboard.
export const protectedRoutePrefixes = ['/dashboard'];

// Routes that have special client-side logic and should be ignored by the middleware's
// general redirection rules. The components on these pages are responsible for their own auth.
export const specialHandlingRoutes = ['/update-password'];

// Role-specific route prefixes for Role-Based Access Control (RBAC).
export const employerRoutePrefixes = ['/dashboard/post-job', '/dashboard/my-jobs', '/dashboard/applications'];
export const seekerRoutePrefixes = ['/dashboard/seeker/applications'];
export const adminRoutePrefixes = ['/dashboard/admin'];
