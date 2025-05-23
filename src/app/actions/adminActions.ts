// src/app/actions/adminActions.ts
"use server";

import { getSupabaseServerClient } from '@/lib/supabase/serverClient';
import type { UserProfile } from '@/types'; // Import UserProfile and UserRole
import type { SupabaseClient } from '@supabase/supabase-js'; // Import SupabaseClient type


// Type for jobs displayed in the admin pending approval list
export interface AdminPendingJobData {
  id: string;
  title: string;
  companyName: string;
  // employerEmail?: string; // If you want to show who posted it
  createdAt: string; // Formatted date
  // jobType?: string; // Other details as needed for admin review
}

interface AdminActionResult {
  success: boolean;
  error?: string;
}

interface GetPendingJobsResult extends AdminActionResult {
  jobs?: AdminPendingJobData[];
}

// Helper function to check if the current user is an admin
// This should be called at the beginning of every admin-specific server action.
const ensureAdmin = async (
  // Correctly type supabaseClient as the resolved type of getSupabaseServerClient's promise
  supabaseClient: SupabaseClient 
): Promise<{ user: UserProfile | null; error?: string }> => {
  const { data: { user: authUser }, error: authError } = await supabaseClient.auth.getUser();
  if (authError || !authUser) {
    return { user: null, error: "Authentication required to check admin status." };
  }

  const { data: userProfileData, error: profileError } = await supabaseClient
    .from('profiles')
    .select('id, role, email, updated_at, has_made_role_choice, full_name, avatar_url') // Select all fields of UserProfile
    .eq('id', authUser.id)
    .single<UserProfile>(); // Use the full UserProfile type here

  if (profileError) {
    console.error("ensureAdmin: Error fetching profile:", profileError);
    return { user: null, error: "Failed to retrieve user profile." };
  }
  if (!userProfileData) {
    console.warn("ensureAdmin: No profile found for authenticated user:", authUser.id);
    return { user: null, error: "User profile not found." };
  }

  if (userProfileData.role !== 'ADMIN') {
    return { user: null, error: "Admin privileges required." };
  }
  
  return { user: userProfileData, error: undefined };
};


/**
 * Fetches jobs that are pending approval. Requires ADMIN privileges.
 */
export async function getPendingApprovalJobs(): Promise<GetPendingJobsResult> {
  const supabase = await getSupabaseServerClient();
  const actionName = "getPendingApprovalJobs";

  try {
    const { user: adminUser, error: adminError } = await ensureAdmin(supabase);
    if (adminError || !adminUser) {
      console.warn(`Server Action (${actionName}): Admin check failed. Error: ${adminError}`);
      return { success: false, error: adminError || "Admin privileges required." };
    }

    console.log(`Server Action (${actionName}): Admin ${adminUser.id} fetching pending jobs.`);

    const { data: pendingJobsData, error: fetchError } = await supabase
      .from('jobs')
      .select('id, title, company_name, created_at') // Add other fields if needed for display
      .eq('status', 'PENDING_APPROVAL')
      .order('created_at', { ascending: true }); // Show oldest pending jobs first

    if (fetchError) {
      console.error(`Server Action (${actionName}): Error fetching pending jobs.`, fetchError);
      return { success: false, error: "Failed to fetch pending jobs. " + fetchError.message };
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
    console.error(`Server Action (${actionName}): Unexpected error.`, message, err);
    return { success: false, error: "An unexpected server error occurred." };
  }
}

/**
 * Approves a job posting. Requires ADMIN privileges.
 * @param jobId - The ID of the job to approve.
 */
export async function approveJob(jobId: string): Promise<AdminActionResult> {
  if (!jobId) return { success: false, error: "Job ID is required." };

  const supabase = await getSupabaseServerClient();
  const actionName = "approveJob";

  try {
    const { user: adminUser, error: adminError } = await ensureAdmin(supabase);
    if (adminError || !adminUser) return { success: false, error: adminError || "Admin privileges required." };

    console.log(`Server Action (${actionName}): Admin ${adminUser.id} attempting to approve job ${jobId}.`);

    const { error } = await supabase
      .from('jobs')
      .update({ status: 'APPROVED', updated_at: new Date().toISOString() }) // Set updated_at manually
      .eq('id', jobId)
      .eq('status', 'PENDING_APPROVAL'); // Ensure we only approve jobs that are currently pending

    if (error) {
      console.error(`Server Action (${actionName}): Error approving job ${jobId}.`, error);
      return { success: false, error: "Failed to approve job. " + error.message };
    }

    console.log(`Server Action (${actionName}): Job ${jobId} approved by admin ${adminUser.id}.`);
    // Consider revalidating paths:
    // revalidatePath('/jobs'); // Public jobs list
    // revalidatePath(`/jobs/${jobId}`); // Specific job detail page
    // revalidatePath('/dashboard/admin/pending-approvals'); // Admin pending list
    return { success: true };

  } catch (err: unknown) { /* ... generic error handling ... */ 
    const message = err instanceof Error ? err.message : "An unexpected error occurred.";
    return { success: false, error: message };
  }
}

/**
 * Rejects a job posting. Requires ADMIN privileges.
 * @param jobId - The ID of the job to reject.
 */
export async function rejectJob(jobId: string): Promise<AdminActionResult> {
  if (!jobId) return { success: false, error: "Job ID is required." };

  const supabase = await getSupabaseServerClient();
  const actionName = "rejectJob";
  
  try {
    const { user: adminUser, error: adminError } = await ensureAdmin(supabase);
    if (adminError || !adminUser) return { success: false, error: adminError || "Admin privileges required." };

    console.log(`Server Action (${actionName}): Admin ${adminUser.id} attempting to reject job ${jobId}.`);

    const { error } = await supabase
      .from('jobs')
      .update({ status: 'REJECTED', updated_at: new Date().toISOString() })
      .eq('id', jobId)
      .eq('status', 'PENDING_APPROVAL'); // Ensure we only reject jobs that are currently pending

    if (error) {
      console.error(`Server Action (${actionName}): Error rejecting job ${jobId}.`, error);
      return { success: false, error: "Failed to reject job. " + error.message };
    }
    
    console.log(`Server Action (${actionName}): Job ${jobId} rejected by admin ${adminUser.id}.`);
    // revalidatePath('/dashboard/admin/pending-approvals');
    return { success: true };

  } catch (err: unknown) { /* ... generic error handling ... */
    const message = err instanceof Error ? err.message : "An unexpected error occurred.";
    return { success: false, error: message };
  }
}