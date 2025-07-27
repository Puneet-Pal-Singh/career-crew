// src/app/actions/auth/loginUserAction.ts
"use server";

import { z } from "zod";
import { getSupabaseServerClient } from "@/lib/supabase/serverClient";

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

  // A simple safety check to ensure we only redirect to internal pages.
  const finalRedirectTo = (redirectTo && redirectTo.startsWith('/')) ? redirectTo : '/dashboard';

  // FIX: Return the redirect path to the client
  return { success: true, redirectTo: finalRedirectTo };
}