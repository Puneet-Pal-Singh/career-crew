// // src/app/actions/auth/loginUserAction.ts
// "use server";

// import { z } from "zod";
// import { getSupabaseServerClient } from "@/lib/supabase/serverClient";
// import type { UserRole } from "@/types";

// const loginSchema = z.object({
//   email: z.string().email(),
//   password: z.string().min(1, "Password is required"),
//   role: z.enum(["JOB_SEEKER", "EMPLOYER"]),
// });

// interface LoginResult {
//   success: boolean;
//   error?: {
//     message: string;
//   };
// }

// export async function loginUserAction(input: {
//   email: string;
//   password: string;
//   role: UserRole;
// }): Promise<LoginResult> {
//   const validation = loginSchema.safeParse(input);
//   if (!validation.success) {
//     return { success: false, error: { message: "Invalid input." } };
//   }

//   const supabase = await getSupabaseServerClient();
//   const { email, password, role } = validation.data;

//   // First, check if the user exists and what their actual role is.
//   const { data: profile, error: profileError } = await supabase
//     .from("profiles")
//     .select("role")
//     .eq("email", email)
//     .single();

//   if (profileError || !profile) {
//     return { success: false, error: { message: "Invalid email or password." } };
//   }

//   // This is our core business logic!
//   if (profile.role !== role) {
//     const attemptedRole = role === 'JOB_SEEKER' ? 'Job Seeker' : 'Employer';
//     const actualRole = profile.role === 'JOB_SEEKER' ? 'a Job Seeker' : 'an Employer';
//     return { 
//       success: false, 
//       error: { message: `You are trying to log in as a ${attemptedRole}, but this account is registered as ${actualRole}.` } 
//     };
//   }

//   // If roles match, proceed to sign in.
//   const { error: signInError } = await supabase.auth.signInWithPassword({
//     email,
//     password,
//   });

//   if (signInError) {
//     return { success: false, error: { message: "Invalid email or password." } };
//   }

//   return { success: true };
// }


// src/app/actions/auth/loginUserAction.ts
"use server";

import { z } from "zod";
import { getSupabaseServerClient } from "@/lib/supabase/serverClient";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, "Password is required"),
});

export async function loginUserAction(input: z.infer<typeof loginSchema>) {
  const validation = loginSchema.safeParse(input);
  if (!validation.success) {
    return { success: false, error: { message: "Invalid input." } };
  }

  const supabase = await getSupabaseServerClient();
  const { email, password } = validation.data;

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { success: false, error: { message: "Invalid email or password." } };
  }

  return { success: true };
}