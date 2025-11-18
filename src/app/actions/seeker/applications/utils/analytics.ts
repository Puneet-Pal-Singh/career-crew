// src/app/actions/seeker/applications/utils/analytics.ts
"use server";

import { posthogServerClient } from '@/lib/posthog/server';

/**
 * Tracks the successful submission of a job application.
 * This is a critical conversion event for the platform.
 * @param userId - The distinct ID of the user who applied.
 * @param jobId - The ID of the job they applied to.
 * @param applicationId - The newly created application ID.
 */
export async function trackApplicationSubmitted(userId: string, jobId: number, applicationId: string): Promise<void> {
  try {
    posthogServerClient.capture({
      distinctId: userId,
      event: 'application_submitted',
      properties: {
        jobId: jobId,
        applicationId: applicationId,
        // You can add more properties here for deeper analysis, e.g.,
        // 'submission_method': 'standard_form'
      },
    });

    // IMPORTANT: Flush events to ensure they are sent before the serverless function might terminate.
    await posthogServerClient.shutdown();

  } catch (error) {
    // Log the error for debugging but do not throw.
    // A failure in analytics should never block the main application flow.
    console.error("PostHog event tracking failed:", error);
  }
}