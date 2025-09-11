// src/app/actions/employer/applications/updateApplicationStatusAction.ts
"use server";

import { getSupabaseServerClient } from "@/lib/supabase/serverClient";
import { revalidatePath } from 'next/cache';
import { APPLICATION_STATUS_OPTIONS, type ApplicationStatusOption } from '@/types'; 

// Use a discriminated union for success and error cases
type ActionResult = 
  | { success: true; message: string }
  | { success: false; error: string };

export async function updateApplicationStatusAction(
  applicationId: string,
  newStatus: ApplicationStatusOption
): Promise<ActionResult> {
  const supabase = await getSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Authentication required." };
  }

  // Runtime validation for the input status
  if (!APPLICATION_STATUS_OPTIONS.includes(newStatus)) {
    return { success: false, error: "Invalid application status provided." };
  }

  // --- Security Check ---
  // First, fetch the application and its associated job to get the employer_id.
  const { data: application, error: fetchError } = await supabase
    .from('applications')
    .select('job:jobs!inner(employer_id)')
    .eq('id', applicationId)
    .single();

  if (fetchError || !application) {
    return { success: false, error: "Application not found." };
  }
  
  const job = Array.isArray(application.job) ? application.job[0] : application.job;
  
  // Now, verify that the employer_id on the job matches the current user's ID.
  if (job?.employer_id !== user.id) {
    return { success: false, error: "Unauthorized: You do not have permission to modify this application." };
  }
  // --- End Security Check ---

  // If the security check passes, proceed with the update.
  const { error: updateError } = await supabase
    .from('applications')
    .update({ status: newStatus })
    .eq('id', applicationId);

  if (updateError) {
    console.error("Error updating application status:", updateError.message);
    return { success: false, error: "Failed to update application status." };
  }

  // On success, revalidate the applications page path to refresh the data on the client.
  revalidatePath('/dashboard/applications');

  return { success: true, message: `Application status updated to ${newStatus}.` };
}