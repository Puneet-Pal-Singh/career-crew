// src/app/actions/admin/applications/getApplicationDetailsForAdminAction.ts
"use server";

import { getSupabaseServerClient } from '@/lib/supabase/serverClient';
import { ensureAdmin } from '@/app/actions/helpers/adminAuthUtils';
import { unstable_noStore as noStore } from 'next/cache';
import type { ApplicationStatusOption } from '@/types';
import { adminSupabase } from '@/lib/supabase/adminClient';

// This is the data structure the Admin's modal component will receive.
// It's nearly identical to the employer's version, but without the status update logic.
export interface AdminApplicationDetails {
  id: string;
  applicantName: string;
  applicantEmail: string;
  jobTitle: string;
  appliedAt: string;
  status: ApplicationStatusOption;
  coverLetterSnippet: string | null;
  resumeUrl: string | null;
  linkedinProfileUrl: string | null;
}

// Define the shape of the raw data returned from our new SQL function.
interface RawApplicationDetails {
  id: string;
  applicant_name: string;
  applicant_email: string;
  job_title: string;
  applied_at: string; // ISO string
  status: ApplicationStatusOption;
  cover_letter_snippet: string | null;
  resume_file_path: string | null;
  linkedin_profile_url: string | null;
}

interface ActionResult {
  success: boolean;
  data?: AdminApplicationDetails;
  error?: string;
}

export async function getApplicationDetailsForAdminAction(applicationId: string): Promise<ActionResult> {
  noStore();
  const supabase = await getSupabaseServerClient();
  
  // 1. Security First: Ensure the user is an admin.
  const adminCheck = await ensureAdmin();
  if (!adminCheck.user) {
    return { success: false, error: adminCheck.error };
  }

  try {
    // 2. Fetch the core application details using our secure RPC function.
    const { data: rawData, error: rpcError } = await supabase
      .rpc('get_application_details_for_admin', { application_id_param: applicationId })
      .single();

    if (rpcError) {
      console.error("Admin Application Details RPC Error:", rpcError.message);
      return { success: false, error: "Failed to fetch application details from the database." };
    }
    
    const rawDetails = rawData as RawApplicationDetails;

    // 3. Securely generate a temporary signed URL for the resume file, if it exists.
    let signedResumeUrl: string | null = null;

    // THE DEFINITIVE FIX: Add explicit checks and logging.
    if (rawDetails.resume_file_path && typeof rawDetails.resume_file_path === 'string' && rawDetails.resume_file_path.length > 0) {
      
      const filePath = rawDetails.resume_file_path.trim(); // Trim any potential whitespace
      console.log(`[AdminAction] Attempting to create signed URL for bucket 'resumes' with path: "${filePath}"`);

    //   const { data, error: urlError } = await supabase.storage
    //     .from('resumes')
    //     .createSignedUrl(filePath, 60);

      // 2. THE DEFINITIVE FIX: Use the adminSupabase client to bypass storage RLS.
      const { data, error: urlError } = await adminSupabase.storage
        .from('resumes')
        .createSignedUrl(filePath, 60); // 60 seconds validity

      if (urlError) {
        // Log the specific error from storage
        console.error("Error creating signed URL for resume (Admin):", urlError);
      } else {
        signedResumeUrl = data.signedUrl;
      }
    } else {
      console.log(`[AdminAction] No valid resume_file_path found for application ${applicationId}. Skipping signed URL creation.`);
    }

    // 4. Map the raw data and the signed URL into the final, clean object for the UI.
    const applicationDetails: AdminApplicationDetails = {
      id: rawDetails.id,
      applicantName: rawDetails.applicant_name,
      applicantEmail: rawDetails.applicant_email,
      jobTitle: rawDetails.job_title,
      appliedAt: new Date(rawDetails.applied_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      status: rawDetails.status,
      coverLetterSnippet: rawDetails.cover_letter_snippet,
      resumeUrl: signedResumeUrl,
      linkedinProfileUrl: rawDetails.linkedin_profile_url,
    };

    return { success: true, data: applicationDetails };

  } catch (err) {
    const message = err instanceof Error ? err.message : "An unexpected error occurred.";
    console.error("Unexpected error in getApplicationDetailsForAdminAction:", message);
    return { success: false, error: "A server error occurred." };
  }
}