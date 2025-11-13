-- This migration provides the definitive fix for the application status naming inconsistency.
-- It aligns the database with the frontend code's expectations by renaming
-- 'REJECTED_BY_EMPLOYER' to the simpler 'REJECTED' using a single, safe command.
-- All other enum values, including 'WITHDRAWN_BY_SEEKER', are left untouched.

ALTER TYPE public.application_status_option RENAME VALUE 'REJECTED_BY_EMPLOYER' TO 'REJECTED';