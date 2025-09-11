// src/app/actions/employer/getEmployerRecentApplicationsAction.ts
"use server";

import { getSupabaseServerClient } from "@/lib/supabase/serverClient";
import { unstable_noStore as noStore } from 'next/cache';
import type { ApplicationStatusOption } from '@/types';

// The final data structure for the frontend component
export interface EmployerApplicationPreview {
  id: string; 
  applicantName: string;
  jobTitle: string;
  appliedAt: string;
  status: ApplicationStatusOption;
}

// Define a type that matches the exact structure of the table
// returned by our 'get_employer_recent_applications' SQL function.
type RpcResponse = {
  id: string;
  applicant_name: string;
  job_title: string;
  applied_at: string; // The database timestamptz is returned as a string
  status: ApplicationStatusOption;
};

// Use a discriminated union for success and error cases
type ActionResult = 
  | { success: true; data: EmployerApplicationPreview[] }
  | { success: false; error: string };

export async function getEmployerRecentApplicationsAction(): Promise<ActionResult> {
  noStore();
  const supabase = await getSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Authentication required.");
  }

  // Call the database function
  const { data, error } = await supabase
    .rpc('get_employer_recent_applications', {
      employer_id_param: user.id
    });

  if (error) {
    console.error("Error calling RPC:", error.message);
    return { success: false, error: "Failed to load recent applications." };
  }
  if (!data) {
    return { success: true, data: [] };
  }

  // Cast the untyped 'data' from the RPC call to our specific RpcResponse type.
  // This removes the 'any' type.
  const typedData = data as RpcResponse[];

  // Now, when we map over 'typedData', the 'app' parameter is fully typed,
  // giving us autocomplete and type safety.
  const mappedApplications = typedData.map((app: RpcResponse) => ({
    id: app.id,
    applicantName: app.applicant_name || 'Unnamed Applicant',
    jobTitle: app.job_title,
    appliedAt: new Date(app.applied_at).toLocaleDateString(),
    status: app.status,
  }));

  return { success: true, data: mappedApplications };
}