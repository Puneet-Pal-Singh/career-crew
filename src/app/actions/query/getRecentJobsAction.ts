// src/app/actions/query/getRecentJobsAction.ts
"use server";

// ✅ THE DEFINITIVE FIX: Import the noStore function from Next.js cache.
import { unstable_noStore as noStore } from 'next/cache';
import { getSupabaseServerClient } from '@/lib/supabase/serverClient';
import type { JobCardData } from '@/types';
import { mapRawJobToJobCardData, type RawJobDataForCard } from '@/app/actions/helpers/jobDataMappers'; // Import helper

/**
 * Fetches a limited list of recent, 'APPROVED' job postings for display on sections like a landing page.
 * @returns {Promise<JobCardData[]>} A promise resolving to an array of job card data.
 */
export async function getRecentJobs(): Promise<JobCardData[]> {
  // ✅ THE DEFINITIVE FIX: Call noStore() at the very beginning of the function.
  // This explicitly opts this specific data fetch out of all caching.
  noStore();

  const supabase = await getSupabaseServerClient();
  const actionName = "getRecentJobs";
  // console.log(`Server Action (${actionName}): Initiating fetch.`); // Keep logs minimal if not debugging

  try {
    const JOB_QUERY_COLUMNS_FOR_CARD = `
      id, title, company_name, company_logo_url, location, job_type, 
      is_remote, salary_min, salary_max, salary_currency, created_at
    `;

    // ✅ TYPE-SAFETY FIX: Use the generic version of .select()
    // This tells Supabase what shape to expect for each object in the array,
    // eliminating the need for any type assertions later.
    const { data: rawJobsData, error } = await supabase
      .from('jobs')
      .select<string, RawJobDataForCard>(JOB_QUERY_COLUMNS_FOR_CARD)  // <-- GENERIC IS APPLIED HERE
      .eq('status', 'APPROVED')
      .order('created_at', { ascending: false })
      .limit(6); // Configurable limit for "recent" jobs

    if (error) {
      console.error(`Server Action (${actionName}): Supabase error. Message:`, error.message);
      return [];
    }

    if (!rawJobsData) {
      return [];
    }
    
    // `rawJobsData` is now guaranteed to be `RawJobDataForCard[]`, so no unsafe casting is needed.
    const formattedJobs = rawJobsData.map(mapRawJobToJobCardData);
    return formattedJobs;

    // console.log(`Server Action (${actionName}): Fetched ${formattedJobs.length} job(s).`);
    return formattedJobs;

  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error during job fetching.";
    console.error(`Server Action (${actionName}): Unexpected error. Message:`, message, err);
    return [];
  }
}