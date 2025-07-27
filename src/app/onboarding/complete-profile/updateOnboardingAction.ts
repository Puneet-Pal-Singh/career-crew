// src/app/onboarding/complete-profile/updateOnboardingAction.ts
"use server";

import { getSupabaseServerClient } from "@/lib/supabase/serverClient";
import { z } from "zod";
import { revalidatePath } from 'next/cache';
import { adminSupabase } from "@/lib/supabase/adminClient";

const onboardingSchema = z.object({
  fullName: z.string().min(2, 'Full name is required.'),
  phone: z.string().optional(),
  role: z.enum(['JOB_SEEKER', 'EMPLOYER']),
  redirectTo: z.string().nullable().optional(),
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
  const { fullName, phone, role, redirectTo } = validation.data;

  // Step 1: Use the ADMIN client to perform a privileged update.
  // This is now the definitive source of truth for setting the final role and
  // completing onboarding, bypassing any restrictive user RLS policies.
  const { error: profileUpdateError } = await adminSupabase
    .from('profiles')
    .update({
      full_name: fullName,
      phone: phone,
      role: role, // The correct role is definitively set here.
      has_completed_onboarding: true
    })
    .eq('id', user.id);

  if (profileUpdateError) {
    console.error("Onboarding profile update error:", profileUpdateError);
    return { success: false, error: "Failed to update your profile." };
  }
  
  // Step 2: Update the JWT metadata on the Supabase server.
  const { error: metadataError } = await adminSupabase.auth.admin.updateUserById(
    user.id,
    { app_metadata: { onboarding_complete: true, role: role } }
  );

  if (metadataError) {
    console.error("Onboarding auth metadata update error:", metadataError);
  }

  // Step 3: CRITICAL FIX - Force a session refresh.
  // This tells the browser to get the new JWT with the updated metadata
  // BEFORE the user is redirected to the dashboard.
  await supabase.auth.refreshSession();

  revalidatePath('/dashboard', 'layout');
  // FIX: Determine the final redirect path
  const finalRedirectTo = (redirectTo && redirectTo.startsWith('/')) ? redirectTo : '/dashboard';
  return { success: true, redirectTo: finalRedirectTo };
}
