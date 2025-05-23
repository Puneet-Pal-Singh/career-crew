// src/app/actions/query/getRecentJobsAction.ts
"use server";

import { getSupabaseServerClient } from '@/lib/supabase/serverClient';
import type { JobCardData } from '@/types';
import { mapRawJobToJobCardData, type RawJobDataForCard } from '@/app/actions/helpers/jobDataMappers'; // Import helper

/**
 * Fetches a limited list of recent, 'APPROVED' job postings for display on sections like a landing page.
 * @returns {Promise<JobCardData[]>} A promise resolving to an array of job card data.
 */
export async function getRecentJobs(): Promise<JobCardData[]> {
  const supabase = await getSupabaseServerClient();
  const actionName = "getRecentJobs";
  // console.log(`Server Action (${actionName}): Initiating fetch.`); // Keep logs minimal if not debugging

  try {
    const JOB_QUERY_COLUMNS_FOR_CARD = `
      id, title, company_name, company_logo_url, location, job_type, 
      is_remote, salary_min, salary_max, salary_currency, created_at
    `;

    const { data: rawJobsData, error } = await supabase
      .from('jobs')
      .select(JOB_QUERY_COLUMNS_FOR_CARD)
      .eq('status', 'APPROVED')
      .order('created_at', { ascending: false })
      .limit(6); // Configurable limit for "recent" jobs

    if (error) {
      console.error(`Server Action (${actionName}): Supabase error. Message:`, error.message);
      return [];
    }

    if (!rawJobsData || rawJobsData.length === 0) {
      // console.log(`Server Action (${actionName}): No 'APPROVED' jobs found.`); // Can be noisy
      return [];
    }
    
    const typedRawJobs = rawJobsData as RawJobDataForCard[]; // Assume structure matches
    const formattedJobs = typedRawJobs.map(mapRawJobToJobCardData);

    // console.log(`Server Action (${actionName}): Fetched ${formattedJobs.length} job(s).`);
    return formattedJobs;

  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error during job fetching.";
    console.error(`Server Action (${actionName}): Unexpected error. Message:`, message, err);
    return [];
  }
}