// src/lib/middleware/middlewareHandlers.ts
import { NextResponse, type NextRequest } from 'next/server';
import type { UserRole } from '@/types';
import type { User } from './middleware.types';
import {
  publicOnlyRoutes,
  onboardingRoute,
  protectedRoutePrefixes,
  specialHandlingRoutes,
  employerRoutePrefixes,
  seekerRoutePrefixes,
  adminRoutePrefixes,
} from './routeMatchers';
import { isValidInternalPath } from '@/lib/utils'; 

/**
 * SRP: Handles all routing logic for an authenticated user.
 * It checks for special routes, public-only redirects, onboarding status, and RBAC.
 * Returns a NextResponse for redirection, or null to continue.
 */
export function handleAuthenticatedUser(
  request: NextRequest,
  user: User
): NextResponse | null {
  const { pathname } = request.nextUrl;

  if (specialHandlingRoutes.includes(pathname)) {
    return null; // Do not interfere with special pages.
  }

  if (publicOnlyRoutes.includes(pathname) || pathname === '/') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  const needsOnboarding = user.app_metadata?.onboarding_complete === false;
  if (needsOnboarding && pathname !== onboardingRoute) {
    return NextResponse.redirect(new URL(onboardingRoute, request.url));
  }
  if (!needsOnboarding && pathname === onboardingRoute) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Handle Role-Based Access Control (RBAC)
  const userRole = user.app_metadata?.role as UserRole;
  const isEmployerRoute = employerRoutePrefixes.some(r => pathname.startsWith(r));
  const isSeekerRoute = seekerRoutePrefixes.some(r => pathname.startsWith(r));
  const isAdminRoute = adminRoutePrefixes.some(r => pathname.startsWith(r));
  
  if (userRole === 'JOB_SEEKER' && isEmployerRoute) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  if (userRole === 'EMPLOYER' && isSeekerRoute) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  if (userRole !== 'ADMIN' && isAdminRoute) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return null; // All checks passed, continue to the requested page.
}

/**
 * SRP: Handles all routing logic for an unauthenticated user.
 * It protects dashboard routes and allows access to all other routes.
 * Returns a NextResponse for redirection, or null to continue.
 */
export function handleUnauthenticatedUser(
  request: NextRequest
): NextResponse | null {
  const { pathname, searchParams } = request.nextUrl;

  if (protectedRoutePrefixes.some(r => pathname.startsWith(r))) {
    const redirectUrl = new URL('/login', request.url);
    redirectUrl.searchParams.set('redirectTo', pathname);

    // THE FIX: Validate the redirectTo parameter before using it.
    const redirectTo = searchParams.get('redirectTo');
    if (isValidInternalPath(redirectTo)) {
      redirectUrl.searchParams.set('redirectTo', redirectTo);
    }

    return NextResponse.redirect(redirectUrl);
  }

  return null; // Allow access to public pages.
}