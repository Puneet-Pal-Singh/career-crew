// // src/middleware.ts
// import { createServerClient, type CookieOptions } from '@supabase/ssr';
// import { NextResponse, type NextRequest } from 'next/server';

// export async function updateSession(request: NextRequest) {
//   let response = NextResponse.next({
//     request: {
//       headers: request.headers,
//     },
//   });

//   const supabase = createServerClient(
//     process.env.NEXT_PUBLIC_SUPABASE_URL!,
//     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
//     {
//       cookies: {
//         get(name: string) {
//           return request.cookies.get(name)?.value;
//         },
//         set(name: string, value: string, options: CookieOptions) {
//           request.cookies.set({ name, value, ...options });
//           response = NextResponse.next({ // Re-create to pass new request cookies
//             request: { headers: request.headers },
//           });
//           response.cookies.set({ name, value, ...options }); // Set on outgoing response
//         },
//         remove(name: string, options: CookieOptions) {
//           request.cookies.set({ name, value: '', ...options });
//           response = NextResponse.next({
//             request: { headers: request.headers },
//           });
//           response.cookies.set({ name, value: '', ...options });
//         },
//       },
//     }
//   );

//   // Refreshing the session will update the cookies if needed
//   const { data: { session } } = await supabase.auth.refreshSession();
//   // Alternative: const { data: { user } } = await supabase.auth.getUser();

//   console.log(
//      "Middleware: Path:", request.nextUrl.pathname,
//      "| Session from refreshSession():", !!session,
//      "| User in session:", session?.user?.id || "None"
//   );
  
//   const { pathname } = request.nextUrl;
//   const publicPaths = ['/login', '/register', '/auth/callback']; // Add any other public paths

//   // Allow access to the landing page for everyone
//   if (pathname === '/') {
//     return response;
//   }

//   // If user has a session (is authenticated)
//   if (session) {
//     // If trying to access login/register, redirect to dashboard
//     if (publicPaths.some(path => pathname.startsWith(path) && (path === '/login' || path === '/register'))) {
//       console.log("Middleware: Authenticated user on auth page, redirecting to /dashboard.");
//       return NextResponse.redirect(new URL('/dashboard', request.url));
//     }
//     // Otherwise, allow access to the requested path
//     console.log("Middleware: Authenticated user, allowing access to:", pathname);
//     return response;
//   }

//   // User does NOT have a session (is not authenticated)
//   // If trying to access a non-public path, redirect to login
//   if (!publicPaths.some(path => pathname.startsWith(path))) {
//     console.log("Middleware: Unauthenticated user on protected path, redirecting to /login. Path:", pathname);
//     const loginUrl = new URL('/login', request.url);
//     loginUrl.searchParams.set('redirectedFrom', pathname);
//     return NextResponse.redirect(loginUrl);
//   }
  
//   // Unauthenticated user on a public path, allow access
//   console.log("Middleware: Unauthenticated user on public path, allowing. Path:", pathname);
//   return response;
// }

// export const config = {
//   matcher: [
//     /*
//      * Match all request paths except for the ones starting with:
//      * - _next/static (static files)
//      * - _next/image (image optimization files)
//      * - favicon.ico (favicon file)
//      * - api (API routes, if any)
//      * - Specific public assets if needed (e.g. /logo.png)
//      */
//     '/((?!_next/static|_next/image|favicon.ico|api/).*)',
//   ],
// };

// // Re-export the middleware function with the desired name for Next.js
// export const middleware = updateSession;


// // src/middleware.ts
// import { createServerClient, type CookieOptions } from '@supabase/ssr';
// import { NextResponse, type NextRequest } from 'next/server';

// export async function middleware(request: NextRequest) { // Renamed to 'middleware' for standard export
//   const response = NextResponse.next({
//     request: {
//       headers: request.headers,
//     },
//   });

//   const supabase = createServerClient(
//     process.env.NEXT_PUBLIC_SUPABASE_URL!,
//     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
//     {
//       cookies: {
//         get(name: string) {
//           return request.cookies.get(name)?.value;
//         },
//         set(name: string, value: string, options: CookieOptions) {
//           // request.cookies.set({ name, value, ...options }); // Not needed for request, only response
//           response.cookies.set({ name, value, ...options }); // Set on outgoing response
//         },
//         remove(name: string, options: CookieOptions) {
//           // request.cookies.set({ name, value: '', ...options }); // Not needed for request
//           response.cookies.set({ name, value: '', ...options });
//         },
//       },
//     }
//   );

//   // Refreshing the session will update the cookies if needed.
//   // getSession() is recommended for middleware by Supabase docs over getUser() for performance.
//   const { data: { session } } = await supabase.auth.getSession();

//   const { pathname } = request.nextUrl;

//   // Define public paths that do not require authentication
//   const publicPaths = [
//     '/',             // Landing page
//     '/login',
//     '/register',
//     '/auth/callback', // Supabase auth callback
//     '/jobs',         // Public job listing page
//     // Add other specific public static paths if needed, e.g., /about, /contact
//   ];

//   // Define a pattern for dynamic public paths like /jobs/[jobId]
//   const dynamicPublicPathPatterns = [
//     /^\/jobs\/[^/]+$/, // Matches /jobs/[anything-but-slash]
//     // Add other dynamic public patterns here if any
//   ];

//   // Check if the current path is a static public path
//   let isPublic = publicPaths.includes(pathname);

//   // If not a static public path, check against dynamic public path patterns
//   if (!isPublic) {
//     for (const pattern of dynamicPublicPathPatterns) {
//       if (pattern.test(pathname)) {
//         isPublic = true;
//         break;
//       }
//     }
//   }
  
//   // Debugging log
//   // console.log(
//   //    "Middleware: Path:", pathname,
//   //    "| Session:", !!session,
//   //    "| User ID:", session?.user?.id || "None",
//   //    "| Is Public:", isPublic
//   // );

//   // If user has a session (is authenticated)
//   if (session) {
//     // If trying to access login or register, redirect to dashboard
//     if (pathname === '/login' || pathname === '/register') {
//       console.log(`Middleware: Authenticated user on ${pathname}, redirecting to /dashboard.`);
//       return NextResponse.redirect(new URL('/dashboard', request.url), { headers: response.headers });
//     }
//     // Allow access to other paths (including public ones if they revisit)
//     // console.log(`Middleware: Authenticated user, allowing access to: ${pathname}`);
//     return response;
//   }

//   // User does NOT have a session (is not authenticated)
//   // If trying to access a non-public path, redirect to login
//   if (!isPublic) {
//     console.log(`Middleware: Unauthenticated user on protected path ${pathname}, redirecting to /login.`);
//     const loginUrl = new URL('/login', request.url);
//     loginUrl.searchParams.set('redirectedFrom', pathname); // For redirecting back after login
//     return NextResponse.redirect(loginUrl, { headers: response.headers });
//   }
  
//   // Unauthenticated user on a public path, allow access
//   // console.log(`Middleware: Unauthenticated user on public path ${pathname}, allowing.`);
//   return response;
// }

// export const config = {
//   matcher: [
//     /*
//      * Match all request paths except for the ones starting with:
//      * - _next/static (static files)
//      * - _next/image (image optimization files)
//      * - favicon.ico (favicon file)
//      * - api (API routes - if you have serverless functions not using this middleware logic)
//      * - Specific public assets if needed (e.g. /logo.png, /sitemap.xml)
//      */
//     '/((?!_next/static|_next/image|favicon.ico|api/).*)',
//   ],
// };

// this was the before refactor version
// src/middleware.ts
// import { createServerClient, type CookieOptions } from '@supabase/ssr';
// import { NextResponse, type NextRequest } from 'next/server';

// export async function middleware(request: NextRequest) {
//   const response = NextResponse.next({
//     request: {
//       headers: request.headers,
//     },
//   });

//   const supabase = createServerClient(
//     process.env.NEXT_PUBLIC_SUPABASE_URL!,
//     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
//     {
//       cookies: {
//         get(name: string) {
//           return request.cookies.get(name)?.value;
//         },
//         set(name: string, value: string, options: CookieOptions) {
//           response.cookies.set({ name, value, ...options });
//         },
//         remove(name: string, options: CookieOptions) {
//           response.cookies.set({ name, value: '', ...options });
//         },
//       },
//     }
//   );

//   const { data: { session } } = await supabase.auth.getSession();
//   const user = session?.user;
//   const { pathname } = request.nextUrl;

//   // --- Define Route Groups for Clarity ---
//   const authRoutes = ['/login', '/signup/job-seeker', '/signup/employer'];
//   const onboardingRoute = '/onboarding/complete-profile';
//   const isDashboardRoute = pathname.startsWith('/dashboard');

//   // --- Logic for Authenticated Users ---
//   if (user) {
//     // 1. If user is on an auth page (login/signup), redirect them to the dashboard.
//     if (authRoutes.includes(pathname)) {
//       return NextResponse.redirect(new URL('/dashboard', request.url));
//     }

//     // 2. Check for mandatory onboarding.
//     const { data: profile } = await supabase
//       .from('profiles')
//       .select('has_completed_onboarding')
//       .eq('id', user.id)
//       .single();

//     const needsOnboarding = profile?.has_completed_onboarding === false;
//     const isOnboardingPage = pathname === onboardingRoute;
    
//     // 2a. If they need onboarding and are NOT on the onboarding page, force them there.
//     if (needsOnboarding && !isOnboardingPage) {
//       return NextResponse.redirect(new URL(onboardingRoute, request.url));
//     }
    
//     // 2b. If they have finished onboarding but land on the page, send them away.
//     if (!needsOnboarding && isOnboardingPage) {
//       return NextResponse.redirect(new URL('/dashboard', request.url));
//     }
    
//     // If all checks pass, allow access.
//     return response;
//   }

//   // --- Logic for Unauthenticated Users ---
//   // If an unauthenticated user tries to access a protected dashboard route, redirect to login.
//   if (!user && isDashboardRoute) {
//     return NextResponse.redirect(new URL('/login', request.url));
//   }

//   // For all other cases (e.g., public pages, auth pages), allow access.
//   return response;
// }

// export const config = {
//   matcher: [
//     /*
//      * Match all request paths except for the ones starting with:
//      * - _next/static (static files)
//      * - _next/image (image optimization files)
//      * - favicon.ico (favicon file)
//      * This ensures the middleware runs on all page navigations.
//      */
//     '/((?!_next/static|_next/image|favicon.ico|api/).*)',
//   ],
// };


// this was the after refactor version
// src/middleware.ts
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

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
  const isDashboardRoute = pathname.startsWith('/dashboard');

  if (user) {
    if (authRoutes.includes(pathname)) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    
    const { data: profile } = await supabase.from('profiles').select('has_completed_onboarding').eq('id', user.id).single();
    const needsOnboarding = profile?.has_completed_onboarding === false;
    
    if (needsOnboarding && pathname !== onboardingRoute) {
      return NextResponse.redirect(new URL(onboardingRoute, request.url));
    }
    if (!needsOnboarding && pathname === onboardingRoute) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  } else {
    if (isDashboardRoute) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api/).*)'],
};