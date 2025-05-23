// src/app/actions/helpers/adminAuthUtils.ts
"use server";

import type { SupabaseClient } from '@supabase/supabase-js';
import type { UserProfile } from '@/types'; // Assuming UserProfile is correctly defined in types

/**
 * Helper function to ensure the currently authenticated user has 'ADMIN' privileges.
 * Fetches the user's profile to verify their role.
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
    .select('id, role, email, updated_at, has_made_role_choice, full_name, avatar_url') // Select all fields of UserProfile
    .eq('id', authUser.id)
    .single<UserProfile>(); // Expect a single UserProfile record

  if (profileError) {
    console.error("ensureAdmin: Error fetching profile for user:", authUser.id, profileError.message);
    return { error: "Failed to retrieve user profile to verify admin status." };
  }
  if (!userProfileData) {
    console.warn("ensureAdmin: No profile found for authenticated user:", authUser.id);
    return { error: "User profile not found. Cannot verify admin status." };
  }

  if (userProfileData.role !== 'ADMIN') {
    console.warn(`ensureAdmin: User ${authUser.id} with role '${userProfileData.role}' attempted an admin action. Access denied.`);
    return { error: "Admin privileges required for this action." };
  }
  
  // console.log(`ensureAdmin: Admin check passed for user: ${authUser.id}`);
  return { user: userProfileData }; // On success, return the full UserProfile of the admin
};