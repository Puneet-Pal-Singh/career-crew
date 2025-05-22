// src/app/actions/jobDetailActions.ts
"use server";

import { getSupabaseServerClient } from '@/lib/supabase/serverClient'; // Use shared client
import type { JobDetailData, JobTypeOption } from '@/types'; // JobDetailData is already in your types

// Interface for the raw data structure from Supabase for a single job's details
interface RawJobDetailFromSupabase {
  id: string;
  title: string;
  company_name: string;
  company_logo_url: string | null;
  location: string;
  is_remote: boolean;
  job_type: string | null; // This will be from your job_type_option enum
  salary_min: number | null;
  salary_max: number | null;
  salary_currency: string | null;
  created_at: string; // ISO string timestamp
  description: string; // Full description
  requirements: string | null; // Full requirements
  application_email: string | null;
  application_url: string | null;
  status: string; // To ensure we only show 'APPROVED' jobs
  // employer_id: string; // Could be useful for "More jobs by this company" later
  // If joining with a company profile table in the future:
  // companies: { name: string, description: string, website: string } | null;
}

/**
 * Fetches the full details for a single 'APPROVED' job by its ID.
 * @param jobId - The ID of the job to fetch.
 * @returns {Promise<JobDetailData | null>} The detailed job data, or null if not found, not approved, or on error.
 */
export async function getJobDetailsById(jobId: string): Promise<JobDetailData | null> {
  if (!jobId) {
    console.warn("getJobDetailsById: No jobId provided.");
    return null;
  }

  const supabase = await getSupabaseServerClient();
  const actionName = "getJobDetailsById";
  console.log(`Server Action (${actionName}): Fetching details for job ID: ${jobId}`);

  try {
    // Select all necessary fields for the JobDetailData interface
    const { data: rawJob, error } = await supabase
      .from('jobs')
      .select(`
        id, title, company_name, company_logo_url, location, is_remote,
        job_type, salary_min, salary_max, salary_currency, created_at,
        description, requirements, application_email, application_url, status
      `)
      .eq('id', jobId)
      .eq('status', 'APPROVED') // Crucial: Only show publicly approved jobs
      .single(); // Expect only one job or null

    if (error) {
      if (error.code === 'PGRST116') { // PostgREST error for " dokładnie jeden wiersz (a znaleziono 0)" / "exactly one row (found 0)"
        console.log(`Server Action (${actionName}): Job not found or not approved for ID: ${jobId}`);
        return null;
      }
      console.error(`Server Action (${actionName}): Supabase error fetching job ${jobId}. Message:`, error.message);
      return null; // Return null on other errors as well
    }

    if (!rawJob) {
      console.log(`Server Action (${actionName}): No job data returned for ID: ${jobId} (might be missing or not approved).`);
      return null;
    }

    // Cast to ensure type safety before mapping
    const typedRawJob = rawJob as RawJobDetailFromSupabase;

    // Map raw Supabase data to the JobDetailData interface
    const jobDetail: JobDetailData = {
      id: typedRawJob.id,
      title: typedRawJob.title,
      companyName: typedRawJob.company_name,
      companyLogoUrl: typedRawJob.company_logo_url || '/company-logos/default-company-logo.svg', // Fallback
      location: typedRawJob.location,
      isRemote: typedRawJob.is_remote,
      jobType: (typedRawJob.job_type as JobTypeOption) || undefined, // Cast and provide undefined fallback
      salaryMin: typedRawJob.salary_min,
      salaryMax: typedRawJob.salary_max,
      salaryCurrency: typedRawJob.salary_currency,
      postedDate: new Date(typedRawJob.created_at).toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric',
      }), // More descriptive date
      description: typedRawJob.description,
      requirements: typedRawJob.requirements,
      applicationEmail: typedRawJob.application_email,
      applicationUrl: typedRawJob.application_url,
    };
    
    console.log(`Server Action (${actionName}): Successfully fetched details for job ID: ${jobId}`);
    return jobDetail;

  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error occurred.";
    console.error(`Server Action (${actionName}): Unexpected error for job ID ${jobId}. Message:`, message, err);
    return null; // Fallback to null
  }
}