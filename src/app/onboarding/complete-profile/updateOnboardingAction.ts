// src/app/onboarding/complete-profile/updateOnboardingAction.ts
"use server";

import { getSupabaseServerClient } from "@/lib/supabase/serverClient";
import { z } from "zod";
import { revalidatePath } from 'next/cache';

const onboardingSchema = z.object({
  fullName: z.string().min(2, 'Full name is required.'),
  phone: z.string().optional(),
  // Zod validates that the role is one of these specific strings.
  role: z.enum(['JOB_SEEKER', 'EMPLOYER', 'ADMIN']),
});

export async function updateOnboardingAction(input: z.infer<typeof onboardingSchema>) {
  const supabase = await getSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Not authenticated." };
  }

  const validation = onboardingSchema.safeParse(input);
  if (!validation.success) {
    const errorMessages = validation.error.flatten().fieldErrors;
    console.error("Onboarding validation failed:", errorMessages);
    return { success: false, error: "Invalid data provided." };
  }

  const profileUpdateData = {
    full_name: validation.data.fullName,
    phone: validation.data.phone,
    role: validation.data.role,
    has_completed_onboarding: true
  };

  const { error } = await supabase
    .from('profiles')
    .update(profileUpdateData)
    .eq('id', user.id);

  if (error) {
    console.error("Onboarding profile update error:", error);
    return { success: false, error: "Failed to update your profile. Please try again." };
  }
  
  revalidatePath('/dashboard');
  return { success: true };
}