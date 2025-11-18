// src/app/actions/auth/utils/analytics.ts
"use server";

import { posthogServerClient } from '@/lib/posthog/server';

/**
 * Tracks the successful registration of a new user.
 * @param userId - The distinct ID of the new user.
 * @param userRole - The role the user chose.
 */
export async function trackUserSignedUp(userId: string, userRole: string): Promise<void> {
  try {
    posthogServerClient.capture({
      distinctId: userId,
      event: 'user_signed_up',
      properties: {
        role: userRole,
      },
    });

    // Also, identify the user to enrich their profile in PostHog
    posthogServerClient.identify({
        distinctId: userId,
        properties: {
            role: userRole
            // You can add email here if you wish, e.g., email: userEmail
        }
    });

    await posthogServerClient.shutdown();
  } catch (error) {
    console.error("PostHog user_signed_up event failed:", error);
  }
}