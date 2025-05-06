// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose'; // Using jose for edge-compatible verification

const secret = process.env.JWT_SECRET;

// Function to get the secret key as Uint8Array (required by jose)
async function getSecretKey() {
  if (!secret) {
    throw new Error('JWT_SECRET environment variable is not set');
  }
  return new TextEncoder().encode(secret);
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Define public paths that don't require authentication
  const publicPaths = ['/login', '/register', '/api/auth/login', '/api/auth/register']; // Add other public paths like '/', '/jobs'

  // Allow access to public paths and API routes needed for auth
  if (publicPaths.some(path => pathname.startsWith(path)) || pathname === '/') { // Example: allow root path
      return NextResponse.next();
  }

  // Define protected paths
  // Add paths that should require authentication here
  const protectedPaths = ['/dashboard', '/admin', '/employer-dashboard']; // Example: Add more specific paths if needed

  // Check if the current path requires authentication
  const requiresAuth = protectedPaths.some(path => pathname.startsWith(path));

  if (requiresAuth) {
      // Get the token from the cookie
      const token = request.cookies.get('authToken')?.value;

      if (!token) {
        // Redirect to login if no token and path is protected
        const loginUrl = new URL('/login', request.url); // Use request.url as base
        loginUrl.searchParams.set('redirectedFrom', pathname); // Optional: add redirect info
        return NextResponse.redirect(loginUrl);
      }

      try {
        // Verify the token using jose (works in Edge runtime)
        const key = await getSecretKey();
        await jwtVerify(token, key);

        // Token is valid, allow the request to proceed
        // Optional: Could add decoded payload to request headers here if needed later
        // const requestHeaders = new Headers(request.headers);
        // requestHeaders.set('x-user-payload', JSON.stringify(payload));
        // return NextResponse.next({ request: { headers: requestHeaders } });

        return NextResponse.next();

      } catch (err) {
        // Token verification failed (invalid, expired, etc.)
        console.error('JWT Verification Error:', err);

        // Redirect to login, potentially clearing the invalid cookie
        const loginUrl = new URL('/login', request.url);
        const response = NextResponse.redirect(loginUrl);
        // Clear the potentially invalid cookie
        response.cookies.set('authToken', '', { maxAge: -1, path: '/' });
        return response;
      }
  }

  // If the path is not explicitly public or protected by the matcher, allow access
  // Adjust this logic based on your default access policy (default deny or default allow)
  return NextResponse.next();
}

// --- Matcher ---
// Apply the middleware to specific paths for efficiency.
// Avoid running it on static files (_next/static), images, etc.
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api routes needed before auth (handled internally)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api/auth/|api/public/|_next/static|_next/image|favicon.ico).*)', // Adjust API paths if needed
  ],
};