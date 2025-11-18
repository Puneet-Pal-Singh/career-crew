// src/lib/posthog/server.ts
import { PostHog } from 'posthog-node';

// This function initializes and returns a new PostHog client instance.
function PostHogClient() {

  // --- ADD THIS CRITICAL DEBUGGING LINE ---
  // console.log('SERVER-SIDE POSTHOG KEY BEING USED:', process.env.POSTHOG_API_KEY);
  // --- END DEBUGGING LINE ---
  
  const posthogClient = new PostHog(process.env.POSTHOG_API_KEY!, {
    host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
    flushAt: 1,
    flushInterval: 0,
  });
  return posthogClient;
}

// Create a singleton instance of the PostHog client for server-side use.
// This prevents creating a new client on every server action call.
export const posthogServerClient = PostHogClient();