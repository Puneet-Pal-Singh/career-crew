// src/app/actions/employer/getJobPerformanceAction.ts
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

export async function getJobPerformanceAction(): Promise<JobPerformanceData[]> {
  noStore();
  const supabase = await getSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Authentication required.");
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
    return [];
  }
  if (!jobs) {
    return [];
  }

  // Map the Supabase response to our clean, flat data structure
  return jobs.map((job): JobPerformanceData => ({
    id: job.id,
    title: job.title,
    status: job.status as JobStatus, // Safe to cast as we know the possible values
    // Supabase returns the count in an array; safely access it here
    applicationCount: job.applications[0]?.count ?? 0,
  }));
}