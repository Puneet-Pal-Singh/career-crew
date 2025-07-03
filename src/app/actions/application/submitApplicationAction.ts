// src/app/actions/application/submitApplicationAction.ts
"use server";

import { getSupabaseServerClient } from '@/lib/supabase/serverClient';
import { type ApplicationFormSchemaType } from '@/lib/formSchemas'; // Correct type for form data
// import type { User } from '@supabase/supabase-js'; // Not explicitly needed if using user from getUser()

interface SubmitApplicationResult {
  success: boolean;
  applicationId?: string;
  error?: string;
}

/**
 * Server Action for submitting a job application.
 * @param formData - The application form data (does NOT include jobId).
 * @param jobId - The ID of the job being applied to.
 * @returns {Promise<SubmitApplicationResult>} Result of the operation.
 */
export async function submitApplication(
  formData: ApplicationFormSchemaType, // Data from the form fields
  jobId: string                        // JobId passed separately
): Promise<SubmitApplicationResult> {
  const supabase = await getSupabaseServerClient();
  const actionName = "submitApplication";
  
  // Log carefully, avoid logging full PII like cover letter unless necessary for debugging
  console.log(`Server Action (${actionName}): Attempting application for job ID ${jobId} with data:`, {
    fullName: formData.fullName,
    email: formData.email,
    hasResumeUrl: !!formData.resumeUrl,
    hasCoverLetter: !!formData.coverLetterNote
  });

  if (!jobId) { // Basic validation for jobId
    console.error(`Server Action (${actionName}): Job ID is missing.`);
    return { success: false, error: "Job ID is required to submit an application." };
  }

  try {
    // 1. Get current authenticated user (applicant)
    const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();

    if (authError) {
      console.error(`Server Action (${actionName}): Supabase auth error.`, authError);
      return { success: false, error: "Could not verify your session. Please try logging in again." };
    }
    if (!authUser) {
      console.warn(`Server Action (${actionName}): No authenticated user. Application requires login.`);
      return { success: false, error: "You must be logged in to apply for this job." };
    }

    // 2. Verify the job exists, is 'APPROVED', and user is not the employer
    const { data: jobData, error: jobFetchError } = await supabase
      .from('jobs')
      .select('id, status, employer_id')
      .eq('id', jobId)
      .single(); // Fetches the job or null/error if not found

    if (jobFetchError || !jobData) {
      console.error(`Server Action (${actionName}): Job ID ${jobId} not found or DB error.`, jobFetchError);
      return { success: false, error: "This job posting could not be found." };
    }
    if (jobData.status !== 'APPROVED') {
      console.warn(`Server Action (${actionName}): Job ID ${jobId} is not 'APPROVED' (status: ${jobData.status}).`);
      return { success: false, error: "This job is no longer accepting applications." };
    }
    if (jobData.employer_id === authUser.id) {
      console.warn(`Server Action (${actionName}): Employer ${authUser.id} attempting to apply to their own job ${jobId}.`);
      return { success: false, error: "You cannot apply to your own job posting." };
    }

    // 3. Check for existing application by this user for this job
    const { count: existingApplicationCount, error: checkError } = await supabase
      .from('applications')
      .select('id', { count: 'exact', head: true }) // More efficient: just check if count > 0
      .eq('job_id', jobId)
      .eq('seeker_id', authUser.id);

    if (checkError) {
      console.error(`Server Action (${actionName}): Error checking for existing application for job ${jobId}, user ${authUser.id}.`, checkError);
      return { success: false, error: "Could not verify previous applications. Please try again." };
    }

    if (existingApplicationCount !== null && existingApplicationCount > 0) { // This is the key
      console.log(`Server Action (${actionName}): User ${authUser.id} has already applied to job ${jobId}. Duplicate attempt.`);
      return { success: false, error: "You have already applied for this job." };
    }
    // if (existingApplication) {
    //   console.log(`Server Action (${actionName}): User ${authUser.id} has already applied to job ${jobId}.`);
    //   return { success: false, error: "You have already applied for this job." };
    // }

    // 4. Construct application data for insertion
    const applicationDataToInsert = {
      job_id: jobId, // Use the jobId argument
      seeker_id: authUser.id,
      // 'status' defaults to 'SUBMITTED' in your DB schema. If not, set it here:
      // status: 'SUBMITTED', 
      cover_letter_snippet: formData.coverLetterNote || null,
      resume_url: formData.resumeUrl || null,
      // 'created_at' will use its DB default.
    };

    console.log(`Server Action (${actionName}): Inserting application for job ${jobId}, user ${authUser.id}.`);

    // 5. Insert into 'applications' table
    const { data: newApplication, error: insertError } = await supabase
      .from('applications')
      .insert(applicationDataToInsert)
      .select('id') // Select the ID of the newly created application
      .single();   // Expect a single record to be returned

    if (insertError) {
      console.error(`Server Action (${actionName}): Supabase insert error for application (job ${jobId}, user ${authUser.id}).`, insertError);
      if (insertError.code === '23505') { // Specifically for unique constraint violation
        return { success: false, error: "It seems you've applied for this job. Please check 'My Applications'." };
      }
      return { success: false, error: "Failed to submit your application. Please try again. Code: " + insertError.code };
    }
    if (!newApplication || !newApplication.id) {
      console.error(`Server Action (${actionName}): Application submitted for job ${jobId} but no ID returned.`);
      return { success: false, error: "Application submitted but failed to get confirmation." };
    }

    console.log(`Server Action (${actionName}): Application submitted successfully. App ID: ${newApplication.id} for job ${jobId}, user ${authUser.id}.`);
    // Consider revalidating paths if this application should appear immediately somewhere.
    // revalidatePath(`/dashboard/seeker/applications`); // Example
    return { success: true, applicationId: newApplication.id };

  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "An unexpected error occurred.";
    console.error(`Server Action (${actionName}): Unexpected error for job ${jobId}. Message:`, message, err);
    return { success: false, error: "An unexpected server error occurred. Please try again." };
  }
}