// src/app/actions/admin/applications/getApplicationsForJobAction.ts
'use server';

import { ensureAdmin } from '@/app/actions/helpers/adminAuthUtils';
import { fetchApplicationsForJob, type RawApplicationForJob } from '@/lib/data-access/admin/applications';
import { fetchJobByIdForAdmin } from '@/lib/data-access/admin/jobs'; // <-- Import the job fetcher
import type { AdminApplicationForJob, ApplicationStatusOption } from '@/types';

// The new return type now includes the job title for the page header
type ActionResult = 
  | { success: true; applications: AdminApplicationForJob[]; jobTitle: string; }
  | { success: false; error: string };

// Mapper function is unchanged
const mapRawDataToAdminApplicationForJob = (raw: RawApplicationForJob): AdminApplicationForJob => ({
  applicationId: raw.application_id,
  seekerFullName: raw.seeker_full_name,
  seekerEmail: raw.seeker_email,
  status: raw.status as ApplicationStatusOption,
  dateApplied: new Date(raw.date_applied).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }),
});

export async function getApplicationsForJob(jobId: number): Promise<ActionResult> {
  const adminCheck = await ensureAdmin();
  if (!adminCheck.user) {
    return { success: false, error: adminCheck.error };
  }

  // Use Promise.all to fetch both applications and job details concurrently
  const [applicationsResult, jobResult] = await Promise.all([
    fetchApplicationsForJob(jobId),
    fetchJobByIdForAdmin(String(jobId)) // fetchJobByIdForAdmin expects a string
  ]);

  if (applicationsResult.error) {
    return { success: false, error: applicationsResult.error.message };
  }
  if (jobResult.error) {
    return { success: false, error: jobResult.error.message };
  }
  
  const mappedApplications = applicationsResult.data.map(mapRawDataToAdminApplicationForJob);

  return { 
    success: true, 
    applications: mappedApplications,
    jobTitle: jobResult.data.title // <-- Include the job title in the success response
  };
}