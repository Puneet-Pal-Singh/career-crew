// src/app/actions/seeker/applications/utils/analytics.ts
"use server";

import { posthogServerClient } from '@/lib/posthog/server';

/**
 * Tracks the successful submission of a job application.
 * This is a critical conversion event for the platform.
 */
export async function trackApplicationSubmitted(userId: string, jobId: number, applicationId: string): Promise<void> {
  // ✅ SAFETY CHECK: Prevents crash if API key is missing (Type Error Fix)
  if (!posthogServerClient) return;

  try {
    posthogServerClient.capture({
      distinctId: userId,
      event: 'application_submitted',
      properties: {
        jobId: jobId,
        applicationId: applicationId,
      },
    });

    // Ensure events are sent before function termination
    await posthogServerClient.flush();

  } catch (error) {
    console.error("PostHog event tracking failed:", error);
  }
}