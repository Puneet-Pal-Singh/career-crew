// src/app/actions/auth/updatePasswordAction.ts
"use server";

import { z } from "zod";
import { getSupabaseServerClient } from "@/lib/supabase/serverClient";

const updatePasswordSchema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters."),
});

interface ActionResult {
  success: boolean;
  error?: {
    message: string;
  };
}

export async function updatePasswordAction(input: { password: string }): Promise<ActionResult> {
  const validation = updatePasswordSchema.safeParse(input);

  if (!validation.success) {
    return {
      success: false,
      error: { message: "Invalid password provided." },
    };
  }

  const supabase = await getSupabaseServerClient();
  
  // First, verify that we have a logged-in user. This is a crucial security check.
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: { message: "You must be logged in to change your password." } };
  }

  // If we have a user, proceed with the password update.
  const { error } = await supabase.auth.updateUser({
    password: input.password,
  });

  if (error) {
    console.error("Update Password Error:", error.message);
    return { success: false, error: { message: "Failed to update password. Please try again." } };
  }

  return { success: true };
}