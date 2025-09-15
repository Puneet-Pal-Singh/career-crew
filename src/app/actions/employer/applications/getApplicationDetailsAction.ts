// src/app/actions/employer/getApplicationDetailsAction.ts
"use server";

import { getSupabaseServerClient } from '@/lib/supabase/serverClient';
import { adminSupabase } from '@/lib/supabase/adminClient';
import { unstable_noStore as noStore } from 'next/cache';
import type { ApplicationStatusOption } from '@/types';

// The final, detailed data structure for the frontend
export interface ApplicationDetails {
  id: string;
  applicantName: string;
  applicantEmail: string;
  jobTitle: string;
  appliedAt: string;
  status: ApplicationStatusOption;
  coverLetterSnippet: string | null;
  resumeUrl: string | null; // This will now be a temporary signed URL for the file
  linkedinProfileUrl: string | null; // The new dedicated field
}

// The type for our function's result, handling success and error cases
interface ActionResult {
  success: boolean;
  data?: ApplicationDetails;
  error?: string;
}

export async function getApplicationDetailsAction(applicationId: string): Promise<ActionResult> {
  noStore();
  // Get the standard server client that operates within the user's RLS policies
  const supabase = await getSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Authentication required." };
  }

  // Step 1: Fetch the application using the user's permissions
  // This query also fetches the related job to perform a security check.
  const { data: applicationData, error: applicationError } = await supabase
    .from('applications')
    .select(`
      id,
      created_at,
      status,
      cover_letter_snippet,
      linkedin_profile_url,
      resume_file_path,
      seeker_id,
      job:jobs!inner(title, employer_id)
    `)
    .eq('id', applicationId)
    .single();

  if (applicationError) {
    console.error("Step 1 Error - Fetching application:", applicationError.message);
    return { success: false, error: "Failed to fetch application." };
  }

  // Supabase can return a joined table as an array or an object, so we safely handle both cases.
  const job = Array.isArray(applicationData.job) ? applicationData.job[0] : applicationData.job;
  if (!job) {
    return { success: false, error: "Could not find job associated with this application." };
  }

  // CRITICAL SECURITY CHECK: Confirm the employer owns the job before proceeding.
  if (job.employer_id !== user.id) {
    return { success: false, error: "Unauthorized: You do not have permission to view this application." };
  }

  // Step 2: Now that ownership is verified, use the ADMIN client to bypass RLS and securely fetch the seeker's profile.
  // We use .maybeSingle() to safely handle cases where a profile might be missing, returning null instead of throwing an error.
  const { data: profileData, error: profileError } = await adminSupabase
    .from('profiles')
    .select('full_name, email')
    .eq('id', applicationData.seeker_id)
    .maybeSingle();

  if (profileError) {
    console.error("Step 2 Error - Fetching profile with admin client:", profileError.message);
    return { success: false, error: "Failed to fetch applicant's profile." };
  }
  if (!profileData) {
    // This can happen if the profile was deleted but the application remains.
    return { success: false, error: "Applicant profile not found." };
  }

  // STEP 3: Securely generate a temporary URL for the resume file
  let signedResumeUrl: string | null = null;
  if (applicationData.resume_file_path) {
    const { data, error: urlError } = await supabase.storage
      .from('resumes')
      .createSignedUrl(applicationData.resume_file_path, 60); // URL is valid for 60 seconds

    if (urlError) {
      console.error("Error creating signed URL for resume:", urlError);
      // Don't fail the whole request, just proceed without the resume URL
      signedResumeUrl = null;
    } else {
      signedResumeUrl = data.signedUrl;
    }
  }

  // Step 3: Combine all the data into one clean object.
  const applicationDetails: ApplicationDetails = {
    id: applicationData.id,
    applicantName: profileData.full_name,
    applicantEmail: profileData.email,
    jobTitle: job.title,
    appliedAt: new Date(applicationData.created_at).toLocaleDateString(),
    status: applicationData.status as ApplicationStatusOption,
    coverLetterSnippet: applicationData.cover_letter_snippet,
    resumeUrl: signedResumeUrl,
    linkedinProfileUrl: applicationData.linkedin_profile_url,
  };

  return { success: true, data: applicationDetails };
}