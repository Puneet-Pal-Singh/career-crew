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

// --- Helper Functions (Single Responsibility Principle) ---

function isValidUserRole(role: unknown): role is UserRole {
  return typeof role === 'string' && ['JOB_SEEKER', 'EMPLOYER', 'ADMIN'].includes(role);
}

// THE NEW OTP LOGIC: CCheck if the user's session was created for both 'otp' and 'magiclink' for robustness.
function isOtpSignIn(user: User): boolean {
  const amr = user.amr || [];
  return amr.some(entry => entry.method === 'otp' || entry.method === 'magiclink');
}

/**
 * SRP: This function's only job is to "jail" a user in a specific flow
 * if they authenticated via a method that requires an immediate action (like OTP).
 * It runs with the highest priority.
 */
function handleAuthMethodJail(request: NextRequest, user: User): NextResponse | null {
  const { pathname } = request.nextUrl;

  if (isOtpSignIn(user)) {
    // If they used an OTP link, they are "jailed" to the /update-password page.
    if (pathname === '/update-password') {
      return null; // They are in the correct place, allow them to proceed.
    }
    // If they try to go anywhere else, force them back to the password update page.
    return NextResponse.redirect(new URL('/update-password', request.url));
  }

  return null; // Not an OTP session, so no jail applies.
}

/**
 * SRP: This function's only job is to handle redirects related to onboarding.
 */
function handleOnboardingRedirect(request: NextRequest, user: User): NextResponse | null {
  const { pathname } = request.nextUrl;
  const needsOnboarding = user.app_metadata?.onboarding_complete !== true;

  if (needsOnboarding && pathname !== onboardingRoute) {
    return NextResponse.redirect(new URL(onboardingRoute, request.url));
  }
  if (!needsOnboarding && pathname === onboardingRoute) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return null;
}

/**
 * SRP: This function's only job is to handle Role-Based Access Control (RBAC).
 */
function handleRbacRedirect(request: NextRequest, user: User): NextResponse | null {
  const { pathname } = request.nextUrl;
  const userRole = user.app_metadata?.role;

  const isEmployerRoute = employerRoutePrefixes.some(r => pathname.startsWith(r));
  const isSeekerRoute = seekerRoutePrefixes.some(r => pathname.startsWith(r));
  const isAdminRoute = adminRoutePrefixes.some(r => pathname.startsWith(r));
  
  if (!isValidUserRole(userRole)) {
    if (isEmployerRoute || isSeekerRoute || isAdminRoute) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  } else {
    if (userRole === 'JOB_SEEKER' && isEmployerRoute) return NextResponse.redirect(new URL('/dashboard', request.url));
    if (userRole === 'EMPLOYER' && isSeekerRoute) return NextResponse.redirect(new URL('/dashboard', request.url));
    if (userRole !== 'ADMIN' && isAdminRoute) return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  
  return null;
}

// --- Main Handler Functions (Orchestrators) ---

/**
 * This function now acts as an ORCHESTRATOR. It calls helper functions
 * in a specific order of priority.
 */
export function handleAuthenticatedUser(request: NextRequest, user: User): NextResponse | null {
  const { pathname } = request.nextUrl;

  // Priority 1: The "Jail". This MUST run first.
  const jailResponse = handleAuthMethodJail(request, user);
  if (jailResponse) return jailResponse;

  // THE FIX: Allow special handling routes (like /update-password) to proceed
  // immediately after the jail check to prevent further redirects.
  if (specialHandlingRoutes.includes(pathname)) return null;

  // Priority 2: Onboarding.
  const onboardingResponse = handleOnboardingRedirect(request, user);
  if (onboardingResponse) return onboardingResponse;
  
  // Priority 3: General routing rules for fully authenticated users.
  if (specialHandlingRoutes.includes(pathname)) return null;
  if (publicOnlyRoutes.includes(pathname) || pathname === '/') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  
  // Priority 4: Role-Based Access Control.
  const rbacResponse = handleRbacRedirect(request, user);
  if (rbacResponse) return rbacResponse;

  // If no other rule matched, allow the user to proceed.
  return null;
}

/**
 * SRP: Handles all routing logic for an unauthenticated user. (No changes needed here)
 */
export function handleUnauthenticatedUser(request: NextRequest): NextResponse | null {
  const { pathname, search } = request.nextUrl;

  if (protectedRoutePrefixes.some(r => pathname.startsWith(r))) {
    const redirectUrl = new URL('/login', request.url);
    // THE FIX: Preserve the full path, including query parameters.
    const fullPath = `${pathname}${search}`;
    if (isValidInternalPath(fullPath)) {
      redirectUrl.searchParams.set('redirectTo', fullPath);
    }
    return NextResponse.redirect(redirectUrl);
  }

  return null;
}