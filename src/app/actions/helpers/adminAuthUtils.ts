// src/app/actions/helpers/adminAuthUtils.ts
"use server";

import { getSupabaseServerClient } from '@/lib/supabase/serverClient';
import type { UserProfile } from '@/types';

/**
 * SRP: This helper's Single Responsibility is to ensure the currently
 * authenticated user is a fully onboarded 'ADMIN'.
 * 
 * It is now self-contained and creates its own Supabase client, decoupling it
 * from the calling Server Action. This is a cleaner, more SOLID architecture.
 * 
 * @returns {Promise<{ user: UserProfile; error?: undefined } | { user?: undefined; error: string }>}
 *          An object containing the admin's UserProfile on success, or an error message on failure.
 */
export const ensureAdmin = async (): Promise<{ user: UserProfile; error?: undefined } | { user?: undefined; error: string }> => {
  const supabaseClient = await getSupabaseServerClient();
  const { data: { user: authUser }, error: authError } = await supabaseClient.auth.getUser();

  if (authError || !authUser) {
    return { error: "Authentication required for this admin action." };
  }

  const { data: userProfile, error: profileError } = await supabaseClient
    .from('profiles')
    .select('id, role, has_completed_onboarding, email, full_name, avatar_url, updated_at')
    .eq('id', authUser.id)
    .single<UserProfile>();

  if (profileError) {
    console.error("ensureAdmin: Error fetching profile.", profileError.message);
    return { error: "Failed to retrieve user profile to verify admin status." };
  }

  if (!userProfile) {
    return { error: "User profile not found. Cannot verify admin status." };
  }

  if (userProfile.role !== 'ADMIN' || !userProfile.has_completed_onboarding) {
    console.warn(`ensureAdmin: Non-admin attempted admin action.`, { role: userProfile.role });
    return { error: "Admin privileges required for this action." };
  }
  
  // The user is a confirmed admin. Return their full profile.
  return { user: userProfile };
};

/**
 * A lightweight helper to check if the current user is an admin.
 * Does not throw an error, returns a boolean.
 * Useful for permission checks, not for gatekeeping.
 */
export const checkIsAdmin = async (): Promise<boolean> => {
  const supabase = await getSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single<{ role: string }>();
    
  return profile?.role === 'ADMIN';
};