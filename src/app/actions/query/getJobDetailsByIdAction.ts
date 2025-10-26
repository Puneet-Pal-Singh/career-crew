// src/app/actions/query/getJobDetailsByIdAction.ts
"use server";

import { getSupabaseServerClient } from '@/lib/supabase/serverClient';
import type { JobDetailData, UserRole } from '@/types'; 
// Make sure your mapper import path is correct after the folder refactor
import { mapRawJobToJobDetailData, type RawJobDataForDetail } from '@/app/actions/helpers/jobDataMappers';
import { unstable_noStore as noStore } from 'next/cache';

// Use a Discriminated Union
type ActionResult = 
  | { success: true; job: JobDetailData }
  | { success: false; error: 'NOT_FOUND' | 'NOT_PERMITTED' };

export async function getJobDetailsByIdAction(jobId: number): Promise<ActionResult> {
  noStore();
  if (!Number.isFinite(jobId) || jobId <= 0) {
    return { success: false, error: 'NOT_FOUND' };
  }

  const supabase = await getSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  try {
    const { data: rawJob, error } = await supabase
      .from('jobs')
      .select(`*`)
      .eq('id', jobId)
      .single<RawJobDataForDetail>();

    if (error || !rawJob) {
      return { success: false, error: 'NOT_FOUND' };
    }

    // Rule 1: Allow public access if the job is approved.
    if (rawJob.status === 'APPROVED') {
      return { success: true, job: mapRawJobToJobDetailData(rawJob) };
    }

    // If the job is NOT approved, we now check for special permissions.
    if (user) {
      // Rule 2: Allow the employer who owns the job to see it.
      if (user.id === rawJob.employer_id) {
        // The mapper function needs to know the status, so we pass the whole rawJob
        return { success: true, job: mapRawJobToJobDetailData(rawJob) };
      }

      // THE FIX: Rule 3: Allow any user with the 'ADMIN' role to see it.
      const userRole = user.app_metadata?.role as UserRole;
      if (userRole === 'ADMIN') {
        return { success: true, job: mapRawJobToJobDetailData(rawJob) };
      }
    }

    // If none of the above rules are met, deny access.
    return { success: false, error: 'NOT_PERMITTED' };

  } catch (err) { // <-- FIX: Properly type the caught error
    const errorMessage = err instanceof Error ? err.message : "An unknown error occurred";
    console.error(`getJobDetailsByIdAction: Unexpected error for job ID ${jobId}.`, errorMessage);
    return { success: false, error: 'NOT_FOUND' };
  }
}