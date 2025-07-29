// src/app/actions/admin/approveJobAction.ts
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
 * Approves a job posting. Requires ADMIN privileges.
 * @param jobId - The ID (string or number) of the job to approve.
 */
export async function approveJob(jobId: string | number): Promise<AdminActionResult> {
  if (!jobId) {
    console.warn("approveJob Action: No jobId provided.");
    return { success: false, error: "Job ID is required for approval." };
  }
  // FIX: Coerce to string for consistent use, matching the pattern in rejectJobAction.
  const idAsString = String(jobId);

  const supabase = await getSupabaseServerClient();
  const actionName = "approveJob";

  try {
    const adminCheckResult = await ensureAdmin(supabase);
    if (adminCheckResult.error || !adminCheckResult.user) {
      return { success: false, error: adminCheckResult.error || "Admin privileges required." };
    }
    const adminUser = adminCheckResult.user;

    const { error } = await supabase
      .from('jobs')
      .update({ 
        status: 'APPROVED' as JobStatus, 
        updated_at: new Date().toISOString() 
      })
      .eq('id', idAsString) // Use the consistent string variable
      .eq('status', 'PENDING_APPROVAL' as JobStatus);

    if (error) {
      console.error(`Server Action (${actionName}): Error approving job ${idAsString}. Message:`, error.message);
      return { success: false, error: `Failed to approve job: ${error.message}` };
    }

    console.log(`Server Action (${actionName}): Job ${idAsString} approved by admin ${adminUser.id}.`);
    // revalidatePath('/dashboard/admin/pending-approvals');
    // revalidatePath('/jobs');
    // revalidatePath(`/jobs/${idAsString}`);

    return { success: true };

  } catch (err: unknown) { 
    const message = err instanceof Error ? err.message : "An unexpected error occurred.";
    console.error(`Server Action (${actionName}): Unexpected error for job ${idAsString}. Message:`, message, err);
    return { success: false, error: message };
  }
}