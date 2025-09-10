// src/app/actions/employer/applications/getAllApplicationsAction.ts
"use server";

import { getSupabaseServerClient } from "@/lib/supabase/serverClient";
import { unstable_noStore as noStore } from 'next/cache';
import { APPLICATION_STATUS_OPTIONS, type ApplicationStatusOption } from '@/types'; 

// The final data structure for each application row
export interface EmployerApplication {
  id: string;
  applicantName: string;
  jobTitle: string;
  appliedAt: string;
  status: ApplicationStatusOption;
}

// The complete result, including pagination info
export interface PaginatedApplicationsResponse {
  applications: EmployerApplication[];
  totalCount: number;
}

// The type for the raw data returned by our SQL function
type RpcResponse = {
  id: string;
  applicant_name: string;
  job_title: string;
  applied_at: string;
  status: ApplicationStatusOption;
  total_count: number;
};

export async function getAllApplicationsAction(
  params: {
    page: number;
    jobId?: number | null;
    status?: string | null;
  }
): Promise<PaginatedApplicationsResponse> {
  noStore();
  const supabase = await getSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Authentication required.");
  }

  const pageSize = 10; // Define how many applications per page

  // Validate and cast the status parameter to ensure it's a valid enum value
  const validStatus = APPLICATION_STATUS_OPTIONS.includes(params.status as ApplicationStatusOption) 
    ? params.status as ApplicationStatusOption 
    : null;

  // Call the updated RPC with all parameters
  const { data, error } = await supabase.rpc('get_employer_applications', {
    employer_id_param: user.id,
    page_size: pageSize,
    page_number: params.page,
    job_id_filter: params.jobId,
    status_filter: validStatus,
  });

  if (error) {
    console.error("Error calling RPC get_employer_applications:", error.message);
    return { applications: [], totalCount: 0 };
  }

  const typedData = data as RpcResponse[];
  if (!typedData || typedData.length === 0) {
    return { applications: [], totalCount: 0 };
  }

  const applications = typedData.map((app): EmployerApplication => ({
    id: app.id,
    applicantName: app.applicant_name || 'Unnamed Applicant',
    jobTitle: app.job_title,
    appliedAt: new Date(app.applied_at).toLocaleDateString(),
    status: app.status,
  }));

  // The total count is the same for every row, so we take it from the first one.
  const totalCount = typedData[0].total_count;

  return { applications, totalCount };
}