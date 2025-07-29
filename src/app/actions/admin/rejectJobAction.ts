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
 * @param jobId - The ID (string or number) of the job to reject.
 */
// FIX: The function now accepts a string or a number for the jobId.
export async function rejectJob(jobId: string | number): Promise<AdminActionResult> {
  if (!jobId) {
    console.warn("rejectJob Action: No jobId provided.");
    return { success: false, error: "Job ID is required for rejection." };
  }
  // Coerce to string for consistent use in Supabase client and logging.
  const idAsString = String(jobId);

  const supabase = await getSupabaseServerClient();
  const actionName = "rejectJob";
  
  try {
    const adminCheckResult = await ensureAdmin(supabase);
    if (adminCheckResult.error || !adminCheckResult.user) {
      return { success: false, error: adminCheckResult.error || "Admin privileges required." };
    }
    const adminUser = adminCheckResult.user;

    const { error } = await supabase
      .from('jobs')
      .update({ 
        status: 'REJECTED' as JobStatus, 
        updated_at: new Date().toISOString() 
      })
      .eq('id', idAsString) // Use the string version here
      .eq('status', 'PENDING_APPROVAL' as JobStatus);

    if (error) {
      console.error(`Server Action (${actionName}): Error rejecting job ${idAsString}. Message:`, error.message);
      return { success: false, error: `Failed to reject job: ${error.message}` };
    }
    
    console.log(`Server Action (${actionName}): Job ${idAsString} rejected by admin ${adminUser.id}.`);
    
    return { success: true };

  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "An unexpected error occurred.";
    console.error(`Server Action (${actionName}): Unexpected error for job ${idAsString}. Message:`, message, err);
    return { success: false, error: message };
  }
}