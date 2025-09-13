-- This script contains all the RLS policies needed for Supabase Storage.
-- It should be run manually in the Supabase SQL Editor after a new
-- project has been initialized and the database migrations have been applied.

-- POLICY 1: Allow any authenticated user to UPLOAD a resume.
CREATE POLICY "Allow authenticated uploads"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'resumes');


-- POLICY 2: Allow users to VIEW a resume if they are the one who uploaded it,
-- OR if they are the employer who owns the job the application is for.
CREATE POLICY "Allow authorized downloads"
ON storage.objects FOR SELECT
TO authenticated
USING (
  -- Rule 1: The user owns the file (they are the applicant)
  (bucket_id = 'resumes' AND auth.uid() = owner) OR
  -- Rule 2: The user is the employer who owns the job this resume is for
  (
    bucket_id = 'resumes' AND
    (
      SELECT jobs.employer_id
      FROM public.applications
      JOIN public.jobs ON applications.job_id = jobs.id
      WHERE applications.resume_file_path = storage.objects.name
      LIMIT 1
    ) = auth.uid()
  )
);