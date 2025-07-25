"use server";

import { getSupabaseServerClient } from "@/lib/supabase/serverClient";
import { z } from "zod";
import { revalidatePath } from 'next/cache';
// --- NEW: Import the admin client for updating auth metadata ---
import { adminSupabase } from "@/lib/supabase/adminClient";

const onboardingSchema = z.object({
  fullName: z.string().min(2, 'Full name is required.'),
  phone: z.string().optional(),
  role: z.enum(['JOB_SEEKER', 'EMPLOYER']),
});

export async function updateOnboardingAction(input: z.infer<typeof onboardingSchema>) {
  const supabase = await getSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Not authenticated." };
  }

  const validation = onboardingSchema.safeParse(input);
  if (!validation.success) {
    return { success: false, error: "Invalid data provided." };
  }

  // 1. Update the database profile (your source of truth)
  const { error: profileError } = await supabase
    .from('profiles')
    .update({
      full_name: validation.data.fullName,
      phone: validation.data.phone,
      role: validation.data.role,
      has_completed_onboarding: true
    })
    .eq('id', user.id);

  if (profileError) {
    console.error("Onboarding profile update error:", profileError);
    return { success: false, error: "Failed to update your profile. Please try again." };
  }
  
  // --- NEW: Update the JWT metadata for fast middleware checks ---
  const { error: metadataError } = await adminSupabase.auth.admin.updateUserById(
    user.id,
    { app_metadata: { onboarding_complete: true, role: validation.data.role } }
  );

  if (metadataError) {
    // Log this error, but don't block the user. The primary DB write was successful.
    console.error("Onboarding auth metadata update error:", metadataError);
  }

  revalidatePath('/dashboard');
  return { success: true };
}