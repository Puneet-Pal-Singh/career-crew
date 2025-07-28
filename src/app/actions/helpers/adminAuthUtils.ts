// src/app/actions/helpers/adminAuthUtils.ts
"use server";

import type { SupabaseClient } from '@supabase/supabase-js';
import type { UserProfile } from '@/types';

/**
 * Helper function to ensure the currently authenticated user has 'ADMIN' privileges.
 * Fetches the user's profile to verify their role and that they are fully onboarded.
 * 
 * @param supabaseClient - An instance of the Supabase client.
 * @returns {Promise<{ user: UserProfile; error?: undefined } | { user?: undefined; error: string }>}
 *          An object containing the admin's UserProfile on success, or an error message on failure.
 */
export const ensureAdmin = async (
  supabaseClient: SupabaseClient
): Promise<{ user: UserProfile; error?: undefined } | { user?: undefined; error: string }> => {
  const { data: { user: authUser }, error: authError } = await supabaseClient.auth.getUser();

  if (authError || !authUser) {
    console.error("ensureAdmin: Authentication error or no user session.", authError);
    return { error: "Authentication required to perform this admin action." };
  }

  const { data: userProfileData, error: profileError } = await supabaseClient
    .from('profiles')
    // FIX: Select only the required columns and use the correct column name.
    .select('role, has_completed_onboarding')
    .eq('id', authUser.id)
    .single<{ role: string, has_completed_onboarding: boolean }>(); // Type the partial response

  if (profileError) {
    console.error("ensureAdmin: Error fetching profile for user:", authUser.id, profileError.message);
    return { error: "Failed to retrieve user profile to verify admin status." };
  }
  if (!userProfileData) {
    console.warn("ensureAdmin: No profile found for authenticated user:", authUser.id);
    return { error: "User profile not found. Cannot verify admin status." };
  }

  // FIX: Check for the correct role AND that onboarding is complete.
  if (userProfileData.role !== 'ADMIN' || !userProfileData.has_completed_onboarding) {
    console.warn(`ensureAdmin: User ${authUser.id} with role '${userProfileData.role}' and onboarding status '${userProfileData.has_completed_onboarding}' attempted an admin action. Access denied.`);
    return { error: "Admin privileges required for this action." };
  }
  
  // Cast the partial data to the full UserProfile type for the return,
  // as the rest of the function doesn't need the other fields.
  return { user: userProfileData as UserProfile };
};