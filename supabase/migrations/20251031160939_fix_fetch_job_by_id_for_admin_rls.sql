-- This migration creates a secure SECURITY DEFINER function for an admin
-- to fetch a single job by its ID, bypassing Row Level Security.
-- This fixes a bug where a direct SELECT query was being blocked by RLS.

CREATE OR REPLACE FUNCTION get_job_by_id_for_admin(job_id_param bigint)
RETURNS TABLE (
    id bigint,
    title text,
    company_name text,
    created_at timestamptz,
    status job_status,
    employer_id uuid,
    company_logo_url text,
    location text,
    job_type job_type_option,
    is_remote boolean,
    salary_min integer,
    salary_max integer,
    salary_currency text,
    tags text[],
    description text,
    requirements text,
    application_email text,
    application_url text,
    updated_at timestamptz
)
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
    user_role text;
BEGIN
    -- Security guard: Ensure the caller is an admin.
    SELECT p.role INTO user_role FROM public.profiles p WHERE p.id = auth.uid();
    
    IF user_role IS NULL OR user_role != 'ADMIN' THEN
        RAISE EXCEPTION 'Insufficient privileges. Admin role required.' USING ERRCODE = '42501';
    END IF;

    -- The query to fetch the specific job, with fully-qualified column names.
    RETURN QUERY
    SELECT
        j.id, j.title, j.company_name, j.created_at, j.status, j.employer_id,
        j.company_logo_url, j.location, j.job_type, j.is_remote, j.salary_min,
        j.salary_max, j.salary_currency, j.tags, j.description, j.requirements,
        j.application_email, j.application_url, j.updated_at
    FROM
        jobs AS j
    WHERE
        j.id = job_id_param;
END;
$$;