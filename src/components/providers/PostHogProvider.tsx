// src/components/providers/PostHogProvider.tsx
"use client";

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import posthog from 'posthog-js';
import { PostHogProvider as PHProvider } from 'posthog-js/react';

// --- TEMPORARY DEBUGGING ---
console.log("PostHog Key:", process.env.NEXT_PUBLIC_POSTHOG_KEY);
console.log("PostHog Host:", process.env.NEXT_PUBLIC_POSTHOG_HOST);
// --- END DEBUGGING ---

// Initialize PostHog in the browser
if (typeof window !== 'undefined') {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
    // Enable this to log pageviews automatically with the Next.js router
    capture_pageview: false 
  });
}

// This component is the key to automatic pageview tracking
function PostHogPageview(): null {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (pathname) {
      let url = window.origin + pathname;
      if (searchParams && searchParams.toString()) {
        url = url + `?${searchParams.toString()}`;
      }
      posthog.capture('$pageview', {
        '$current_url': url,
      });
    }
  }, [pathname, searchParams]);

  return null;
}

// The main provider component to wrap our app
export function PostHogProvider({ children }: { children: React.ReactNode }) {
  return (
    <PHProvider client={posthog}>
      <PostHogPageview />
      {children}
    </PHProvider>
  );
}