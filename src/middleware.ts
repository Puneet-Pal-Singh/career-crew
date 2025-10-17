// src/middleware.ts
import { NextResponse, type NextRequest } from 'next/server';
import { createSupabaseMiddlewareClient } from './lib/supabase/middlewareClient';
import { handleAuthenticatedUser, handleUnauthenticatedUser } from './lib/middleware/middlewareHandlers';
import type { User } from './lib/middleware/middleware.types';

export async function middleware(request: NextRequest) {
  const response = NextResponse.next({
    request: { headers: request.headers },
  });

  const supabase = createSupabaseMiddlewareClient(request, response);

  const { data: { user: rawUser } } = await supabase.auth.getUser();
  const user = rawUser as User | null;

  let result: NextResponse | null = null;

  if (user) {
    result = handleAuthenticatedUser(request, user);
  } else {
    result = handleUnauthenticatedUser(request);
  }

  // If a handler returned a redirect response, return it.
  // Otherwise, return the original response to continue the request.
  return result ?? response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api/).*)'],
};