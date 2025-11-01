-- This migration creates a secure function for an admin to fetch all details
-- for a single application, joining across applications, jobs, and profiles.

CREATE OR REPLACE FUNCTION get_application_details_for_admin(application_id_param uuid)
RETURNS TABLE (
  id uuid,
  applicant_name text,
  applicant_email text,
  job_title text,
  applied_at timestamptz,
  status application_status_option,
  cover_letter_snippet text,
  resume_file_path text,
  linkedin_profile_url text
)
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
    user_role text;
BEGIN
    -- Security Guard: Ensure the caller is an admin.
    SELECT p.role INTO user_role FROM public.profiles p WHERE p.id = auth.uid();
    IF user_role IS NULL OR user_role != 'ADMIN' THEN
        RAISE EXCEPTION 'Insufficient privileges. Admin role required.' USING ERRCODE = '42501';
    END IF;

    -- The query joins all three tables to gather the necessary data in one step.
    RETURN QUERY
    SELECT
        a.id,
        p.full_name AS applicant_name,
        p.email AS applicant_email,
        j.title AS job_title,
        a.created_at AS applied_at,
        a.status,
        a.cover_letter_snippet,
        a.resume_file_path,
        a.linkedin_profile_url
    FROM
        public.applications AS a
    INNER JOIN
        public.profiles AS p ON a.seeker_id = p.id
    INNER JOIN
        public.jobs AS j ON a.job_id = j.id
    WHERE
        a.id = application_id_param;
END;
$$;