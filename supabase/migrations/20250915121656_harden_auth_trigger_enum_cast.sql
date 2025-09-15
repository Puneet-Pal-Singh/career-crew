-- This migration updates the handle_new_user function to more safely
-- cast the user-provided role from the JWT metadata to the user_role enum.
-- This prevents the trigger from crashing if an invalid role string is provided.

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  user_role public.user_role;
  user_full_name text;
BEGIN
  -- Safely map the user-provided role to the enum, falling back to JOB_SEEKER on invalid/missing values.
  SELECT COALESCE(
    (
      SELECT e.enumlabel::public.user_role
      FROM pg_type t
      JOIN pg_enum e ON t.oid = e.enumtypid
      WHERE t.typname = 'user_role'
      AND e.enumlabel = NEW.raw_user_meta_data->>'role'
      LIMIT 1
    ),
    'JOB_SEEKER'
  ) INTO user_role;

  -- The rest of your function's logic remains exactly the same.
  user_full_name := COALESCE(
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'name',
    NEW.email
  );

  INSERT INTO public.profiles (id, full_name, email, role, has_completed_onboarding)
  VALUES (
    NEW.id,
    user_full_name,
    NEW.email,
    user_role,
    false
  );

  UPDATE auth.users
  SET raw_app_meta_data = COALESCE(raw_app_meta_data, '{}'::jsonb) || jsonb_build_object(
      'role', user_role,
      'onboarding_complete', false
  )
  WHERE id = NEW.id;
  
  RETURN NEW;
END;
$$;