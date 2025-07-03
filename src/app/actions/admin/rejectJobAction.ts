// src/app/actions/admin/rejectJobAction.ts
"use server";

import { getSupabaseServerClient } from '@/lib/supabase/serverClient';
import { ensureAdmin } from '@/app/actions/helpers/adminAuthUtils';
import type { JobStatus } from '@/types';
// import { revalidatePath } from 'next/cache';

interface AdminActionResult {
  success: boolean;
  error?: string;
}

/**
 * Rejects a job posting. Requires ADMIN privileges.
 * @param jobId - The ID of the job to reject.
 */
export async function rejectJob(jobId: string): Promise<AdminActionResult> {
  if (!jobId) {
    console.warn("rejectJob Action: No jobId provided.");
    return { success: false, error: "Job ID is required for rejection." };
  }

  const supabase = await getSupabaseServerClient();
  const actionName = "rejectJob";
  
  try {
    const adminCheckResult = await ensureAdmin(supabase);
    if (adminCheckResult.error || !adminCheckResult.user) {
      return { success: false, error: adminCheckResult.error || "Admin privileges required." };
    }
    const adminUser = adminCheckResult.user;

    // console.log(`Server Action (${actionName}): Admin ${adminUser.id} attempting to reject job ${jobId}.`);

    const { error } = await supabase
      .from('jobs')
      .update({ 
        status: 'REJECTED' as JobStatus, 
        updated_at: new Date().toISOString() 
      })
      .eq('id', jobId)
      .eq('status', 'PENDING_APPROVAL' as JobStatus); // Only reject if currently pending

    if (error) {
      console.error(`Server Action (${actionName}): Error rejecting job ${jobId}. Message:`, error.message);
      return { success: false, error: `Failed to reject job: ${error.message}` };
    }
    
    console.log(`Server Action (${actionName}): Job ${jobId} rejected by admin ${adminUser.id}.`);
    // revalidatePath('/dashboard/admin/pending-approvals');

    return { success: true };

  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "An unexpected error occurred.";
    console.error(`Server Action (${actionName}): Unexpected error for job ${jobId}. Message:`, message, err);
    return { success: false, error: message };
  }
}