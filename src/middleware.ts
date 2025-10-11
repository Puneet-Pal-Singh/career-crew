// src/middleware.ts
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import type { UserRole } from '@/types';
import type { Session } from '@supabase/supabase-js';

// Type for Supabase Authentication Method Reference (AMR)
type AMREntry = {
  method: string;
  timestamp: number;
};

// Extend Session type to include amr (exists at runtime but not in types)
type SessionWithAMR = Session & {
  amr?: AMREntry[];
};

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
        set(name: string, value: string, options: CookieOptions) { 
          response.cookies.set({ name, value, ...options }); 
        },
        remove(name: string, options: CookieOptions) { 
          response.cookies.set({ name, value: '', ...options }); 
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  const { data: { session } } = await supabase.auth.getSession();
  const { pathname } = request.nextUrl;

  // Define public auth routes (accessible without login)
  const publicAuthRoutes = [
    '/login', 
    '/jobs/signup', 
    '/employer/signup',
    '/forgot-password',
  ];

  // Special routes that need authentication but are part of the auth flow
  const authFlowRoutes = ['/update-password'];
  
  const onboardingRoute = '/onboarding/complete-profile';
  
  // Role-specific routes
  const employerRoutes = ['/dashboard/post-job', '/dashboard/my-jobs', '/dashboard/applications'];
  const seekerRoutes = ['/dashboard/seeker/applications'];
  const adminRoutes = ['/dashboard/admin'];

  // --- HANDLE AUTHENTICATED USERS ---
  if (user) {
    // Check if user is in a password recovery session
    // AMR (Authentication Method Reference) contains 'recovery' for password recovery sessions
    // Note: AMR exists at runtime but isn't in the TypeScript types, so we cast it
    const sessionWithAMR = session as SessionWithAMR;
    const isPasswordRecovery = sessionWithAMR?.amr?.some(
      (method) => method.method === 'recovery'
    ) ?? false;
    
    // Allow password recovery users ONLY on /update-password
    if (isPasswordRecovery) {
      if (pathname !== '/update-password') {
        return NextResponse.redirect(new URL('/update-password', request.url));
      }
      // Let them stay on /update-password
      return response;
    }

    // Regular authenticated users should not access /update-password without recovery token
    if (pathname === '/update-password' && !isPasswordRecovery) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // Regular authenticated users should not access public auth routes
    if (publicAuthRoutes.includes(pathname) || pathname === '/') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // Handle onboarding
    const needsOnboarding = user.app_metadata?.onboarding_complete === false;
    
    if (needsOnboarding && pathname !== onboardingRoute) {
      return NextResponse.redirect(new URL(onboardingRoute, request.url));
    }
    
    if (!needsOnboarding && pathname === onboardingRoute) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // --- ROLE-BASED ACCESS CONTROL ---
    const userRole = user.app_metadata?.role as UserRole;

    if (!userRole) {
      // Block access to role-specific routes if no role
      const isRoleSpecificRoute = 
        employerRoutes.some(route => pathname.startsWith(route)) || 
        seekerRoutes.some(route => pathname.startsWith(route)) || 
        adminRoutes.some(route => pathname.startsWith(route));
      
      if (isRoleSpecificRoute) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
    } else {
      // Job seeker trying to access employer routes
      if (userRole === 'JOB_SEEKER' && employerRoutes.some(route => pathname.startsWith(route))) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }

      // Employer trying to access seeker routes
      if (userRole === 'EMPLOYER' && seekerRoutes.some(route => pathname.startsWith(route))) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
      
      // Non-admin trying to access admin routes
      if (userRole !== 'ADMIN' && adminRoutes.some(route => pathname.startsWith(route))) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
    }
  } 
  // --- HANDLE UNAUTHENTICATED USERS ---
  else {
    // Protect dashboard routes
    if (pathname.startsWith('/dashboard')) {
      return NextResponse.redirect(new URL('/', request.url));
    }
    
    // Protect auth flow routes (like /update-password) - these require a session
    if (authFlowRoutes.includes(pathname)) {
      return NextResponse.redirect(new URL('/login?error=invalid_token', request.url));
    }
  }

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api/).*)'],
};