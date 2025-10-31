-- This migration creates the get_all_jobs_for_admin function.
-- This is the single, definitive, and corrected version of the function.
-- It uses the project's established security pattern and has a RETURNS TABLE
-- signature that perfectly matches the `jobs` table schema.

CREATE OR REPLACE FUNCTION get_all_jobs_for_admin()
RETURNS TABLE (
    id bigint,
    title text,
    company_name text,
    created_at timestamptz, -- CORRECTED
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
    updated_at timestamptz -- CORRECTED
)
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
    user_role text;
BEGIN
    -- Security guard: Use the established pattern to ensure the caller is an admin.
    SELECT p.role INTO user_role
    FROM public.profiles p
    WHERE p.id = auth.uid();
    
    IF user_role IS NULL OR user_role != 'ADMIN' THEN
        RAISE EXCEPTION 'Insufficient privileges. Admin role required.' USING ERRCODE = '42501';
    END IF;

    -- Return the query with explicit, fully-qualified columns.
    RETURN QUERY
    SELECT
        j.id,
        j.title,
        j.company_name,
        j.created_at,
        j.status,
        j.employer_id,
        j.company_logo_url,
        j.location,
        j.job_type,
        j.is_remote,
        j.salary_min,
        j.salary_max,
        j.salary_currency,
        j.tags,
        j.description,
        j.requirements,
        j.application_email,
        j.application_url,
        j.updated_at
    FROM
        jobs AS j
    ORDER BY
        j.created_at DESC;
END;
$$;