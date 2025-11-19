// src/app/actions/seeker/applications/utils/analytics.ts
"use server";

import { posthogServerClient } from '@/lib/posthog/server';

/**
 * Tracks the successful submission of a job application.
 * This is a critical conversion event for the platform.
 */
export async function trackApplicationSubmitted(userId: string, jobId: number, applicationId: string): Promise<void> {
  // Safety check in case client failed to initialize
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

    // FIX: Use flush() instead of shutdown(). 
    // flush() ensures events are sent immediately without killing the client for future use.
    await posthogServerClient.flush();

  } catch (error) {
    console.error("PostHog event tracking failed:", error);
  }
}