// // src/app/actions/employer/getEmployerRecentApplicationsAction.ts
// "use server";

// import { getSupabaseServerClient } from "@/lib/supabase/serverClient";
// import { unstable_noStore as noStore } from 'next/cache';
// import type { ApplicationStatusOption } from '@/types';

// export interface EmployerApplicationPreview {
//   id: string; 
//   applicantName: string;
//   jobTitle: string;
//   appliedAt: string;
//   status: ApplicationStatusOption;
// }

// type SupabaseRecentApplicationResponse = {
//   id: string;
//   created_at: string;
//   status: string;
//   job: {
//     title: string;
//     employer_id: string;
//   } | null;
//   // This is the profile data, which will now be correctly fetched
//   profile: {
//     full_name: string;
//   } | null;
// };

// export async function getEmployerRecentApplicationsAction(): Promise<EmployerApplicationPreview[]> {
//   noStore();
//   const supabase = await getSupabaseServerClient();
//   const { data: { user } } = await supabase.auth.getUser();

//   if (!user) {
//     throw new Error("Authentication required.");
//   }

//   // --- THE FIX IS IN THIS QUERY ---
//   // We are now explicitly telling Supabase how to join 'applications' to 'profiles'.
//   // "profile:profiles!seeker_id(full_name)" means:
//   // "Use the 'seeker_id' column from 'applications' to link to the primary key of 'profiles'".
//   const { data, error } = await supabase
//     .from('applications')
//     .select(`
//       id,
//       created_at,
//       status,
//       job:jobs(title, employer_id),
//       profile:profiles!seeker_id(full_name) 
//     `)
//     .order('created_at', { ascending: false })
//     .limit(10); 

//   const applications = data as SupabaseRecentApplicationResponse[] | null;

//   if (error) {
//     console.error("Error fetching recent applications for employer:", error.message);
//     return [];
//   }
//   if (!applications) {
//     return [];
//   }

//   return applications
//     .filter((app): app is SupabaseRecentApplicationResponse & { job: NonNullable<SupabaseRecentApplicationResponse['job']> } => 
//       app.job?.employer_id === user.id
//     )
//     .slice(0, 3) 
//     .map((app): EmployerApplicationPreview => ({
//       id: app.id,
//       applicantName: app.profile?.full_name || 'Unnamed Applicant',
//       jobTitle: app.job.title, 
//       appliedAt: new Date(app.created_at).toLocaleDateString(),
//       status: app.status as ApplicationStatusOption,
//     }));
// }


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

export async function getEmployerRecentApplicationsAction(): Promise<EmployerApplicationPreview[]> {
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
    console.error("Error calling RPC get_employer_recent_applications:", error.message);
    return [];
  }
  if (!data) {
    return [];
  }

  // Cast the untyped 'data' from the RPC call to our specific RpcResponse type.
  // This removes the 'any' type.
  const typedData = data as RpcResponse[];

  // Now, when we map over 'typedData', the 'app' parameter is fully typed,
  // giving us autocomplete and type safety.
  return typedData.map((app: RpcResponse) => ({
    id: app.id,
    applicantName: app.applicant_name || 'Unnamed Applicant',
    jobTitle: app.job_title,
    appliedAt: new Date(app.applied_at).toLocaleDateString(),
    status: app.status,
  }));
}