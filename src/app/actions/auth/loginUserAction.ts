// src/app/actions/auth/loginUserAction.ts
"use server";

import { z } from "zod";
import { getSupabaseServerClient } from "@/lib/supabase/serverClient";
// Import the security utility
import { getPostAuthRedirectUrl } from "@/lib/utils";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, "Password is required"),
  redirectTo: z.string().optional(),
});

export async function loginUserAction(input: z.infer<typeof loginSchema>) {
  const validation = loginSchema.safeParse(input);
  if (!validation.success) {
    return { success: false, error: { message: "Invalid input." } };
  }

  const supabase = await getSupabaseServerClient();
  const { email, password, redirectTo } = validation.data;

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { success: false, error: { message: "Invalid email or password." } };
  }

   // Use the centralized redirect URL function
   const finalRedirectTo = getPostAuthRedirectUrl(redirectTo);

   return { success: true, redirectTo: finalRedirectTo };
}