// src/app/actions/seeker/applications/submitApplicationAction.ts
"use server";

import { getSupabaseServerClient } from '@/lib/supabase/serverClient';
import { revalidatePath } from 'next/cache';
import { validateApplicationPayload, runBusinessLogicChecks } from './utils/validation';
import { uploadResume } from './utils/storage';
import { insertApplicationRecord } from './utils/database';
// Import our new, clean analytics helper
import { trackApplicationSubmitted } from './utils/analytics';

type ActionResult = 
  | { success: true; applicationId: string }
  | { success: false; error: string };

/**
 * Orchestrates the job application submission process.
 * This function follows SRP by delegating validation, storage, and database
 * operations to dedicated helper modules.
 */
export async function submitApplicationAction(formData: FormData): Promise<ActionResult> {
  const supabase = await getSupabaseServerClient();
  let resumeFilePath: string | null = null;

  try {
    // 1. Authenticate the user and check their role
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Authentication required. Please log in to apply.");
    if (user.app_metadata?.role !== 'JOB_SEEKER') {
      throw new Error("Only users registered as job seekers can apply for jobs.");
    }

    // 2. Validate the form payload
    const payload = validateApplicationPayload(formData);

    // 3. Run all business logic checks
    const businessLogicError = await runBusinessLogicChecks(payload.jobId, user.id, supabase);
    if (businessLogicError) {
      return { success: false, error: businessLogicError };
    }

    // 4. Upload the resume file
    resumeFilePath = await uploadResume(payload.resumeFile, user.id, payload.jobId, supabase);

    // 5. Insert the application record into the database
    const newApplicationId = await insertApplicationRecord(payload, user.id, resumeFilePath, supabase);

    // We fire and forget this. Analytics failures should not block the user.
    trackApplicationSubmitted(user.id, payload.jobId, newApplicationId);

    // 6. On success, revalidate paths and return
    revalidatePath(`/jobs/${payload.jobId}`);
    revalidatePath('/dashboard/seeker/applications');
    
    return { success: true, applicationId: newApplicationId };

  } catch (err) {
    // Log the full technical error for our own debugging in all cases.
    console.error("submitApplicationAction Error:", err);

    // Cleanup logic remains the same.
    if (resumeFilePath) {
      await supabase.storage.from('resumes').remove([resumeFilePath]);
      console.log(`Cleanup: Removed orphaned file ${resumeFilePath}`);
    }

    // THE BOT'S IMPROVEMENT: Preserve user-friendly errors, sanitize technical ones.
    const rawErrorMessage = err instanceof Error ? err.message : "An unexpected server error occurred.";

    // Check if the error message is one of our known technical errors.
    const isTechnicalError = rawErrorMessage.includes("Storage Error:") || 
                             rawErrorMessage.includes("Database Insert Error:");

    // If it's a technical error, show a generic message. Otherwise, show the original validation message.
    const finalErrorMessage = isTechnicalError
      ? "We couldn't submit your application at this time. Please try again."
      : rawErrorMessage;

    return { success: false, error: finalErrorMessage };
  }
}