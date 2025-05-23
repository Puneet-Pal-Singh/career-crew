// src/app/actions/query/getJobDetailsByIdAction.ts
"use server";

import { getSupabaseServerClient } from '@/lib/supabase/serverClient';
import type { JobDetailData, JobTypeOption } from '@/types'; // Your defined types

// Interface for the raw data structure from Supabase for a single job's details
interface RawJobDetailFromSupabase {
  id: string;
  title: string;
  company_name: string;
  company_logo_url: string | null;
  location: string;
  is_remote: boolean;
  job_type: string | null;
  salary_min: number | null;
  salary_max: number | null;
  salary_currency: string | null;
  created_at: string;
  description: string;
  requirements: string | null;
  application_email: string | null;
  application_url: string | null;
  status: string; // To ensure we only show 'APPROVED' jobs
}

/**
 * Fetches the full details for a single 'APPROVED' job by its ID.
 * @param jobId - The ID of the job to fetch.
 * @returns {Promise<JobDetailData | null>} The detailed job data, or null if not found or on error.
 */
export async function getJobDetailsById(jobId: string): Promise<JobDetailData | null> {
  if (!jobId) {
    console.warn("getJobDetailsById: No jobId provided.");
    return null;
  }

  const supabase = await getSupabaseServerClient();
  const actionName = "getJobDetailsById";
  // console.log(`Server Action (${actionName}): Fetching details for job ID: ${jobId}`);

  try {
    const { data: rawJob, error } = await supabase
      .from('jobs')
      .select(`
        id, title, company_name, company_logo_url, location, is_remote,
        job_type, salary_min, salary_max, salary_currency, created_at,
        description, requirements, application_email, application_url, status
      `)
      .eq('id', jobId)
      .eq('status', 'APPROVED') // Only fetch 'APPROVED' jobs for public detail view
      .single<RawJobDetailFromSupabase>();

    if (error) {
      if (error.code === 'PGRST116') { // Job not found or not approved
        console.log(`Server Action (${actionName}): Job not found or not approved for ID: ${jobId}`);
      } else {
        console.error(`Server Action (${actionName}): Supabase error for job ${jobId}. Message:`, error.message);
      }
      return null;
    }

    if (!rawJob) { // Should be caught by .single() error if PGRST116, but defensive check
      console.log(`Server Action (${actionName}): No job data returned for ID: ${jobId}.`);
      return null;
    }

    const jobDetail: JobDetailData = {
      id: rawJob.id,
      title: rawJob.title,
      companyName: rawJob.company_name,
      companyLogoUrl: rawJob.company_logo_url || '/company-logos/default-company-logo.svg',
      location: rawJob.location,
      isRemote: rawJob.is_remote,
      jobType: (rawJob.job_type as JobTypeOption) || undefined,
      salaryMin: rawJob.salary_min,
      salaryMax: rawJob.salary_max,
      salaryCurrency: rawJob.salary_currency,
      postedDate: new Date(rawJob.created_at).toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric',
      }),
      description: rawJob.description,
      requirements: rawJob.requirements,
      applicationEmail: rawJob.application_email,
      applicationUrl: rawJob.application_url,
    };
    
    // console.log(`Server Action (${actionName}): Fetched details for job ID: ${jobId}`);
    return jobDetail;

  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error occurred.";
    console.error(`Server Action (${actionName}): Unexpected error for job ID ${jobId}. Message:`, message, err);
    return null;
  }
}