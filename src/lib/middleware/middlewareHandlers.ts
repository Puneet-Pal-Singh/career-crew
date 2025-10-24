// src/lib/middleware/middlewareHandlers.ts
import { NextResponse, type NextRequest } from 'next/server';
import type { UserRole } from '@/types';
import type { User } from '@/lib/middleware/middleware.types';
import {
  publicOnlyRoutes,
  onboardingRoute,
  protectedRoutePrefixes,
  specialHandlingRoutes,
  employerRoutePrefixes,
  seekerRoutePrefixes,
  adminRoutePrefixes,
} from '@/lib/middleware/routeMatchers';
import { isValidInternalPath } from '@/lib/utils';

// FIX 2: Create a type guard to safely validate the user role.
// This eliminates the unsafe "as UserRole" assertion.
function isValidUserRole(role: unknown): role is UserRole {
  return typeof role === 'string' && ['JOB_SEEKER', 'EMPLOYER', 'ADMIN'].includes(role);
}

/**
 * SRP: Handles all routing logic for an authenticated user.
 */
export function handleAuthenticatedUser(
  request: NextRequest,
  user: User
): NextResponse | null {
  const { pathname } = request.nextUrl;

  if (specialHandlingRoutes.includes(pathname)) {
    return null;
  }

  if (publicOnlyRoutes.includes(pathname) || pathname === '/') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // FIX 1: The onboarding check is now consistent with the callback route.
  // It correctly handles `undefined` as needing onboarding.
  const needsOnboarding = user.app_metadata?.onboarding_complete !== true;
  if (needsOnboarding && pathname !== onboardingRoute) {
    return NextResponse.redirect(new URL(onboardingRoute, request.url));
  }
  if (!needsOnboarding && pathname === onboardingRoute) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // FIX 2: Use the type guard for safe role validation.
  const userRole = user.app_metadata?.role;
  if (!isValidUserRole(userRole)) {
    const isRoleSpecificRoute = 
      employerRoutePrefixes.some(r => pathname.startsWith(r)) ||
      seekerRoutePrefixes.some(r => pathname.startsWith(r)) ||
      adminRoutePrefixes.some(r => pathname.startsWith(r));
    // If the user has no valid role, redirect them away from any page that requires one.
    if (isRoleSpecificRoute) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  } else {
    // RBAC checks for users with valid roles.
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
  }

  return null;
}

/**
 * SRP: Handles all routing logic for an unauthenticated user.
 */
export function handleUnauthenticatedUser(
  request: NextRequest
): NextResponse | null {
  const { pathname } = request.nextUrl;

  if (protectedRoutePrefixes.some(r => pathname.startsWith(r))) {
    const redirectUrl = new URL('/login', request.url);
    
    // FIX 3: The redirect logic is now simpler and correct.
    // We set `redirectTo` to the path the user was trying to access.
    if (isValidInternalPath(pathname)) {
      redirectUrl.searchParams.set('redirectTo', pathname);
    }
    
    return NextResponse.redirect(redirectUrl);
  }

  return null;
}