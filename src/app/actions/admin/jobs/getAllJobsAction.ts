// src/app/actions/admin/jobs/getAllJobsAction.ts

'use server';

import { fetchAllJobsForAdmin } from '@/lib/data-access/admin/jobs';
import { mapRawJobToAdminJobRowData } from '@/app/actions/helpers/jobDataMappers';
import type { AdminJobRowData } from '@/types';

type ActionResult = 
  | { success: true; jobs: AdminJobRowData[] }
  | { success: false; error: string };

/**
 * Server Action to get all jobs for the admin dashboard.
 * It orchestrates fetching raw data and then mapping it to a clean,
 * UI-friendly format.
 */
export async function getAllJobs(): Promise<ActionResult> {
  const result = await fetchAllJobsForAdmin();

  if (result.error) {
    return {
      success: false,
      error: result.error.message,
    };
  }

  // Map the raw data to the clean data structure for the UI
  const mappedJobs = result.data.map(mapRawJobToAdminJobRowData);

  return {
    success: true,
    jobs: mappedJobs,
  };
}