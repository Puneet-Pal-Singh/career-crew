// src/app/actions/application/getMyApplicationsAction.ts

import { getSupabaseServerClient } from '@/lib/supabase/serverClient';
import type { ApplicationViewData, ApplicationStatusOption } from '@/types'; // Add new types

// --- Result Type for getMyApplications ---
interface GetMyApplicationsResult {
  success: boolean;
  applications?: ApplicationViewData[];
  error?: string;
}

// Helper type for the raw structure of the joined job data from Supabase
interface RawJoinedJobData {
  title: string;
  company_name: string;
  // Add other job fields here if you select them in the join
}

// Helper type for the raw application data from Supabase, including the nested job
interface RawApplicationWithJob {
  id: string;
  created_at: string;
  status: string; // This will be one of ApplicationStatusOption values
  job_id: number; // FIX: Changed from string to number
  jobs: RawJoinedJobData | RawJoinedJobData[] | null; // Supabase might return object or array for join
}

/**
 * Fetches all job applications submitted by the currently authenticated seeker.
 * 
 * @returns {Promise<GetMyApplicationsResult>} An object containing the success status,
 *                                             an array of application view data, or an error message.
 */
export async function getMyApplications(): Promise<GetMyApplicationsResult> {
  const supabase = await getSupabaseServerClient();
  const actionName = "getMyApplications";

  try {
    const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
    if (authError || !authUser) {
      return { success: false, error: "Authentication required." };
    }

    // console.log(`Server Action (${actionName}): Fetching applications for seeker ${authUser.id}.`);

    const { data: applicationsData, error: fetchError } = await supabase
      .from('applications')
      .select(`
        id, 
        created_at, 
        status, 
        job_id,
        jobs ( title, company_name ) 
      `)
      .eq('seeker_id', authUser.id)
      .order('created_at', { ascending: false });

    if (fetchError) {
      console.error(`Server Action (${actionName}): Error fetching applications. Message:`, fetchError.message);
      return { success: false, error: `Failed to fetch your applications: ${fetchError.message}` };
    }

    if (!applicationsData) {
      // console.log(`Server Action (${actionName}): No applications found for seeker ${authUser.id}.`);
      return { success: true, applications: [] };
    }

    const typedApplicationsData = applicationsData as RawApplicationWithJob[];

    const displayApplications: ApplicationViewData[] = typedApplicationsData.map(app => {
      let jobInfo: RawJoinedJobData | null = null;

      // Handle if app.jobs is an array or a single object (or null)
      if (app.jobs) {
        if (Array.isArray(app.jobs) && app.jobs.length > 0) {
          jobInfo = app.jobs[0];
        } else if (!Array.isArray(app.jobs)) { // It's a single object
          jobInfo = app.jobs as RawJoinedJobData;
        }
      }

      return {
        applicationId: app.id,
        jobId: app.job_id, // This is now a number
        jobTitle: jobInfo?.title || "Job Title Unavailable",
        companyName: jobInfo?.company_name || "Company Unavailable",
        dateApplied: new Date(app.created_at).toLocaleDateString('en-US', {
          year: 'numeric', month: 'short', day: 'numeric'
        }),
        applicationStatus: app.status as ApplicationStatusOption, // Ensure this matches your type
      };
    }).filter(app => app.jobTitle !== "Job Title Unavailable"); // Optional: filter out if essential job info missing

    // console.log(`Server Action (${actionName}): Fetched ${displayApplications.length} applications.`);
    return { success: true, applications: displayApplications };

  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "An unexpected error occurred.";
    console.error(`Server Action (${actionName}): Unexpected error. Message:`, message, err);
    return { success: false, error: "An unexpected error occurred while fetching your applications." };
  }
}