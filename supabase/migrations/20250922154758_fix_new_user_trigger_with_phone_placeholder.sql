-- This migration updates the handle_new_user function to be compatible
-- with the mandatory 'phone' column in the 'profiles' table.

-- Drop the old trigger and function to ensure a clean update
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Re-create the function with the necessary change
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  user_role public.user_role;
  user_full_name text;
BEGIN
  -- ... (logic to extract role and full_name remains the same) ...
  user_role := COALESCE(
    (NEW.raw_user_meta_data->>'role')::public.user_role,
    'JOB_SEEKER'
  );
  user_full_name := COALESCE(
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'name',
    NEW.email
  );

  -- Insert the new profile, NOW INCLUDING A ROBUST PLACEHOLDER FOR PHONE
  INSERT INTO public.profiles (id, full_name, email, role, phone, has_completed_onboarding)
  VALUES (
    NEW.id,
    user_full_name,
    NEW.email,
    user_role,
    -- THE DEFINITIVE FIX:
    -- 1. Try to get the phone number from auth metadata (for social logins).
    -- 2. If it's not there, fall back to a placeholder that satisfies ALL constraints (NOT NULL and >= 10 chars).
    COALESCE(
      NEW.raw_user_meta_data->>'phone',
      '0000000000'
    ),
    false
  );

  -- ... (logic to update app_metadata remains the same) ...
  UPDATE auth.users
  SET raw_app_meta_data = COALESCE(raw_app_meta_data, '{}'::jsonb) || jsonb_build_object(
      'role', user_role,
      'onboarding_complete', false
  )
  WHERE id = NEW.id;
  
  RETURN NEW;
END;
$$;

-- Re-create the trigger
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();