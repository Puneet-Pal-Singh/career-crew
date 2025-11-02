/******************************************************************
 * This migration creates two new SECURITY DEFINER functions
 * to allow an admin to safely query job application data,
 * bypassing Row Level Security.
 ******************************************************************/

-- Function 1: Gets a list of all jobs with a count of their applications.
-- This will power the master view in the admin dashboard.
CREATE OR REPLACE FUNCTION get_jobs_with_application_counts_for_admin()
RETURNS TABLE (
    job_id bigint,
    job_title text,
    company_name text,
    application_count bigint
)
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
    user_role text;
BEGIN
    -- Security Guard: Use our established pattern to ensure the caller is an admin.
    SELECT p.role INTO user_role FROM public.profiles p WHERE p.id = auth.uid();
    IF user_role IS NULL OR user_role != 'ADMIN' THEN
        RAISE EXCEPTION 'Insufficient privileges. Admin role required.' USING ERRCODE = '42501';
    END IF;

    -- The query joins jobs with applications and returns a count.
    RETURN QUERY
    SELECT
        j.id AS job_id,
        j.title AS job_title,
        j.company_name,
        COUNT(a.id) AS application_count
    FROM
        public.jobs AS j
    LEFT JOIN
        public.applications AS a ON j.id = a.job_id
    GROUP BY
        j.id
    ORDER BY
        application_count DESC, j.created_at DESC;
END;
$$;


-- Function 2: Gets all applications for a single, specified job.
-- This will power the drill-down view.
CREATE OR REPLACE FUNCTION get_applications_for_job_for_admin(job_id_param bigint)
RETURNS TABLE (
    application_id uuid,
    seeker_full_name text,
    seeker_email text,
    status application_status_option,
    date_applied timestamptz
)
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
    user_role text;
BEGIN
    -- Security Guard: Same established pattern.
    SELECT p.role INTO user_role FROM public.profiles p WHERE p.id = auth.uid();
    IF user_role IS NULL OR user_role != 'ADMIN' THEN
        RAISE EXCEPTION 'Insufficient privileges. Admin role required.' USING ERRCODE = '42501';
    END IF;

    -- The query joins applications with profiles to get the seeker's details.
    RETURN QUERY
    SELECT
        a.id AS application_id,
        p.full_name AS seeker_full_name,
        p.email AS seeker_email,
        a.status,
        a.created_at AS date_applied
    FROM
        public.applications AS a
    INNER JOIN
        public.profiles AS p ON a.seeker_id = p.id
    WHERE
        a.job_id = job_id_param
    ORDER BY
        a.created_at DESC;
END;
$$;