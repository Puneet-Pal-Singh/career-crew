// src/app/actions/employer/createJobPostAction.ts
"use server";

import { getSupabaseServerClient } from '@/lib/supabase/serverClient';
import type { JobPostSchemaType } from '@/lib/formSchemas';
// Result type can be defined here or imported if shared by other create actions
interface CreateJobPostResult {
  success: boolean;
  jobId?: string;
  error?: string;
  errorDetails?: { field?: string; message: string }[]; // For potential field-specific server errors
}

/**
 * Server Action for an authenticated employer to create a new job posting.
 * The job status will default to 'PENDING_APPROVAL' based on the database schema.
 * 
 * @param validatedData - The job post data, assumed to be validated by Zod on the client.
 * @returns {Promise<CreateJobPostResult>} The result of the job creation operation.
 */
export async function createJobPost(
  validatedData: JobPostSchemaType
): Promise<CreateJobPostResult> {
  const supabase = await getSupabaseServerClient();
  const actionName = "createJobPost"; // For logging context

  try {
    // 1. Get current authenticated user (must be an employer to post)
    const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();

    if (authError || !authUser) {
      console.error(`Server Action (${actionName}): Authentication error.`, authError);
      return { success: false, error: "Authentication failed. Please log in to post a job." };
    }

    // Optional: Add a check here if only users with role 'EMPLOYER' can post.
    // This would involve fetching their profile. For MVP, any authenticated user can post,
    // and their `employer_id` is set. The dashboard UI would typically only show the
    // "Post Job" button to users identified as employers.
    // const { data: profile } = await supabase.from('profiles').select('role').eq('id', authUser.id).single();
    // if (profile?.role !== 'EMPLOYER') {
    //   return { success: false, error: "Only employers can post jobs." };
    // }

    // 2. Prepare data for insertion
    const jobDataToInsert = {
      employer_id: authUser.id, // Link the job to the authenticated user
      title: validatedData.title,
      company_name: validatedData.company_name,
      company_logo_url: validatedData.company_logo_url || null,
      location: validatedData.location,
      job_type: validatedData.job_type,
      description: validatedData.description,
      requirements: validatedData.requirements || null,
      is_remote: validatedData.is_remote,
      salary_min: validatedData.salary_min ?? null, // Ensure undefined from form becomes null for DB
      salary_max: validatedData.salary_max ?? null, // Ensure undefined from form becomes null for DB
      salary_currency: validatedData.salary_currency,
      application_email: validatedData.application_email || null,
      application_url: validatedData.application_url || null,
      // 'status' will default to 'PENDING_APPROVAL' in the database schema.
      // 'created_at' and 'updated_at' will also use database defaults.
    };

    // 3. Insert into Supabase 'jobs' table
    const { data: newJob, error: insertError } = await supabase
      .from('jobs')
      .insert(jobDataToInsert)
      .select('id') // Select the ID of the newly created job
      .single();    // Expect a single record to be returned

    if (insertError) {
      console.error(`Server Action (${actionName}): Supabase insert error. Code: ${insertError.code}, Message: ${insertError.message}`, insertError);
      // You could map specific DB error codes (e.g., unique constraint violation) to user-friendly messages
      return { success: false, error: `Failed to post job. Database error: ${insertError.message}` };
    }

    if (!newJob || !newJob.id) {
        console.error(`Server Action (${actionName}): Job possibly created but no ID was returned.`);
        return { success: false, error: "Job posting created, but failed to retrieve confirmation ID." };
    }

    console.log(`Server Action (${actionName}): Job posted successfully by user ${authUser.id}. Job ID: ${newJob.id}`);
    // Consider revalidating relevant paths, e.g., employer's job list page.
    // import { revalidatePath } from 'next/cache';
    // revalidatePath('/dashboard/job-listings'); // Or your chosen path

    return { success: true, jobId: newJob.id };

  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "An unexpected error occurred during job creation.";
    console.error(`Server Action (${actionName}): Unexpected error.`, message, err);
    return { success: false, error: message };
  }
}