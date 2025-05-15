// src/middleware.ts
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options });
          response = NextResponse.next({ // Re-create to pass new request cookies
            request: { headers: request.headers },
          });
          response.cookies.set({ name, value, ...options }); // Set on outgoing response
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: '', ...options });
          response = NextResponse.next({
            request: { headers: request.headers },
          });
          response.cookies.set({ name, value: '', ...options });
        },
      },
    }
  );

  // Refreshing the session will update the cookies if needed
  const { data: { session } } = await supabase.auth.refreshSession();
  // Alternative: const { data: { user } } = await supabase.auth.getUser();

  console.log(
     "Middleware: Path:", request.nextUrl.pathname,
     "| Session from refreshSession():", !!session,
     "| User in session:", session?.user?.id || "None"
  );
  
  const { pathname } = request.nextUrl;
  const publicPaths = ['/login', '/register', '/auth/callback']; // Add any other public paths

  // Allow access to the landing page for everyone
  if (pathname === '/') {
    return response;
  }

  // If user has a session (is authenticated)
  if (session) {
    // If trying to access login/register, redirect to dashboard
    if (publicPaths.some(path => pathname.startsWith(path) && (path === '/login' || path === '/register'))) {
      console.log("Middleware: Authenticated user on auth page, redirecting to /dashboard.");
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    // Otherwise, allow access to the requested path
    console.log("Middleware: Authenticated user, allowing access to:", pathname);
    return response;
  }

  // User does NOT have a session (is not authenticated)
  // If trying to access a non-public path, redirect to login
  if (!publicPaths.some(path => pathname.startsWith(path))) {
    console.log("Middleware: Unauthenticated user on protected path, redirecting to /login. Path:", pathname);
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirectedFrom', pathname);
    return NextResponse.redirect(loginUrl);
  }
  
  // Unauthenticated user on a public path, allow access
  console.log("Middleware: Unauthenticated user on public path, allowing. Path:", pathname);
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - api (API routes, if any)
     * - Specific public assets if needed (e.g. /logo.png)
     */
    '/((?!_next/static|_next/image|favicon.ico|api/).*)',
  ],
};

// Re-export the middleware function with the desired name for Next.js
export const middleware = updateSession;