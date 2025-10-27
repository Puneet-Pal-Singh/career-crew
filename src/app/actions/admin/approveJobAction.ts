// src/app/actions/admin/approveJobAction.ts
"use server";

import { adminSupabase } from '@/lib/supabase/adminClient';
import { ensureAdmin } from '@/app/actions/helpers/adminAuthUtils';
import type { JobStatus } from '@/types';
import { revalidatePath } from 'next/cache';

interface AdminActionResult {
  success: boolean;
  error?: string;
}

export async function approveJob(jobId: number): Promise<AdminActionResult> {
  if (!jobId) {
    return { success: false, error: "Job ID is required." };
  }

  const actionName = "approveJob";

  try {
    const { user: adminUser, error: adminError } = await ensureAdmin();
    if (adminError || !adminUser) {
      return { success: false, error: adminError };
    }

    // THE FIX: The .select() after .update() returns the updated rows.
    // We check the length of the returned array to get the count.
    const { data, error } = await adminSupabase
      .from('jobs')
      .update({ 
        status: 'APPROVED' as JobStatus, 
        updated_at: new Date().toISOString() 
      })
      .eq('id', jobId)
      .eq('status', 'PENDING_APPROVAL' as JobStatus)
      .select('id'); // This returns the 'id' of the updated row(s)

    if (error) {
      console.error(`[${actionName}] Error approving job ${jobId}:`, error.message);
      return { success: false, error: `Failed to approve job: ${error.message}` };
    }

    // THE FIX: The count is the length of the data array.
    const count = data?.length ?? 0;

    if (count === 0) {
      return { success: false, error: "Job not found or it has already been processed." };
    }

    console.log(`[${actionName}] Job ${jobId} approved by admin ${adminUser.id}.`);
    
    revalidatePath('/dashboard/admin/pending-approvals');

    return { success: true };

  } catch (err: unknown) { 
    const message = err instanceof Error ? err.message : "An unexpected error occurred.";
    console.error(`[${actionName}] Unexpected error for job ${jobId}:`, message);
    return { success: false, error: message };
  }
}