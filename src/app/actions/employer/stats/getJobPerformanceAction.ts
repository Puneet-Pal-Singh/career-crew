// src/app/actions/employer/stats/getJobPerformanceAction.ts
"use server";

import { getSupabaseServerClient } from "@/lib/supabase/serverClient";
import { unstable_noStore as noStore } from 'next/cache';
import type { JobStatus } from '@/types';

// The final, clean data structure we want to return
export interface JobPerformanceData {
  id: number;
  title: string;
  status: JobStatus;
  applicationCount: number;
}

// A specific type to match the nested structure Supabase returns for this query
type SupabaseJobPerformanceResponse = {
  id: number;
  title: string;
  status: string;
  applications: { count: number }[];
};

// Use a Discriminated Union
type GetJobPerformanceResult =
  | { success: true; jobs: JobPerformanceData[] }
  | { success: false; error: string };

export async function getJobPerformanceAction(): Promise<GetJobPerformanceResult> {
  noStore();
  const supabase = await getSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Authentication required." };
  }

  // Fetch jobs and a count of their related applications.
  const { data, error } = await supabase
    .from('jobs')
    .select('id, title, status, applications(count)')
    .eq('employer_id', user.id)
    .order('created_at', { ascending: false })
    .limit(5);

  // Assert the type of the returned data to our specific Supabase response type
  const jobs = data as SupabaseJobPerformanceResponse[] | null;

  if (error) {
    console.error("Error fetching job performance:", error.message);
    return { success: false, error: "Failed to fetch job performance." };
  }
  if (!jobs) {
    return { success: true, jobs: [] };
  }
  
  // Coderabbit Suggestion: Safely map the data
  const mappedJobs: JobPerformanceData[] = jobs.map(job => ({
    id: job.id,
    title: job.title,
    status: job.status as JobStatus,
    // Safely access the nested array to prevent crashes
    applicationCount: job.applications?.[0]?.count ?? 0,
  }));

  return { success: true, jobs: mappedJobs };
}