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