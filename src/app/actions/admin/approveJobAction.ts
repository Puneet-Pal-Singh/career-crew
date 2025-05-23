// src/app/actions/admin/approveJobAction.ts
"use server";

import { getSupabaseServerClient } from '@/lib/supabase/serverClient';
import { ensureAdmin } from '@/app/actions/helpers/adminAuthUtils';
import type { JobStatus } from '@/types'; // For casting status
// import { revalidatePath } from 'next/cache'; // For cache revalidation

interface AdminActionResult {
  success: boolean;
  error?: string;
}

/**
 * Approves a job posting. Requires ADMIN privileges.
 * @param jobId - The ID of the job to approve.
 */
export async function approveJob(jobId: string): Promise<AdminActionResult> {
  if (!jobId) {
    console.warn("approveJob Action: No jobId provided.");
    return { success: false, error: "Job ID is required for approval." };
  }

  const supabase = await getSupabaseServerClient();
  const actionName = "approveJob";

  try {
    const adminCheckResult = await ensureAdmin(supabase);
    if (adminCheckResult.error || !adminCheckResult.user) {
      return { success: false, error: adminCheckResult.error || "Admin privileges required." };
    }
    const adminUser = adminCheckResult.user;

    // console.log(`Server Action (${actionName}): Admin ${adminUser.id} attempting to approve job ${jobId}.`);

    const { error } = await supabase
      .from('jobs')
      .update({ 
        status: 'APPROVED' as JobStatus, 
        updated_at: new Date().toISOString() 
      })
      .eq('id', jobId)
      .eq('status', 'PENDING_APPROVAL' as JobStatus); // Only approve if currently pending

    if (error) {
      console.error(`Server Action (${actionName}): Error approving job ${jobId}. Message:`, error.message);
      return { success: false, error: `Failed to approve job: ${error.message}` };
    }

    console.log(`Server Action (${actionName}): Job ${jobId} approved by admin ${adminUser.id}.`);
    // Consider revalidating paths
    // revalidatePath('/dashboard/admin/pending-approvals');
    // revalidatePath('/jobs'); // Public listing
    // revalidatePath(`/jobs/${jobId}`); // Specific job detail

    return { success: true };

  } catch (err: unknown) { 
    const message = err instanceof Error ? err.message : "An unexpected error occurred.";
    console.error(`Server Action (${actionName}): Unexpected error for job ${jobId}. Message:`, message, err);
    return { success: false, error: message };
  }
}