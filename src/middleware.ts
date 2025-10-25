// src/middleware.ts
import { NextResponse, type NextRequest } from 'next/server';
import { createSupabaseMiddlewareClient } from './lib/supabase/middlewareClient';
import { handleAuthenticatedUser, handleUnauthenticatedUser } from './lib/middleware/middlewareHandlers';
import type { User } from './lib/middleware/middleware.types';

export async function middleware(request: NextRequest) {
  // THE CRUCIAL CHANGE: Our helper now returns both the client and a response object.
  const { supabase, response } = createSupabaseMiddlewareClient(request);

  const { data: { user: rawUser } } = await supabase.auth.getUser();
  const user = rawUser as User | null;

  let result: NextResponse | null = null;

  if (user) {
    // We pass the original request to the handlers.
    result = handleAuthenticatedUser(request, user);
  } else {
    result = handleUnauthenticatedUser(request);
  }

  // If a handler returned a redirect, we use that.
  // Otherwise, we return the response object that the Supabase client may have modified.
  return result ?? response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api/).*)'],
};