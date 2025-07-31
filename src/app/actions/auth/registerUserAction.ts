// src/app/actions/auth/registerUserAction.ts
"use server";

import { z } from "zod";
import { getSupabaseServerClient } from "@/lib/supabase/serverClient";
// import type { UserRole } from "@/types";

const registerSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  // The action only accepts roles that can be created via a public form.
  role: z.enum(["JOB_SEEKER", "EMPLOYER"]),
});

interface RegisterResult {
  success: boolean;
  error?: { message: string; };
}

// Ensure the input type matches the stricter schema
export async function registerUserAction(input: z.infer<typeof registerSchema>): Promise<RegisterResult> {
  const validation = registerSchema.safeParse(input);

  if (!validation.success) {
    return { success: false, error: { message: "Invalid input: " + JSON.stringify(validation.error.flatten().fieldErrors) }};
  }

  const supabase = await getSupabaseServerClient();
  const { fullName, email, password, role } = validation.data;

  const { error: signUpError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      // ✅ THE FIX: Pass the role directly in the metadata.
      // This allows the database trigger to set the correct role from the start.
      data: {
        full_name: fullName,
        role: role, 
      },
    },
  });

  if (signUpError) {
    if (signUpError.message.includes("User already registered")) {
        return { success: false, error: { message: "An account with this email already exists." } };
    }
    return { success: false, error: { message: signUpError.message } };
  }

  // ❌ The old, failing `.update()` call has been removed.

  return { success: true };
}