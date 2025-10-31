// src/app/actions/admin/jobs/getAllJobsAction.ts

'use server';

import { fetchAllJobsForAdmin } from '@/lib/data-access/admin/jobs';
import { mapRawJobToAdminJobRowData } from '@/app/actions/helpers/jobDataMappers';
import { ensureAdmin } from '@/app/actions/helpers/adminAuthUtils'; // <-- 1. Import the gatekeeper
import type { AdminJobRowData } from '@/types';

type ActionResult = 
  | { success: true; jobs: AdminJobRowData[] }
  | { success: false; error: string };

/**
 * Server Action to get all jobs for the admin dashboard.
 * It acts as an orchestrator, first ensuring the user is an admin,
 * then fetching raw data and mapping it to a clean, UI-friendly format.
 */
export async function getAllJobs(): Promise<ActionResult> {
  // 2. Add the security check at the very beginning of the action.
  const adminCheck = await ensureAdmin();
  if (!adminCheck.user) {
    return { success: false, error: adminCheck.error };
  }

  // If the check passes, proceed with fetching the data.
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