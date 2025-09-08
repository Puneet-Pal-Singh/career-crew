// src/app/actions/seeker/applications/getRecentApplicationsAction.ts

"use server";

import { getSupabaseServerClient } from "@/lib/supabase/serverClient";
// Make sure both these types are imported from your main types file
import type { RecentApplication, ApplicationStatusOption } from '@/types';

interface GetRecentApplicationsResult {
  success: boolean;
  applications?: RecentApplication[];
  error?: string;
}

export async function getRecentApplicationsAction(): Promise<GetRecentApplicationsResult> {
  const supabase = await getSupabaseServerClient();
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "Authentication required." };

    // The select query is correct. The issue is in how we process the result.
    const { data: applications, error } = await supabase
      .from('applications')
      .select(`
        id,
        status,
        created_at,
        jobs (
          id,
          title,
          company_name
        )
      `)
      .eq('seeker_id', user.id)
      .order('created_at', { ascending: false })
      .limit(4);

    if (error) throw error;
    if (!applications) return { success: true, applications: [] };

    // --- START OF CORRECTION ---

    // Map the data, handling the fact that `jobs` is returned as an array.
    const mappedApplications: RecentApplication[] = applications
      // 1. Filter out any applications where the related job might be missing.
      // This makes our code safer. `app.jobs` can be an object or an array based on DB relations.
      // We check for both and ensure it's not empty.
      .filter(app => {
        if (!app.jobs) return false;
        // If it's an array, ensure it has items. If it's an object, it's valid.
        return Array.isArray(app.jobs) ? app.jobs.length > 0 : true;
      })
      // 2. Map the filtered applications to our desired flat structure.
      .map(app => {
        // Handle both cases: `jobs` could be an object or an array of one object.
        const job = Array.isArray(app.jobs) ? app.jobs[0] : app.jobs;
        
        return {
          applicationId: app.id,
          // Correctly cast the status to our specific type, avoiding 'any'.
          applicationStatus: app.status as ApplicationStatusOption,
          dateApplied: new Date(app.created_at).toLocaleDateString(),
          // Now we can safely access properties on the `job` object.
          jobId: job.id,
          jobTitle: job.title,
          companyName: job.company_name,
        };
      });
    
    // --- END OF CORRECTION ---

    return {
      success: true,
      applications: mappedApplications,
    };

  } catch (err) {
    const message = err instanceof Error ? err.message : "Unexpected error.";
    console.error("Error in getRecentApplicationsAction:", message);
    return { success: false, error: message };
  }
}