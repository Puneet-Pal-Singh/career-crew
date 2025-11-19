// src/lib/posthog/server.ts
import { PostHog } from 'posthog-node';

function PostHogClient() {
  const apiKey = process.env.POSTHOG_API_KEY;
  const apiHost = process.env.NEXT_PUBLIC_POSTHOG_HOST;

  // Safety check: Don't initialize if key is missing
  if (!apiKey) {
    console.warn('PostHog server-side key is missing. Analytics will be disabled.');
    return undefined;
  }

  const posthogClient = new PostHog(apiKey, {
    host: apiHost,
    flushAt: 1,
    flushInterval: 0,
  });
  
  return posthogClient;
}

// Create a singleton instance
export const posthogServerClient = PostHogClient();