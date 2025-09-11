// src/app/actions/employer/stats/getEmployerDashboardStatsAction.ts
"use server";

import { getSupabaseServerClient } from "@/lib/supabase/serverClient";
import { unstable_noStore as noStore } from 'next/cache';
import { JOB_STATUS } from '@/types'; // Import the constant

export interface EmployerStats {
  activeJobs: number;
  pendingJobs: number;
  archivedJobs: number;
  totalJobs: number;
}

// Use a Discriminated Union
type GetEmployerDashboardStatsResult =
  | { success: true; stats: EmployerStats }
  | { success: false; error: string };

export async function getEmployerDashboardStatsAction(): Promise<GetEmployerDashboardStatsResult> {
  noStore(); 
  const supabase = await getSupabaseServerClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: "Authentication required." };
  }

  try {
    const [
      { count: activeJobs },
      { count: pendingJobs },
      { count: archivedJobs },
      { count: totalJobs }
    ] = await Promise.all([
      // Use the constant for type safety and to prevent typos
      supabase.from('jobs').select('id', { count: 'exact', head: true }).eq('employer_id', user.id).eq('status', JOB_STATUS.APPROVED),
      supabase.from('jobs').select('id', { count: 'exact', head: true }).eq('employer_id', user.id).eq('status', JOB_STATUS.PENDING_APPROVAL),
      supabase.from('jobs').select('id', { count: 'exact', head: true }).eq('employer_id', user.id).eq('status', JOB_STATUS.ARCHIVED),
      
      // The total count doesn't need a status filter
      supabase.from('jobs').select('id', { count: 'exact', head: true }).eq('employer_id', user.id)
    ]);

    return {
      success: true,
      stats: {
        activeJobs: activeJobs ?? 0,
        pendingJobs: pendingJobs ?? 0,
        archivedJobs: archivedJobs ?? 0,
        totalJobs: totalJobs ?? 0,
      }
    };
  } catch (err) {
    console.error("getEmployerDashboardStatsAction: count error", err);
    return { success: false, error: "Failed to load employer stats." };
  }
}