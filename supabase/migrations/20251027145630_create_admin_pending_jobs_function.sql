-- This function securely fetches pending jobs for an admin.
-- It is a placeholder that can be extended later for more complex joins
-- while respecting RLS, but for now, it just fetches from the jobs table.
-- Using a function provides a consistent data access layer.

CREATE OR REPLACE FUNCTION get_pending_jobs_for_admin()
RETURNS TABLE (
    id bigint,
    title text,
    company_name text,
    created_at timestamptz,
    status job_status,
    employer_id uuid -- IMPORTANT: We need this ID to fetch details for the popup.
)
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
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