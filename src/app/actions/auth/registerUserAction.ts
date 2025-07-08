// src/app/actions/auth/registerUserAction.ts
"use server";

import { z } from "zod";
import { getSupabaseServerClient } from "@/lib/supabase/serverClient";
import type { UserRole } from "@/types";

// Define the schema for input validation
const registerSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["JOB_SEEKER", "EMPLOYER"]),
});

interface RegisterResult {
  success: boolean;
  error?: {
    message: string;
  };
}

export async function registerUserAction(input: {
  fullName: string;
  email: string;
  password: string;
  role: UserRole;
}): Promise<RegisterResult> {
  const validation = registerSchema.safeParse(input);

  if (!validation.success) {
    return {
      success: false,
      error: { message: "Invalid input: " + validation.error.flatten().fieldErrors, }
    };
  }

  const supabase = await getSupabaseServerClient();
  const { fullName, email, password, role } = validation.data;

  // Sign up the user in Supabase Auth
  const { data: { user }, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      // You can pass additional metadata here if needed
      data: {
        full_name: fullName,
        // The role will be set in the profiles table directly
      },
    },
  });

  if (signUpError) {
    console.error("Sign-up Error:", signUpError.message);
    // Provide a more user-friendly message
    if (signUpError.message.includes("User already registered")) {
        return { success: false, error: { message: "An account with this email already exists." } };
    }
    return { success: false, error: { message: signUpError.message } };
  }

  if (!user) {
    return { success: false, error: { message: "User registration failed, please try again." } };
  }
  
  // The DB trigger creates the profile. Now, update it with the role and name.
  // This is a critical step.
  const { error: profileError } = await supabase
    .from("profiles")
    .update({ 
        role: role,
        full_name: fullName 
    })
    .eq("id", user.id);

  if (profileError) {
    console.error("Profile Update Error:", profileError.message);
    // This is an unfortunate state, user is created but profile is not. 
    // You might want to add more robust error handling here later.
    return { success: false, error: { message: "Could not set user role." } };
  }

  return { success: true };
}