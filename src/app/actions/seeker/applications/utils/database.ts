// src/app/actions/seeker/applications/utils/database.ts
import type { SupabaseClient } from '@supabase/supabase-js';
import type { ValidatedApplicationPayload } from './validation';

/**
 * Inserts the final application record into the public.applications table.
 * Returns the new application ID on success.
 * Throws an error if the insertion fails.
 */
export async function insertApplicationRecord(
  payload: ValidatedApplicationPayload,
  userId: string,
  resumeFilePath: string,
  supabase: SupabaseClient
): Promise<string> {
  const { data: newApplication, error } = await supabase
    .from('applications')
    .insert({
      job_id: payload.jobId,
      seeker_id: userId,
      cover_letter_snippet: payload.coverLetter,
      linkedin_profile_url: payload.linkedinUrl,
      resume_file_path: resumeFilePath,
    })
    .select('id')
    .single();

  if (error) {
    // Add more context to the error before throwing
    throw new Error(`Database Insert Error: ${error.message}`);
  }

  return newApplication.id;
}