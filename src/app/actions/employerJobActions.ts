// src/app/actions/employerJobActions.ts
"use server";

import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers'; // For Next.js 15, cookies() returns a Promise
import type { JobPostSchemaType } from '@/lib/formSchemas'; // Assuming schema is in lib

// --- Supabase Client Factory for Server Actions ---
// Correctly handles asynchronous cookie retrieval for Next.js 15+
const getSupabaseServerClient = async () => {
  const cookieStoreInstance = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name: string) => cookieStoreInstance.get(name)?.value,
        set: (name: string, value: string, options: CookieOptions) => {
          try {
            cookieStoreInstance.set(name, value, options);
          } catch (error) {
            console.error(`Server Action (getSupabaseServerClient): Failed to set cookie "${name}". Error:`, error);
          }
        },
        remove: (name: string, options: CookieOptions) => {
          try {
            cookieStoreInstance.set(name, '', { ...options, maxAge: 0 });
          } catch (error) {
            console.error(`Server Action (getSupabaseServerClient): Failed to remove cookie "${name}". Error:`, error);
          }
        },
      },
    }
  );
};

interface CreateJobPostResult {
  success: boolean;
  jobId?: string;
  error?: string;
  errorDetails?: { field?: string; message: string }[]; // For field-specific errors
}

/**
 * Server Action for creating a new job posting.
 * @param validatedData - The job post data, already validated by a Zod schema.
 * @returns {Promise<CreateJobPostResult>} Result of the operation.
 */
export async function createJobPost(
  validatedData: JobPostSchemaType
): Promise<CreateJobPostResult> {
  const supabase = await getSupabaseServerClient();
  const actionName = "createJobPost";

  try {
    // 1. Get current authenticated user (employer)
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      console.error(`Server Action (${actionName}): Authentication error.`, authError);
      return { success: false, error: "Authentication failed. Please log in again." };
    }

    // 2. Construct the job data for Supabase
    // The status will default to 'PENDING_APPROVAL' as per your jobs table schema.
    const jobDataToInsert = {
      employer_id: user.id,
      title: validatedData.title,
      company_name: validatedData.company_name,
      company_logo_url: validatedData.company_logo_url || null,
      location: validatedData.location,
      job_type: validatedData.job_type,
      description: validatedData.description,
      requirements: validatedData.requirements || null,
      is_remote: validatedData.is_remote,
      salary_min: validatedData.salary_min || null,
      salary_max: validatedData.salary_max || null,
      salary_currency: validatedData.salary_currency,
      application_email: validatedData.application_email || null,
      application_url: validatedData.application_url || null,
      // 'status' defaults to 'PENDING_APPROVAL' in your DB schema.
      // 'created_at' and 'updated_at' also have DB defaults.
    };

    console.log(`Server Action (${actionName}): Attempting to insert job data for user ${user.id}:`, jobDataToInsert);

    // 3. Insert into Supabase 'jobs' table
    const { data: newJob, error: insertError } = await supabase
      .from('jobs')
      .insert(jobDataToInsert)
      .select('id') // Select the ID of the newly created job
      .single();    // Expect a single record to be returned

    if (insertError) {
      console.error(`Server Action (${actionName}): Supabase insert error.`, insertError);
      // Provide a more generic error message to the client
      return { success: false, error: "Failed to post job. Please try again later. Code: " + insertError.code };
    }

    if (!newJob || !newJob.id) {
        console.error(`Server Action (${actionName}): Job created but no ID returned.`);
        return { success: false, error: "Job created but failed to retrieve its ID." };
    }

    console.log(`Server Action (${actionName}): Job posted successfully. Job ID: ${newJob.id}`);
    // Optionally, revalidate paths if this job should appear immediately somewhere (e.g., employer's job list)
    // revalidatePath('/dashboard/my-jobs'); 
    return { success: true, jobId: newJob.id };

  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "An unexpected error occurred.";
    console.error(`Server Action (${actionName}): Unexpected error.`, message, err);
    return { success: false, error: "An unexpected error occurred. Please try again." };
  }
}