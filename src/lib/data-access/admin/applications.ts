// src/lib/data-access/admin/applications.ts
'use server';

import { getSupabaseServerClient } from '@/lib/supabase/serverClient';

// Define the raw data shapes returned directly from our RPCs
export interface RawJobWithApplicationCount {
  job_id: number;
  job_title: string;      
  company_name: string;   
  application_count: number;
}

export interface RawApplicationForJob {
  application_id: string; // uuid
  seeker_full_name: string; 
  seeker_email: string;     
  status: string;           // The RPC returns the enum as a string
  date_applied: string;     // ISO timestamptz
}

type FetchJobsWithCountsResult = { data: RawJobWithApplicationCount[]; error: null } | { data: null; error: Error };
type FetchApplicationsForJobResult = { data: RawApplicationForJob[]; error: null } | { data: null; error: Error };

/**
 * Fetches the list of jobs and their application counts from the database.
 */
export const fetchJobsWithApplicationCounts = async (): Promise<FetchJobsWithCountsResult> => {
  const supabase = await getSupabaseServerClient();
  const { data, error } = await supabase.rpc('get_jobs_with_application_counts_for_admin');

  if (error) {
    console.error('Data-Access Error in fetchJobsWithApplicationCounts:', error.message);
    return { data: null, error: new Error('Failed to fetch jobs with application counts.') };
  }
  return { data, error: null };
};

/**
 * Fetches all applications for a specific job from the database.
 */
export const fetchApplicationsForJob = async (jobId: number): Promise<FetchApplicationsForJobResult> => {
  const supabase = await getSupabaseServerClient();
  const { data, error } = await supabase.rpc('get_applications_for_job_for_admin', { job_id_param: jobId });

  if (error) {
    console.error(`Data-Access Error in fetchApplicationsForJob for job ${jobId}:`, error.message);
    return { data: null, error: new Error(`Failed to fetch applications for job ${jobId}.`) };
  }
  return { data, error: null };
};