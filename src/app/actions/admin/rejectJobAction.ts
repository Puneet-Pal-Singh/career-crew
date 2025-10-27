// src/app/actions/admin/rejectJobAction.ts
"use server";

import { getSupabaseServerClient } from '@/lib/supabase/serverClient';
import { ensureAdmin } from '@/app/actions/helpers/adminAuthUtils';
import type { JobStatus } from '@/types';

interface AdminActionResult {
  success: boolean;
  error?: string;
}

/**
 * Rejects a job posting. Requires ADMIN privileges.
 * @param {number} jobId - The ID of the job to reject.
 */
export async function rejectJob(jobId: number): Promise<AdminActionResult> {
  if (!jobId) {
    return { success: false, error: "Job ID is required for rejection." };
  }

  const actionName = "rejectJob";
  
  try {
    // THE FIX: Call ensureAdmin() with no arguments, as per our refactor.
    const { user: adminUser, error: adminError } = await ensureAdmin();
    if (adminError || !adminUser) {
      return { success: false, error: adminError };
    }

    const supabase = await getSupabaseServerClient();
    const { error } = await supabase
      .from('jobs')
      .update({ 
        status: 'REJECTED' as JobStatus, 
        updated_at: new Date().toISOString() 
      })
      .eq('id', jobId)
      .eq('status', 'PENDING_APPROVAL' as JobStatus);

    if (error) {
      console.error(`[${actionName}] Error rejecting job ${jobId}:`, error.message);
      return { success: false, error: `Failed to reject job: ${error.message}` };
    }
    
    console.log(`[${actionName}] Job ${jobId} rejected by admin ${adminUser.id}.`);
    
    return { success: true };

  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "An unexpected error occurred.";
    console.error(`[${actionName}] Unexpected error for job ${jobId}:`, message);
    return { success: false, error: message };
  }
}