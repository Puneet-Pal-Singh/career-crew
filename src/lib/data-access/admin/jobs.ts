// src/lib/data-access/admin/jobs.ts

'use server';

import { getSupabaseServerClient } from '@/lib/supabase/serverClient';
import type { RawAdminJobData } from '@/app/actions/helpers/jobDataMappers';
import type { JobDetailData } from '@/types';

// The raw data from Supabase will match this shape
type RawJobDetail = Omit<JobDetailData, 'postedDate' | 'jobType' | 'companyName' | 'companyLogoUrl' | 'isRemote' | 'salaryMin' | 'salaryMax' | 'salaryCurrency' | 'employerId'> & {
  created_at: string,
  job_type: string,
  company_name: string,
  company_logo_url: string | null,
  is_remote: boolean,
  salary_min: number | null,
  salary_max: number | null,
  salary_currency: string | null,
  employer_id: string,
};


type FetchAllJobsResult = { data: RawAdminJobData[]; error: null } | { data: null; error: Error };
type FetchJobByIdResult = { data: RawJobDetail; error: null } | { data: null; error: Error };

/**
 * Fetches ALL raw job data from the database using the secure RPC function.
 */
export const fetchAllJobsForAdmin = async (): Promise<FetchAllJobsResult> => {
  const supabase = await getSupabaseServerClient();
  const { data, error } = await supabase.rpc('get_all_jobs_for_admin');

  if (error) {
    console.error('Data-Access Error in fetchAllJobsForAdmin:', error.message);
    return { data: null, error: new Error('Failed to fetch jobs for admin.') };
  }

  return { data: data as RawAdminJobData[], error: null };
};

/**
 * Fetches a single raw job by its ID for an admin.
 */
export const fetchJobByIdForAdmin = async (jobId: string): Promise<FetchJobByIdResult> => {
    const supabase = await getSupabaseServerClient();
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('id', jobId)
      .single();

    if (error) {
      console.error(`Data-Access Error fetching job ${jobId}:`, error.message);
      return { data: null, error: new Error('Failed to fetch job data for editing.') };
    }

    return { data: data as RawJobDetail, error: null };
}