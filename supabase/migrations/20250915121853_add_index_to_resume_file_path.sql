-- Adds an index to the resume_file_path column on the applications table.
-- This significantly speeds up the EXISTS lookup in the storage download RLS policy.
CREATE INDEX IF NOT EXISTS applications_resume_file_path_idx
ON public.applications (resume_file_path);