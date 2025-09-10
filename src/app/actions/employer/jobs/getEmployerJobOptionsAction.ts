// src/app/actions/employer/jobs/getEmployerJobOptionsAction.ts
"use server";

import { getSupabaseServerClient } from "@/lib/supabase/serverClient";

export interface JobOption {
  value: string;
  label: string;
}

export async function getEmployerJobOptionsAction(): Promise<JobOption[]> {
  const supabase = await getSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data: jobs, error } = await supabase
    .from('jobs')
    .select('id, title')
    .eq('employer_id', user.id)
    .order('created_at', { ascending: false });

  if (error || !jobs) return [];

  return jobs.map(job => ({
    value: String(job.id),
    label: job.title,
  }));
}