-- This migration REPLACES the previous function with the definitive, hardened version.
-- It includes a robust security check AND fully-qualified column names
-- to prevent ambiguity errors in all environments.

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
    -- Security guard: Ensure the caller is a fully onboarded admin.
    SELECT p.role INTO user_role
    FROM public.profiles p
    WHERE p.id = auth.uid() AND p.has_completed_onboarding = TRUE;
    
    IF user_role IS NULL OR user_role != 'ADMIN' THEN
        RAISE EXCEPTION 'Insufficient privileges. Admin role required.' USING ERRCODE = '42501';
    END IF;

    -- The bulletproof query with explicit aliases.
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