// src/lib/data-access/admin.ts
"use server";

import { getSupabaseServerClient } from '@/lib/supabase/serverClient';
import type { JobStatus } from '@/types';

/**
 * =================================================================================
 * DATA ACCESS LAYER (DAL) for Admin-related database queries.
 *
 * This layer's Single Responsibility is to abstract away the direct database queries
 * from the Server Actions. Server Actions will call these functions to get data,
 * but they won't know the implementation details (e.g., whether we are calling a
 * table directly or a PostgreSQL function). This follows the SOLID principles.
 * =================================================================================
 */

// Define the shape of the data returned directly from our SQL function.
// This is kept internal to the data-access layer.
interface PendingJobFromDb {
  id: number;
  title: string;
  company_name: string;
  created_at: string;
  status: JobStatus;
  employer_id: string;
}

// THE FIX: Define an explicit result type for the function.
type FetchPendingJobsResult = { data: PendingJobFromDb[]; error: null } | { data: null; error: Error };

/**
 * Fetches the list of jobs pending approval by calling our dedicated PostgreSQL function.
 * This function does NOT perform any business logic or security checks. Its only job
 * is to retrieve the raw data.
 * 
 * @returns {Promise<{ data: PendingJobFromDb[] | null; error: Error | null }>}
 */
export const fetchPendingJobs = async (): Promise<FetchPendingJobsResult> => {
  // We use a specific, non-admin client here because the security is handled
  // by the PostgreSQL function itself (SECURITY DEFINER).
  const supabase = await getSupabaseServerClient();

  const { data, error } = await supabase.rpc('get_pending_jobs_for_admin');

  if (error) {
    console.error("Data-Access Error in fetchPendingJobs:", error.message);
    return { data: null, error: new Error(error.message) };
  }

  return { data: data as PendingJobFromDb[], error: null };
};

// We can add more data-access functions here in the future, e.g.:
// export const fetchCompanyDetailsById = async (employerId: string) => { ... }