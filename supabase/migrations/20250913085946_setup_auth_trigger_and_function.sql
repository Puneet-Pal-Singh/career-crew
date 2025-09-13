-- This migration ensures the user profile creation process is robust and correct.
-- It drops any existing versions of the function and trigger to ensure a clean slate,
-- then recreates them with the correct logic and security settings.

-- Step 1: Drop the existing trigger and function to prevent conflicts.
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Step 2: Re-create the handle_new_user function with your proven logic
-- and the critical 'SECURITY DEFINER' setting.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
-- This is the key fix: It makes the function run with the privileges of the user who created it (postgres),
-- allowing it to bypass RLS and write to both public.profiles and auth.users.
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  user_role public.user_role;
  user_full_name text;
BEGIN
  -- Extract role from metadata, with fallback
  user_role := COALESCE(
    (NEW.raw_user_meta_data->>'role')::public.user_role,
    'JOB_SEEKER'  -- Default fallback
  );

  -- Extract full name with multiple fallback options
  user_full_name := COALESCE(
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'name',  -- Google OAuth often uses 'name'
    NEW.email  -- Last resort fallback
  );

  -- Insert the new profile
  INSERT INTO public.profiles (id, full_name, email, role, has_completed_onboarding)
  VALUES (
    NEW.id,
    user_full_name,
    NEW.email,
    user_role,
    false
  );

  -- Update app_metadata for JWT claims
  UPDATE auth.users
  SET raw_app_meta_data = COALESCE(raw_app_meta_data, '{}'::jsonb) || jsonb_build_object(
      'role', user_role,
      'onboarding_complete', false
  )
  WHERE id = NEW.id;
  
  RETURN NEW;
END;
$$;

-- Step 3: Re-create the trigger to attach the function to the auth.users table.
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();