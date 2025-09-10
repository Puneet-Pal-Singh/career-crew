// src/app/actions/employer/jobs/archiveJobAction.ts
"use server";

import { getSupabaseServerClient } from "@/lib/supabase/serverClient";
import { revalidatePath } from 'next/cache';
import { JOB_STATUS } from '@/types';

interface ActionResult {
  success: boolean;
  message: string;
}

export async function archiveJobAction(jobId: number): Promise<ActionResult> {
  const supabase = await getSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, message: "Authentication required." };
  }

  // Security Check: Fetch the job first to verify ownership
  const { data: job, error: fetchError } = await supabase
    .from('jobs')
    .select('employer_id')
    .eq('id', jobId)
    .single();

  if (fetchError || !job) {
    return { success: false, message: "Job not found." };
  }

  if (job.employer_id !== user.id) {
    return { success: false, message: "Unauthorized: You do not own this job." };
  }

  // Proceed with the update
  const { error: updateError } = await supabase
    .from('jobs')
    .update({ status: JOB_STATUS.ARCHIVED })
    .eq('id', jobId);

  if (updateError) {
    console.error("Error archiving job:", updateError.message);
    return { success: false, message: "Failed to archive job." };
  }

  // Revalidate the path to refresh the table on the client
  revalidatePath('/dashboard/my-jobs');

  return { success: true, message: "Job successfully archived." };
}