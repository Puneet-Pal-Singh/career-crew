// src/app/actions/seeker/applications/submitApplicationAction.ts
"use server";

import { getSupabaseServerClient } from '@/lib/supabase/serverClient';
import { revalidatePath } from 'next/cache';

// Constants for validation
const MAX_RESUME_SIZE_BYTES = 5 * 1024 * 1024; // 5MB
const ACCEPTED_RESUME_MIME_TYPES = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
]);

// Using a discriminated union for the return type is a best practice.
type ActionResult = 
  | { success: true; applicationId: string }
  | { success: false; error: string };

/**
 * Server Action for submitting a job application, now handling file uploads.
 * @param formData - The FormData object from the application form.
 * @returns {Promise<ActionResult>} Result of the operation.
 */
export async function submitApplicationAction(formData: FormData): Promise<ActionResult> {
  const supabase = await getSupabaseServerClient();
  const actionName = "submitApplicationAction";
  
  // 1. Authenticate the user
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: "Authentication required. Please log in to apply." };
  }

  // 2. Extract and validate data from FormData
  const jobId = formData.get('jobId') as string;
  const coverLetter = formData.get('coverLetter') as string | null;
  const linkedinUrl = formData.get('linkedinUrl') as string | null;
  const resumeFile = formData.get('resumeFile') as File | null;

  if (!jobId) {
    return { success: false, error: "Job ID is missing. Cannot submit application." };
  }
  if (!resumeFile || resumeFile.size === 0) {
    return { success: false, error: "A resume file is required to apply." };
  }

  // Server-side file validation
  if (!resumeFile || resumeFile.size === 0) {
    return { success: false, error: "A resume file is required to apply." };
  }
  if (resumeFile.size > MAX_RESUME_SIZE_BYTES) {
    return { success: false, error: "Resume file size cannot exceed 5MB." };
  }
  if (!ACCEPTED_RESUME_MIME_TYPES.has(resumeFile.type)) {
    return { success: false, error: "Unsupported file type. Only PDF, DOC, and DOCX are allowed." };
  }

  try {
    // 3. Perform security and business logic checks in parallel
    const [jobResult, existingApplicationResult] = await Promise.all([
      // Check if the job is valid for application
      supabase.from('jobs').select('status, employer_id').eq('id', jobId).single(),
      // Check if the user has already applied
      supabase.from('applications').select('id', { count: 'exact', head: true }).eq('job_id', jobId).eq('seeker_id', user.id)
    ]);

    const { data: jobData, error: jobError } = jobResult;
    if (jobError || !jobData) {
      return { success: false, error: "This job posting could not be found." };
    }
    if (jobData.status !== 'APPROVED') {
      return { success: false, error: "This job is no longer accepting applications." };
    }
    if (jobData.employer_id === user.id) {
      return { success: false, error: "You cannot apply to your own job posting." };
    }

    const { count: existingCount, error: checkError } = existingApplicationResult;
    if (checkError) throw checkError; // Let the catch block handle unexpected DB errors
    if (existingCount !== null && existingCount > 0) {
      return { success: false, error: "You have already applied for this job." };
    }

    // 4. Handle the resume file upload to Supabase Storage
    const fileExt = resumeFile.name.split('.').pop();
    const fileName = `${user.id}-${jobId}-${Date.now()}.${fileExt}`;
    const filePath = `${user.id}/${fileName}`; // Organize files by user ID

    const { error: uploadError } = await supabase.storage
      .from('resumes')
      .upload(filePath, resumeFile);

    if (uploadError) {
      console.error(`(${actionName}) Supabase storage error:`, uploadError);
      return { success: false, error: "Error uploading your resume. Please try again." };
    }

    // 5. Insert the application record into the database
    const { data: newApplication, error: insertError } = await supabase
      .from('applications')
      .insert({
        job_id: Number(jobId),
        seeker_id: user.id,
        cover_letter_snippet: coverLetter,
        linkedin_profile_url: linkedinUrl, // Use the new column name
        resume_file_path: filePath,       // Store the path, not the full URL
      })
      .select('id')
      .single();
    
    if (insertError) {
      // If the insert fails, we should try to clean up the uploaded file
      await supabase.storage.from('resumes').remove([filePath]);
      console.error(`(${actionName}) Supabase insert error:`, insertError);
      return { success: false, error: "A database error occurred while submitting." };
    }

    // 6. On success, revalidate paths and return the new application ID
    revalidatePath(`/jobs/${jobId}`);
    revalidatePath('/dashboard/seeker/applications');
    
    return { success: true, applicationId: newApplication.id };

  } catch (err) {
    const message = err instanceof Error ? err.message : "An unexpected error occurred.";
    console.error(`(${actionName}) Unexpected error for job ${jobId}, user ${user.id}:`, message);
    return { success: false, error: "An unexpected server error occurred." };
  }
}