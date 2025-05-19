// src/app/actions/employerJobActions.ts
"use server";

import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { JobPostSchemaType } from '@/lib/formSchemas';
import type { EmployerJobDisplayData, JobStatus } from '@/types'; // Ensure paths are correct

// --- Supabase Client Factory for Server Actions ---
// This helper is localized to this actions file. If used more broadly,
// it could be moved to a shared utility (e.g., src/lib/supabase/serverClient.ts).
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

// --- Result Type for createJobPost ---
interface CreateJobPostResult {
  success: boolean;
  jobId?: string;
  error?: string;
  errorDetails?: { field?: string; message: string }[];
}

/**
 * Server Action for creating a new job posting.
 */
export async function createJobPost(
  validatedData: JobPostSchemaType
): Promise<CreateJobPostResult> {
  const supabase = await getSupabaseServerClient();
  const actionName = "createJobPost";

  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      console.error(`Server Action (${actionName}): Authentication error.`, authError);
      return { success: false, error: "Authentication failed. Please log in again." };
    }

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
    };

    const { data: newJob, error: insertError } = await supabase
      .from('jobs')
      .insert(jobDataToInsert)
      .select('id')
      .single();

    if (insertError) {
      console.error(`Server Action (${actionName}): Supabase insert error.`, insertError);
      return { success: false, error: "Failed to post job. Code: " + insertError.code };
    }
    if (!newJob || !newJob.id) {
        console.error(`Server Action (${actionName}): Job created but no ID returned.`);
        return { success: false, error: "Job created but failed to retrieve its ID." };
    }
    console.log(`Server Action (${actionName}): Job posted successfully. Job ID: ${newJob.id}`);
    return { success: true, jobId: newJob.id };

  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "An unexpected error occurred.";
    console.error(`Server Action (${actionName}): Unexpected error.`, message, err);
    return { success: false, error: "An unexpected error occurred. Please try again." };
  }
}

// --- Result Type for getEmployerJobs ---
interface GetEmployerJobsResult {
  success: boolean;
  jobs?: EmployerJobDisplayData[];
  error?: string;
}

/**
 * Fetches all jobs posted by the currently authenticated employer.
 */
export async function getEmployerJobs(): Promise<GetEmployerJobsResult> {
  const supabase = await getSupabaseServerClient();
  const actionName = "getEmployerJobs";

  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      console.error(`Server Action (${actionName}): Authentication error.`, authError);
      return { success: false, error: "Authentication required." };
    }

    const { data: jobsData, error: fetchError } = await supabase
      .from('jobs')
      .select('id, title, status, created_at') // Only select fields needed for EmployerJobDisplayData
      .eq('employer_id', user.id)
      .order('created_at', { ascending: false });

    if (fetchError) {
      console.error(`Server Action (${actionName}): Error fetching jobs for employer ${user.id}.`, fetchError);
      return { success: false, error: "Failed to fetch your jobs. " + fetchError.message };
    }

    const displayJobs: EmployerJobDisplayData[] = (jobsData || []).map(job => ({
      id: job.id,
      title: job.title,
      status: job.status as JobStatus, // Casting, ensure JobStatus type matches DB enum
      createdAt: new Date(job.created_at).toLocaleDateString('en-US', { // Example formatting
        year: 'numeric', month: 'short', day: 'numeric' 
      }),
    }));
    
    console.log(`Server Action (${actionName}): Fetched ${displayJobs.length} jobs for employer ${user.id}.`);
    return { success: true, jobs: displayJobs };

  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "An unexpected error occurred.";
    console.error(`Server Action (${actionName}): Unexpected error.`, message, err);
    return { success: false, error: "An unexpected error occurred while fetching your jobs." };
  }
}