// src/app/onboarding/complete-profile/updateOnboardingAction.ts
"use server";

import { getSupabaseServerClient } from "@/lib/supabase/serverClient";
import { z } from "zod";

const onboardingSchema = z.object({
  fullName: z.string().min(2, 'Full name is required.'),
  companyName: z.string().optional(),
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

  const { error } = await supabase
    .from('profiles')
    .update({ 
      full_name: validation.data.fullName,
      // You can add company_name to your profiles table and update it here
      has_completed_onboarding: true // This is the most important part!
    })
    .eq('id', user.id);

  if (error) {
    return { success: false, error: "Failed to update profile." };
  }
  
  return { success: true };
}