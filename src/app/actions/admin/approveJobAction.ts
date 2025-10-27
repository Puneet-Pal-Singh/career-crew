// src/app/actions/admin/approveJobAction.ts
"use server";

import { getSupabaseServerClient } from '@/lib/supabase/serverClient';
import { ensureAdmin } from '@/app/actions/helpers/adminAuthUtils';
import type { JobStatus } from '@/types';

interface AdminActionResult {
  success: boolean;
  error?: string;
}

/**
 * Approves a job posting. Requires ADMIN privileges.
 * @param jobId - The ID (string or number) of the job to approve.
 */
export async function approveJob(jobId: string | number): Promise<AdminActionResult> {
  if (!jobId) {
    return { success: false, error: "Job ID is required for approval." };
  }

  const actionName = "approveJob";

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
        status: 'APPROVED' as JobStatus, 
        updated_at: new Date().toISOString() 
      })
      .eq('id', jobId)
      .eq('status', 'PENDING_APPROVAL' as JobStatus);

    if (error) {
      console.error(`[${actionName}] Error approving job ${jobId}:`, error.message);
      return { success: false, error: `Failed to approve job: ${error.message}` };
    }

    console.log(`[${actionName}] Job ${jobId} approved by admin ${adminUser.id}.`);
    return { success: true };

  } catch (err: unknown) { 
    const message = err instanceof Error ? err.message : "An unexpected error occurred.";
    console.error(`[${actionName}] Unexpected error for job ${jobId}:`, message);
    return { success: false, error: message };
  }
}