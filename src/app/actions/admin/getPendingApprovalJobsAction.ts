// src/app/actions/admin/getPendingApprovalJobsAction.ts
"use server";

import { getSupabaseServerClient } from '@/lib/supabase/serverClient';
import { ensureAdmin } from '@/app/actions/helpers/adminAuthUtils'; // Import admin helper
import type { AdminPendingJobData } from '@/types'; // Assuming AdminPendingJobData is in types

interface AdminActionResult { // Common result structure
  success: boolean;
  error?: string;
}
interface GetPendingJobsResult extends AdminActionResult {
  jobs?: AdminPendingJobData[];
}

/**
 * Fetches jobs that are pending approval. Requires ADMIN privileges.
 */
export async function getPendingApprovalJobs(): Promise<GetPendingJobsResult> {
  const supabase = await getSupabaseServerClient();
  const actionName = "getPendingApprovalJobs";

  try {
    const adminCheckResult = await ensureAdmin(supabase);
    if (adminCheckResult.error || !adminCheckResult.user) {
      console.warn(`Server Action (${actionName}): Admin check failed. Error: ${adminCheckResult.error}`);
      return { success: false, error: adminCheckResult.error || "Admin privileges required." };
    }
    const adminUser = adminCheckResult.user; // Admin user profile is available

    console.log(`Server Action (${actionName}): Admin ${adminUser.id} fetching pending jobs.`);

    const { data: pendingJobsData, error: fetchError } = await supabase
      .from('jobs')
      .select('id, title, company_name, created_at') // Fields for AdminPendingJobData
      .eq('status', 'PENDING_APPROVAL')
      .order('created_at', { ascending: true }); // Oldest pending first

    if (fetchError) {
      console.error(`Server Action (${actionName}): Error fetching pending jobs. Message:`, fetchError.message);
      return { success: false, error: `Failed to fetch pending jobs: ${fetchError.message}` };
    }

    const displayJobs: AdminPendingJobData[] = (pendingJobsData || []).map(job => ({
      id: job.id,
      title: job.title,
      companyName: job.company_name,
      createdAt: new Date(job.created_at).toLocaleDateString('en-US', {
        year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
      }),
    }));
    
    return { success: true, jobs: displayJobs };

  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "An unexpected error occurred.";
    console.error(`Server Action (${actionName}): Unexpected error. Message:`, message, err);
    return { success: false, error: "An unexpected server error occurred." };
  }
}