// src/middleware.ts
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

// 1. IMPORT the UserRole type from your central types file.
import type { UserRole } from '@/types';

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

  const { data: { user } } = await supabase.auth.getUser();
  const { pathname } = request.nextUrl;

  const authRoutes = ['/login', '/signup/job-seeker', '/signup/employer'];
  const onboardingRoute = '/onboarding/complete-profile';
  
  // --- DEFINE Role-Specific Routes ---
  const employerRoutes = ['/dashboard/post-job', '/dashboard/my-jobs'];
  const seekerRoutes = ['/dashboard/seeker/applications']; // Add more seeker-only routes here in the future
  const adminRoutes = ['/dashboard/admin'];

   if (user) {
     if (authRoutes.includes(pathname) || pathname === '/') {
       return NextResponse.redirect(new URL('/dashboard', request.url));
     }
    
    const needsOnboarding = user.app_metadata?.onboarding_complete === false;
    
    if (needsOnboarding && pathname !== onboardingRoute) {
      return NextResponse.redirect(new URL(onboardingRoute, request.url));
    }
    if (!needsOnboarding && pathname === onboardingRoute) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // --- NEW: ROLE-BASED ACCESS CONTROL ---
    const userRole = user.app_metadata?.role as UserRole;

    // If a job seeker tries to access an employer route
    if (userRole === 'JOB_SEEKER' && employerRoutes.some(route => pathname.startsWith(route))) {
      // Redirect them to their main dashboard page
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // If an employer tries to access a seeker route
    if (userRole === 'EMPLOYER' && seekerRoutes.some(route => pathname.startsWith(route))) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    
    // If a non-admin tries to access an admin route
    if (userRole !== 'ADMIN' && adminRoutes.some(route => pathname.startsWith(route))) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    // --- END OF NEW LOGIC ---

   } else {
     // If not logged in, protect all dashboard routes
     if (pathname.startsWith('/dashboard')) {
       const loginUrl = new URL('/login', request.url);
       loginUrl.searchParams.set('redirectTo', pathname);
       return NextResponse.redirect(loginUrl);
     }
   }

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api/).*)'],
};