-- This script contains all the RLS policies needed for Supabase Storage.
-- It should be run manually in the Supabase SQL Editor after a new
-- project has been initialized and the database migrations have been applied.

-- supabase/setup_scripts/storage_policies.sql

-- POLICY 1: Constrain uploads to a user-scoped folder.
CREATE POLICY "Allow authenticated uploads"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'resumes'
  -- This ensures the path starts with the user's ID, e.g., "a1b2c3d4/resume.pdf"
  AND position((auth.uid())::text || '/' in name) = 1
);


-- POLICY 2: Harden download policy with EXISTS for clarity and performance.
CREATE POLICY "Allow authorized downloads"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'resumes'
  AND (
    -- Rule 1: The user is the owner (applicant) of the file.
    auth.uid() = owner
    OR 
    -- Rule 2: The user is an employer who owns the job associated with the resume.
    EXISTS (
      SELECT 1
      FROM public.applications a
      JOIN public.jobs j ON a.job_id = j.id
      WHERE a.resume_file_path = storage.objects.name
      AND j.employer_id = auth.uid()
    )
  )
);