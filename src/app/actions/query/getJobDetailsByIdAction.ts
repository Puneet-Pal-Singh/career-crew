// // src/app/actions/query/getJobDetailsByIdAction.ts
// "use server";

// import { getSupabaseServerClient } from '@/lib/supabase/serverClient';
// import type { JobDetailData, JobTypeOption } from '@/types';

// interface RawJobDetailFromSupabase {
//   id: number; // This is correct
//   title: string;
//   company_name: string;
//   company_logo_url: string | null;
//   location: string;
//   is_remote: boolean;
//   job_type: string | null;
//   salary_min: number | null;
//   salary_max: number | null;
//   salary_currency: string | null;
//   created_at: string;
//   description: string;
//   requirements: string | null;
//   application_email: string | null;
//   application_url: string | null;
//   status: string;
// }

// /**
//  * Fetches the full details for a single 'APPROVED' job by its ID.
//  * @param jobId - The ID of the job to fetch.
//  * @returns {Promise<JobDetailData | null>} The detailed job data, or null if not found or on error.
//  */
// // FIX: The function must accept a 'number' for the jobId.
// export async function getJobDetailsById(jobId: number): Promise<JobDetailData | null> {
//   // FIX: The old safety check was incorrect. A simple check for a valid number is enough.
//   if (!jobId) {
//     console.warn("getJobDetailsById: No jobId provided.");
//     return null;
//   }

//   const supabase = await getSupabaseServerClient();
//   const actionName = "getJobDetailsById";

//   try {
//     const { data: rawJob, error } = await supabase
//       .from('jobs')
//       .select(`*`) // Simplified select for clarity
//       .eq('id', jobId)
//       .eq('status', 'APPROVED')
//       .single<RawJobDetailFromSupabase>();

//     if (error) {
//       if (error.code === 'PGRST116') {
//         console.log(`Server Action (${actionName}): Job not found or not approved for ID: ${jobId}`);
//       } else {
//         console.error(`Server Action (${actionName}): Supabase error for job ${jobId}. Message:`, error.message);
//       }
//       return null;
//     }

//     if (!rawJob) {
//       return null;
//     }

//     const jobDetail: JobDetailData = {
//       id: rawJob.id,
//       title: rawJob.title,
//       companyName: rawJob.company_name,
//       companyLogoUrl: rawJob.company_logo_url || '/company-logos/default-company-logo.svg',
//       location: rawJob.location,
//       isRemote: rawJob.is_remote,
//       jobType: (rawJob.job_type as JobTypeOption) || undefined,
//       salaryMin: rawJob.salary_min,
//       salaryMax: rawJob.salary_max,
//       salaryCurrency: rawJob.salary_currency,
//       postedDate: new Date(rawJob.created_at).toLocaleDateString('en-US', {
//         year: 'numeric', month: 'long', day: 'numeric',
//       }),
//       description: rawJob.description,
//       requirements: rawJob.requirements,
//       applicationEmail: rawJob.application_email,
//       applicationUrl: rawJob.application_url,
//     };
    
//     return jobDetail;

//   } catch (err: unknown) {
//     const message = err instanceof Error ? err.message : "Unknown error occurred.";
//     console.error(`Server Action (${actionName}): Unexpected error for job ID ${jobId}. Message:`, message, err);
//     return null;
//   }
// }


// src/app/actions/query/getJobDetailsByIdAction.ts
"use server";

import { getSupabaseServerClient } from '@/lib/supabase/serverClient';
import type { JobDetailData } from '@/types';
import { mapRawJobToJobDetailData, type RawJobDataForDetail } from '@/app/actions/helpers/jobDataMappers';

export async function getJobDetailsById(jobId: number): Promise<JobDetailData | null> {
  if (!Number.isFinite(jobId) || jobId <= 0) {
    return null;
  }

  const supabase = await getSupabaseServerClient();
  
  try {
    const { data: rawJob, error } = await supabase
      .from('jobs')
      .select(`*, tags`)
      .eq('id', jobId)
      .eq('status', 'APPROVED')
      .single<RawJobDataForDetail>();

    if (error) {
      return null;
    }

    if (!rawJob) {
      return null;
    }

    return mapRawJobToJobDetailData(rawJob);

  } catch (err: unknown) {
    console.error(`getJobDetailsById: Unexpected error for job ID ${jobId}.`, err);
    return null;
  }
}