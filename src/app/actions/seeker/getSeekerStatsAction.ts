// src/app/actions/seeker/getSeekerStatsAction.ts
"use server";

import { getSupabaseServerClient } from "@/lib/supabase/serverClient";

interface SeekerStats {
  totalApplications: number;
  activeApplications: number; // e.g., Submitted or Interviewing
  // Add more stats as needed
}

interface GetSeekerStatsResult {
  success: boolean;
  stats?: SeekerStats;
  error?: string;
}

export async function getSeekerDashboardStats(): Promise<GetSeekerStatsResult> {
  const supabase = await getSupabaseServerClient();
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "Authentication required." };

    // Fetch total applications count
    const { count: totalApplications, error: totalError } = await supabase
      .from('applications')
      .select('*', { count: 'exact', head: true })
      .eq('seeker_id', user.id);

    if (totalError) throw totalError;

    // Fetch active applications count
    const activeStatuses = ['SUBMITTED', 'VIEWED', 'INTERVIEWING'];
    const { count: activeApplications, error: activeError } = await supabase
      .from('applications')
      .select('*', { count: 'exact', head: true })
      .eq('seeker_id', user.id)
      .in('status', activeStatuses);

    if (activeError) throw activeError;

    return {
      success: true,
      stats: {
        totalApplications: totalApplications || 0,
        activeApplications: activeApplications || 0,
      }
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unexpected error.";
    return { success: false, error: message };
  }
}