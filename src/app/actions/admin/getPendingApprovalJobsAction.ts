// src/app/actions/admin/getPendingApprovalJobsAction.ts
"use server";

import { ensureAdmin } from '@/app/actions/helpers/adminAuthUtils';
import { fetchPendingJobs } from '@/lib/data-access/admin';
import type { AdminPendingJobData } from '@/types';

interface GetPendingJobsResult {
  success: boolean;
  error?: string;
  jobs?: AdminPendingJobData[];
}

export async function getPendingApprovalJobs(): Promise<GetPendingJobsResult> {
  const actionName = "getPendingApprovalJobs";

  try {
    // THE FIX: The call is now clean, with no arguments.
    const { user: adminUser, error: adminError } = await ensureAdmin();
    if (adminError || !adminUser) {
      return { success: false, error: adminError };
    }

    const { data: rawJobs, error: fetchError } = await fetchPendingJobs();

    if (fetchError) {
      return { success: false, error: "Failed to fetch pending jobs." };
    }

    if (!rawJobs) {
      return { success: true, jobs: [] };
    }

    const displayJobs: AdminPendingJobData[] = rawJobs.map(job => ({
      id: job.id,
      title: job.title,
      companyName: job.company_name,
      createdAt: new Date(job.created_at).toLocaleDateString('en-US', {
        year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
      }),
      status: job.status,
      employerId: job.employer_id,
    }));
    
    return { success: true, jobs: displayJobs };

  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "An unexpected error occurred.";
    console.error(`[${actionName}] Unexpected error:`, message);
    return { success: false, error: "An unexpected server error occurred." };
  }
}