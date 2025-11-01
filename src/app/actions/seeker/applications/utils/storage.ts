// src/app/actions/seeker/applications/utils/storage.ts
import type { SupabaseClient } from '@supabase/supabase-js';

/**
 * Handles the upload of the resume file to Supabase Storage.
 * Returns the storage file path on success.
 * Throws an error if the upload fails.
 */
export async function uploadResume(
  resumeFile: File,
  userId: string,
  jobId: number,
  supabase: SupabaseClient
): Promise<string> {
  const fileExt = resumeFile.name.split('.').pop() || 'file';
  const fileName = `${userId}-${jobId}-${Date.now()}.${fileExt}`;
  const filePath = `${userId}/${fileName}`; // Organize files by user ID

  const { error } = await supabase.storage
    .from('resumes')
    .upload(filePath, resumeFile);

  if (error) {
    // Add more context to the error before throwing
    throw new Error(`Storage Error: ${error.message}`);
  }

  return filePath;
}