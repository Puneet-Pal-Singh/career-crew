// src/middleware.ts
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import type { UserRole } from '@/types'; // UserRole is a general type
import type { User } from '@/lib/middleware/middleware.types'; // Our extended User type for middleware

// Import our centralized route configurations
import {
  publicOnlyRoutes,
  onboardingRoute,
  protectedRoutePrefixes,
  specialHandlingRoutes, 
  employerRoutePrefixes,
  seekerRoutePrefixes,
  adminRoutePrefixes
} from '@/lib/middleware/routeMatchers';

export async function middleware(request: NextRequest) {
  const response = NextResponse.next({
    request: { headers: request.headers },
  });
  console.log(`[Middleware] ▶️ Path: "${request.nextUrl.pathname}"`);

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) { return request.cookies.get(name)?.value; },
        set(name: string, value: string, options: CookieOptions) { response.cookies.set({ name, value, ...options }); },
        remove(name: string, options: CookieOptions) { response.cookies.set({ name, value: '', ...options }); },
      },
    }
  );

  // ✅ THE FIX for "Expected 0 type arguments, but got 1":
  // We fetch the user with the default types and then cast the result to our extended User type.
  const { data: { user: rawUser } } = await supabase.auth.getUser();
  const user = rawUser as User | null;
  
  const { pathname } = request.nextUrl;

  // --- Rule 1: Handle Authenticated Users ---
  if (user) {
    // RULE 1A: Always allow an authenticated user to reach the /update-password page.
    // Our robust client-side `usePasswordRecovery` hook is the specialist responsible
    // for handling all logic on this page (redirecting normal users, handling recovery, etc.).
    // The middleware's job is to not interfere.
    console.log(`[Middleware] ✅ User is AUTHENTICATED. User ID: ${user.id}`);
    if (specialHandlingRoutes.includes(pathname)) {
      console.log(`[Middleware] 🚦 Path is a special handling route. ALLOWING.`);
      return response;
    }

    // RULE 1B: Redirect normal logged-in users away from public-only pages.
    if (publicOnlyRoutes.includes(pathname) || pathname === '/') {
      console.log(`[Middleware] ❌ Authenticated user on public-only route. REDIRECTING to /dashboard.`);
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    
    // RULE 1C: Handle mandatory onboarding.
    const needsOnboarding = user.app_metadata?.onboarding_complete === false;
    if (needsOnboarding && pathname !== onboardingRoute) {
      return NextResponse.redirect(new URL(onboardingRoute, request.url));
    }
    if (!needsOnboarding && pathname === onboardingRoute) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    
    // RULE 1D: Handle Role-Based Access Control (RBAC).
    const userRole = user.app_metadata?.role as UserRole;

    // If no role is defined, redirect from any role-specific page to the dashboard.
    if (!userRole) {
      const isRoleSpecificRoute = 
        employerRoutePrefixes.some(r => pathname.startsWith(r)) ||
        seekerRoutePrefixes.some(r => pathname.startsWith(r)) ||
        adminRoutePrefixes.some(r => pathname.startsWith(r));
        
      if (isRoleSpecificRoute) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
    } else {
      if (userRole === 'JOB_SEEKER' && employerRoutePrefixes.some(r => pathname.startsWith(r))) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
      if (userRole === 'EMPLOYER' && seekerRoutePrefixes.some(r => pathname.startsWith(r))) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
      if (userRole !== 'ADMIN' && adminRoutePrefixes.some(r => pathname.startsWith(r))) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
    }
  } 
  // --- Rule 2: Handle Unauthenticated Users ---
  else {
    console.log("[Middleware] 👻 User is UNAUTHENTICATED.");
    // Protect all dashboard routes.
    if (protectedRoutePrefixes.some(r => pathname.startsWith(r))) {
      console.log(`[Middleware] ❌ Unauthenticated user on protected route. REDIRECTING to /login.`);
      // Correctly build the redirect URL with the `redirectTo` parameter.
      const redirectUrl = new URL('/login', request.url);
      redirectUrl.searchParams.set('redirectTo', pathname);
      return NextResponse.redirect(redirectUrl);
    }
  }
  console.log("[Middleware] ✅ No rules matched. ALLOWING request to proceed.");
  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api/).*)'],
};