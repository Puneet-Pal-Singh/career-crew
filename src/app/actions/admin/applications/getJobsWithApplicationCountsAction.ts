// src/app/actions/admin/applications/getJobsWithApplicationCountsAction.ts
'use server';

import { ensureAdmin } from '@/app/actions/helpers/adminAuthUtils';
import { fetchJobsWithApplicationCounts, type RawJobWithApplicationCount } from '@/lib/data-access/admin/applications';
import type { AdminJobWithApplicationCount } from '@/types';

type ActionResult = 
  | { success: true; jobs: AdminJobWithApplicationCount[] }
  | { success: false; error: string };

// Mapper function adheres to SRP
const mapRawDataToAdminJobWithApplicationCount = (raw: RawJobWithApplicationCount): AdminJobWithApplicationCount => ({
  jobId: raw.job_id,
  jobTitle: raw.job_title,
  companyName: raw.company_name,
  applicationCount: Number(raw.application_count), // Ensure count is a number
});

export async function getJobsWithApplicationCounts(): Promise<ActionResult> {
  const adminCheck = await ensureAdmin();
  if (!adminCheck.user) {
    return { success: false, error: adminCheck.error };
  }

  const result = await fetchJobsWithApplicationCounts();
  if (result.error) {
    return { success: false, error: result.error.message };
  }

  const mappedData = result.data.map(mapRawDataToAdminJobWithApplicationCount);

  return { success: true, jobs: mappedData };
}