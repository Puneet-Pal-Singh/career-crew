// src/app/actions/employer/jobs/getEmployerJobsAction.ts
"use server";

import { getSupabaseServerClient } from '@/lib/supabase/serverClient';
import type { EmployerJobDisplayData, JobStatus } from '@/types'; // Your defined types

// Result type can be defined here or imported if shared
interface GetEmployerJobsResult {
  success: boolean;
  jobs?: EmployerJobDisplayData[];
  error?: string;
}

/**
 * Fetches all jobs posted by the currently authenticated employer.
 * 
 * @returns {Promise<GetEmployerJobsResult>} An object containing the success status, 
 *                                            an array of jobs, or an error message.
 */
export async function getEmployerJobs(): Promise<GetEmployerJobsResult> {
  const supabase = await getSupabaseServerClient();
  const actionName = "getEmployerJobs"; // For logging context

  try {
    // 1. Get current authenticated user
    const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();

    if (authError || !authUser) {
      console.error(`Server Action (${actionName}): Authentication error.`, authError);
      return { success: false, error: "Authentication required to view your job postings." };
    }

    // 2. Fetch jobs for this employer from the 'jobs' table
    const { data: jobsData, error: fetchError } = await supabase
      .from('jobs')
      .select('id, title, status, created_at') // Select only fields needed for EmployerJobDisplayData
      .eq('employer_id', authUser.id)
      .order('created_at', { ascending: false }); // Show newest jobs first

    if (fetchError) {
      console.error(`Server Action (${actionName}): Error fetching jobs for employer ${authUser.id}. Message:`, fetchError.message);
      return { success: false, error: "Failed to fetch your job postings. " + fetchError.message };
    }

    // If jobsData is null (no error but no data), treat as empty array
    const employerJobs: EmployerJobDisplayData[] = (jobsData || []).map(job => ({
      id: job.id,
      title: job.title,
      status: job.status as JobStatus, // Cast to your JobStatus enum; ensure it matches DB values
      createdAt: new Date(job.created_at).toLocaleDateString('en-US', {
        year: 'numeric', month: 'short', day: 'numeric' 
      }),
    }));
    
    console.log(`Server Action (${actionName}): Fetched ${employerJobs.length} jobs for employer ${authUser.id}.`);
    return { success: true, jobs: employerJobs };

  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "An unexpected error occurred.";
    console.error(`Server Action (${actionName}): Unexpected error.`, message, err);
    return { success: false, error: "An unexpected error occurred while fetching your job postings." };
  }
}