// src/app/actions/query/getJobDetailsByIdAction.ts
"use server";

import { getSupabaseServerClient } from '@/lib/supabase/serverClient';
import type { JobDetailData } from '@/types';
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

    if (rawJob.status === 'APPROVED') {
      return { success: true, job: mapRawJobToJobDetailData(rawJob) };
    }

    if (user && user.id === rawJob.employer_id) {
      // The mapper function needs to know the status, so we pass the whole rawJob
      return { success: true, job: mapRawJobToJobDetailData(rawJob) };
    }

    return { success: false, error: 'NOT_PERMITTED' };

  } catch (err) { // <-- FIX: Properly type the caught error
    const errorMessage = err instanceof Error ? err.message : "An unknown error occurred";
    console.error(`getJobDetailsByIdAction: Unexpected error for job ID ${jobId}.`, errorMessage);
    return { success: false, error: 'NOT_FOUND' };
  }
}