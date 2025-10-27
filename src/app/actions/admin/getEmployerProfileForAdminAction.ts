// src/app/actions/admin/getEmployerProfileForAdminAction.ts
"use server";

import { ensureAdmin } from '@/app/actions/helpers/adminAuthUtils';
import { adminSupabase } from '@/lib/supabase/adminClient'; // THE FIX: Import the client instance
import type { UserProfile, UserRole } from '@/types';

// THE FIX: Use a discriminated union for a stricter and safer return type.
type ActionResult = 
  | { success: true; profile: UserProfile }
  | { success: false; error: string };
  
/**
 * Fetches the full profile for a specific user (employer).
 * Requires ADMIN privileges.
 *
 * @param {string} employerId - The UUID of the employer profile to fetch.
 * @returns {Promise<ActionResult>}
 */
export async function getEmployerProfileForAdminAction(employerId: string): Promise<ActionResult> {
  const actionName = "getEmployerProfileForAdminAction";

  // Input validation
  if (!employerId) {
    return { success: false, error: "Employer ID is required." };
  }

  try {
    // 1. Security Check: Ensure the caller is an admin.
    const { error: adminError } = await ensureAdmin();
    if (adminError) {
      return { success: false, error: adminError };
    }

    // THE FIX: Use the imported adminSupabase client directly.
    // 1. Fetch the core user data from auth.users.
    const { data: { user: authUser }, error: authUserError } = await adminSupabase.auth.admin.getUserById(employerId);

    if (authUserError) {
      console.error(`[${actionName}] Error fetching user from auth.users:`, authUserError.message);
      return { success: false, error: "Failed to fetch core user data." };
    }
    if (!authUser) {
      return { success: false, error: `No user found in auth.users for ID ${employerId}.` };
    }

    // 2. Fetch the supplemental profile data from public.profiles.
    const { data: profileData, error: profileError } = await adminSupabase
      .from('profiles')
      .select('full_name, avatar_url, role, has_completed_onboarding, updated_at')
      .eq('id', employerId)
      .single();

    if (profileError && profileError.code !== 'PGRST116') { // Ignore "0 rows" error
      console.warn(`[${actionName}] Could not fetch profile for a user.`, profileError.message);
    }
    
    // 3. Combine the data.
    const combinedProfile: UserProfile = {
      id: authUser.id,
      email: authUser.email || 'No email provided',
      full_name: profileData?.full_name ?? 'N/A',
      avatar_url: profileData?.avatar_url ?? null,
      // THE FIX: Add explicit cast for type safety.
      role: (profileData?.role ?? 'JOB_SEEKER') as UserRole,
      has_completed_onboarding: profileData?.has_completed_onboarding ?? false,
      updated_at: profileData?.updated_at ?? authUser.updated_at ?? new Date().toISOString(),
    };

    return { success: true, profile: combinedProfile };

  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "An unexpected error occurred.";
    console.error(`[${actionName}] Unexpected error for employer ID ${employerId}:`, message);
    return { success: false, error: "An unexpected server error occurred." };
  }
}