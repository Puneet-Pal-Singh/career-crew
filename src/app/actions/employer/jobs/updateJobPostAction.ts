// src/app/actions/employer/jobs/updateJobPostAction.ts
"use server";

import { getSupabaseServerClient } from '@/lib/supabase/serverClient';
import { verifyJobOwnership } from '@/app/actions/helpers/jobOwnershipUtils'; // Import the helper
import type { JobPostSchemaType } from '@/lib/formSchemas';
import type { JobStatus } from '@/types'; // For updating status
// import { revalidatePath } from 'next/cache'; // For revalidating cache after update

interface UpdateJobPostResult {
  success: boolean;
  jobId?: string; // Return jobId for potential redirection or UI update
  error?: string;
  errorDetails?: { field?: string; message: string }[]; // For field-specific server errors
}

/**
 * Server Action for an authenticated employer to update their existing job posting.
 * If an 'APPROVED' job is edited, its status may be reset to 'PENDING_APPROVAL'.
 * 
 * @param jobId - The ID of the job to update.
 * @param validatedData - The new job data, assumed to be validated by Zod on the client.
 * @returns {Promise<UpdateJobPostResult>} The result of the job update operation.
 */
export async function updateJobPost(
  jobId: string,
  validatedData: JobPostSchemaType
): Promise<UpdateJobPostResult> {
  const supabase = await getSupabaseServerClient();
  const actionName = "updateJobPost";

  if (!jobId) {
    console.warn(`Server Action (${actionName}): No jobId provided for update.`);
    return { success: false, error: "Job ID is required to update a posting." };
  }

  try {
    // 1. Verify ownership and get authenticated user
    const ownershipResult = await verifyJobOwnership(supabase, jobId);
    // ** APPLIED FIX HERE **
    if (ownershipResult.error || !ownershipResult.authUser) {
      return { success: false, error: ownershipResult.error || "User authentication failed for ownership check." };
    }
    const { authUser } = ownershipResult; // Now authUser is AuthUser

    console.log(`Server Action (${actionName}): User ${authUser.id} attempting to update job ${jobId}.`);

    // 2. Determine if status needs to be changed (e.g., back to PENDING_APPROVAL)
    const { data: currentJob, error: currentJobError } = await supabase
      .from('jobs')
      .select('status')
      .eq('id', jobId)
      .single();

    if (currentJobError || !currentJob) {
        console.error(`Server Action (${actionName}): Could not fetch current status for job ${jobId}.`, currentJobError);
        return { success: false, error: "Could not verify current job status before update." };
    }
    
    let newStatus: JobStatus | undefined = undefined;
    // Business logic: If an approved job is edited, it goes back to pending.
    // Also, if a rejected or draft job is edited, it should be resubmitted as pending.
    if (currentJob.status === 'APPROVED' || currentJob.status === 'REJECTED' || currentJob.status === 'DRAFT') {
        newStatus = 'PENDING_APPROVAL';
        console.log(`Server Action (${actionName}): Job ${jobId} status was ${currentJob.status}, setting to PENDING_APPROVAL after edit.`);
    }
    // If status is already PENDING_APPROVAL or FILLED/ARCHIVED, we might not change it here,
    // or have specific logic if editing those is allowed. For now, this covers main cases.

    // 3. Prepare data for update
    const jobDataToUpdate = {
      title: validatedData.title,
      company_name: validatedData.company_name,
      company_logo_url: validatedData.company_logo_url || null,
      location: validatedData.location,
      job_type: validatedData.job_type,
      description: validatedData.description,
      requirements: validatedData.requirements || null,
      is_remote: validatedData.is_remote,
      salary_min: validatedData.salary_min ?? null,
      salary_max: validatedData.salary_max ?? null,
      salary_currency: validatedData.salary_currency,
      application_email: validatedData.application_email || null,
      application_url: validatedData.application_url || null,
      updated_at: new Date().toISOString(), // Always update 'updated_at'
      ...(newStatus && { status: newStatus }), // Conditionally include status if it changed
      // Add the skills from the form to be saved in the 'tags' column.
      // Only include the 'tags' property in the update object if `skills` is not undefined.
      // This prevents accidentally wiping out existing tags with an empty array.
      ...(validatedData.skills !== undefined && { tags: validatedData.skills }),
    };
    
    // 4. Update the job in Supabase
    const { error: updateError } = await supabase
      .from('jobs')
      .update(jobDataToUpdate)
      .eq('id', jobId)
      .eq('employer_id', authUser.id); // Ensure update only happens if employer_id still matches (RLS also protects this)

    if (updateError) {
      console.error(`Server Action (${actionName}): Supabase update error for job ${jobId}. Code: ${updateError.code}, Message: ${updateError.message}`, updateError);
      return { success: false, error: `Failed to update job posting: ${updateError.message}` };
    }

    console.log(`Server Action (${actionName}): Job ${jobId} updated successfully by user ${authUser.id}.`);
    
    // Revalidate paths to ensure fresh data is shown
    // revalidatePath('/dashboard/my-jobs'); // Employer's list of jobs
    // if (newStatus === 'APPROVED' || currentJob.status === 'APPROVED') {
    //   revalidatePath(`/jobs/${jobId}`); // Public job detail page if it was or becomes live
    //   revalidatePath('/jobs'); // Public job listings
    // }
    // if (newStatus === 'PENDING_APPROVAL') {
    //   revalidatePath('/dashboard/admin/pending-approvals'); // Admin's pending list
    // }

    return { success: true, jobId: jobId };

  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "An unexpected error occurred.";
    console.error(`Server Action (${actionName}): Unexpected error for job ${jobId}. Message:`, message, err);
    return { success: false, error: message };
  }
}