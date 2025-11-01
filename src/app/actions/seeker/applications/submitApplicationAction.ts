// src/app/actions/seeker/applications/submitApplicationAction.ts
"use server";

import { getSupabaseServerClient } from '@/lib/supabase/serverClient';
import { revalidatePath } from 'next/cache';
import { validateApplicationPayload, runBusinessLogicChecks } from './utils/validation';
import { uploadResume } from './utils/storage';
import { insertApplicationRecord } from './utils/database';

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

    // 6. On success, revalidate paths and return
    revalidatePath(`/jobs/${payload.jobId}`);
    revalidatePath('/dashboard/seeker/applications');
    
    return { success: true, applicationId: newApplicationId };

  } catch (err) {
    // Log the full error object for better context.
    console.error("submitApplicationAction Error:", err); 

    // Cleanup: If a resume was uploaded but the DB insert failed, remove the orphaned file.
    if (resumeFilePath) {
      await supabase.storage.from('resumes').remove([resumeFilePath]);
      console.log(`Cleanup: Removed orphaned file ${resumeFilePath}`);
    }

    return { success: false, error: "We couldn't submit your application at this time. Please try again." };
  }
}