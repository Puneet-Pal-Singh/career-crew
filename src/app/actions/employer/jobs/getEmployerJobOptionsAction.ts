// src/app/actions/employer/jobs/getEmployerJobOptionsAction.ts
"use server";

import { getSupabaseServerClient } from "@/lib/supabase/serverClient";

export interface JobOption {
  value: string;
  label: string;
}

// Use a Discriminated Union and add a role check
type GetEmployerJobOptionsResult =
  | { success: true; options: JobOption[] }
  | { success: false; error: string };

export async function getEmployerJobOptionsAction(): Promise<GetEmployerJobOptionsResult> {
  const supabase = await getSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return { success: false, error: "Authentication required." };
  }

  // Added security check as suggested
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profileError || !profile || profile.role !== 'EMPLOYER') {
    return { success: false, error: "Only employers can access their jobs." };
  }

  const { data: jobs, error } = await supabase
    .from('jobs')
    .select('id, title')
    .eq('employer_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching job options:", error.message);
    return { success: false, error: "Failed to fetch job options." };
  }

  return { 
    success: true, 
    options: jobs.map(job => ({
      value: String(job.id),
      label: job.title,
    })) 
  };
}