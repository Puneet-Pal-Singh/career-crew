-- This function securely fetches pending jobs for an admin.
-- It runs with the privileges of the user who defined it (SECURITY DEFINER),
-- but it now includes an internal check to ensure the caller is an admin.

-- Drop the old function first to ensure a clean replacement
DROP FUNCTION IF EXISTS get_pending_jobs_for_admin();

CREATE OR REPLACE FUNCTION get_pending_jobs_for_admin()
RETURNS TABLE (
    id bigint,
    title text,
    company_name text,
    created_at timestamptz,
    status job_status,
    employer_id uuid
)
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
    user_role text;
BEGIN
    -- THE SECURITY FIX:
    -- Check the role of the user calling this function.
    SELECT role INTO user_role FROM public.profiles WHERE id = auth.uid();
    
    -- If the user is not an admin, raise an exception.
    IF user_role != 'ADMIN' THEN
        RAISE EXCEPTION 'Insufficient privileges. Admin role required.' USING ERRCODE = '42501'; -- 'insufficient_privilege'
    END IF;

    -- If the check passes, proceed with the query.
    RETURN QUERY
    SELECT
        j.id,
        j.title,
        j.company_name,
        j.created_at,
        j.status,
        j.employer_id
    FROM
        jobs AS j
    WHERE
        j.status = 'PENDING_APPROVAL'
    ORDER BY
        j.created_at ASC;
END;
$$;