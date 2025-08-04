// src/app/actions/auth/forgotPasswordAction.ts
"use server";

import { z } from "zod";
import { getSupabaseServerClient } from "@/lib/supabase/serverClient";

const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
});

interface ActionResult {
  success: boolean;
  error?: {
    message: string;
  };
}

export async function forgotPasswordAction(input: { email: string }): Promise<ActionResult> {
  const validation = forgotPasswordSchema.safeParse(input);

  if (!validation.success) {
    return {
      success: false,
      error: { message: "Invalid email provided." },
    };
  }

  const { email } = validation.data;
  const supabase = await getSupabaseServerClient();

  // ✅ THE FIX: Point directly to the update password page.
  // Supabase's confirmation URL will now correctly land the user on this page
  // with a valid session, ready to update their password.
  const redirectUrl = `${process.env.NEXT_PUBLIC_APP_URL}/update-password`;

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: redirectUrl,
  });

  if (error) {
    // Do not expose detailed errors to the client for security.
    // e.g., "User not found" can be used to probe for existing emails.
    console.error("Forgot Password Error:", error.message);
    // Return a generic success message regardless of whether the user exists.
    // This prevents email enumeration attacks.
    return { success: true };
  }

  // Always return success to prevent leaking information about which emails are registered.
  return { success: true };
}