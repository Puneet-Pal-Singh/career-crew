// src/app/actions/admin/getEmployerProfileForAdminAction.ts
"use server";

import { ensureAdmin } from '@/app/actions/helpers/adminAuthUtils';
import { getSupabaseServerClient } from '@/lib/supabase/serverClient';
import type { UserProfile } from '@/types';

interface ActionResult {
  success: boolean;
  error?: string;
  profile?: UserProfile;
}

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

    // 2. Data Fetching
    const supabase = await getSupabaseServerClient();
    const { data: profile, error: fetchError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', employerId)
      .single<UserProfile>();

    if (fetchError) {
      console.error(`[${actionName}] Error fetching profile for ID ${employerId}:`, fetchError.message);
      return { success: false, error: "Failed to fetch employer profile." };
    }

    if (!profile) {
      return { success: false, error: `No profile found for employer ID ${employerId}.` };
    }

    return { success: true, profile };

  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "An unexpected error occurred.";
    console.error(`[${actionName}] Unexpected error for employer ID ${employerId}:`, message);
    return { success: false, error: "An unexpected server error occurred." };
  }
}