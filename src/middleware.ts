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

  const authRoutes = ['/login', '/jobs/signup', '/employer/signup'];
  const onboardingRoute = '/onboarding/complete-profile';
  
  // --- DEFINE Role-Specific Routes ---
  const employerRoutes = ['/dashboard/post-job', '/dashboard/my-jobs', '/dashboard/applications'];
  const seekerRoutes = ['/dashboard/seeker/applications']; // Add more seeker-only routes here in the future
  
  const adminRoutes = ['/dashboard/admin'];

   if (user) {
     if (authRoutes.includes(pathname) || pathname === '/') {
       return NextResponse.redirect(new URL('/dashboard', request.url));
     }

     // Special handling for password reset flow - allow access to /update-password
     if (pathname === '/update-password') {
       const urlStr = request.url;
       const hashStart = urlStr.indexOf('#');
       const hash = hashStart !== -1 ? urlStr.substring(hashStart) : '';
       const queryStart = urlStr.indexOf('?');
       const queryString = queryStart !== -1 ? urlStr.substring(queryStart) : '';

       const isRecoveryFlow = hash.includes('access_token') ||
                             hash.includes('type=recovery') ||
                             hash.includes('token_type=recovery') ||
                             queryString.includes('access_token') ||
                             queryString.includes('token_type') ||
                             hash.includes('recovery') ||
                             urlStr.includes('access_token');

       console.log('[Middleware] Update password access - URL:', urlStr);
       console.log('[Middleware] Hash:', hash);
       console.log('[Middleware] Query:', queryString);
       console.log('[Middleware] Is recovery flow:', isRecoveryFlow);

       if (isRecoveryFlow) {
         console.log('[Middleware] Allowing recovery flow access');
         return response; // Allow recovery flow to proceed
       }
       // Even if not detected as recovery flow, allow access to /update-password
       // The component will handle the logic
       console.log('[Middleware] Allowing access to update-password page');
       return response;
     }

     const needsOnboarding = user.app_metadata?.onboarding_complete !== true;

     if (needsOnboarding && pathname !== onboardingRoute) {
       return NextResponse.redirect(new URL(onboardingRoute, request.url));
     }
     if (!needsOnboarding && pathname === onboardingRoute) {
       return NextResponse.redirect(new URL('/dashboard', request.url));
     }

      // --- NEW: ROLE-BASED ACCESS CONTROL ---
      // --- THE FIX: Block access if the role is missing/unknown ---
      const userRole = user.app_metadata?.role;
      const validRoles: UserRole[] = ['JOB_SEEKER', 'EMPLOYER', 'ADMIN'];
      const isValidRole = validRoles.includes(userRole as UserRole);

      if (!isValidRole || !userRole) {
       // If the user has no role, they should be sent back to the dashboard
       // and not be allowed into any role-specific areas.
       if (employerRoutes.some(route => pathname.startsWith(route)) || seekerRoutes.some(route => pathname.startsWith(route)) || adminRoutes.some(route => pathname.startsWith(route))) {
         return NextResponse.redirect(new URL('/dashboard', request.url));
       }
     } else {
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
     }
     // --- END OF NEW LOGIC ---

   } else {
      // If not logged in, protect all dashboard routes
      if (pathname.startsWith('/dashboard')) {
        // Redirect to homepage instead of login with redirectTo to avoid issues after logout
        return NextResponse.redirect(new URL('/', request.url));
      }
    }

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api/).*)'],
};