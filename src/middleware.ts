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
  employerRoutePrefixes,
  seekerRoutePrefixes,
  adminRoutePrefixes
} from '@/lib/middleware/routeMatchers';

export async function middleware(request: NextRequest) {
  const response = NextResponse.next({
    request: { headers: request.headers },
  });

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
    if (pathname === '/update-password') {
      return response;
    }

    // RULE 1B: Redirect normal logged-in users away from public-only pages.
    if (publicOnlyRoutes.includes(pathname) || pathname === '/') {
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
  // --- Rule 2: Handle Unauthenticated Users ---
  else {
    // Protect all dashboard routes.
    if (protectedRoutePrefixes.some(r => pathname.startsWith(r))) {
      const redirectUrl = new URL('/login', request.url);
      redirectUrl.searchParams.set('redirectTo', pathname);
      return NextResponse.redirect(redirectUrl);
    }
    
    // An unauthenticated user MUST be allowed to reach `/update-password`.
    // By having no rule here, we implicitly allow them to pass.
  }

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api/).*)'],
};