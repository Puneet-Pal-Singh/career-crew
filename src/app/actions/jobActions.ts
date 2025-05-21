// // src/app/actions/jobActions.ts
// "use server";

// import { createServerClient, type CookieOptions } from '@supabase/ssr';
// import { cookies } from 'next/headers';
// import type { JobCardData } from '@/types';

// // --- Helper Types for Raw Supabase Data ---
// interface SupabaseProfileEmbed {
//   email: string | null;
//   full_name: string | null;
// }

// interface RawJobFromSupabase {
//   id: string;
//   title: string;
//   company_name: string;
//   company_logo_url: string | null;
//   location: string;
//   job_type: string | null;
//   is_remote: boolean;
//   salary_min: number | null;
//   salary_max: number | null;
//   salary_currency: string | null;
//   created_at: string;
//   status: string;
//   employer_id: string;
//   // Corrected based on TypeScript error: Supabase returns the joined data as 'profile' (singular)
//   profile: SupabaseProfileEmbed[]; // This should be an array if multiple profiles could match,
//                                    // or SupabaseProfileEmbed | null if it's a strict one-to-one via !inner hint.
//                                    // Given the error `profile: { ...; }[]`, it's an array.
// }

// // --- Supabase Client Factory for Server Actions ---
// const createSupabaseServerClient = async () => {
//   const cookieStoreInstance = await cookies();

//   return createServerClient(
//     process.env.NEXT_PUBLIC_SUPABASE_URL!,
//     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
//     {
//       cookies: {
//         get(name: string) {
//           return cookieStoreInstance.get(name)?.value;
//         },
//         set(name: string, value: string, options: CookieOptions) {
//           try {
//             cookieStoreInstance.set(name, value, options);
//           } catch (error) {
//             console.error(`Server Action (createSupabaseServerClient): Failed to set cookie "${name}". Error:`, error);
//           }
//         },
//         remove(name: string, options: CookieOptions) {
//           try {
//             cookieStoreInstance.set(name, '', { ...options, maxAge: 0 });
//           } catch (error) {
//             console.error(`Server Action (createSupabaseServerClient): Failed to remove cookie "${name}". Error:`, error);
//           }
//         },
//       },
//     }
//   );
// };

// // --- Server Action: Get Recent Jobs ---
// export async function getRecentJobs(): Promise<JobCardData[]> {
//   const supabase = await createSupabaseServerClient();
  
//   const actionName = "getRecentJobs";
//   console.log(`Server Action (${actionName}): Initiating fetch for recent jobs.`);

//   try {
//     // Corrected based on TypeScript error: select 'profile' (singular)
//     const JOB_QUERY_COLUMNS = `
//       id,
//       title,
//       company_name,
//       company_logo_url,
//       location,
//       job_type,
//       is_remote,
//       salary_min,
//       salary_max,
//       salary_currency,
//       created_at,
//       status,
//       employer_id,
//       profile (email, full_name) 
//     `; 
//     // ^^^ Changed 'profiles' to 'profile' here based on the error message
//     // This tells Supabase to look for a relationship that it would name 'profile'
//     // or if 'profile' is the actual name of a related table/view or a defined relationship.
//     // If jobs.employer_id -> auth.users.id <- profiles.id, Supabase might infer this.

//     const { data: rawJobsData, error } = await supabase
//       .from('jobs')
//       .select(JOB_QUERY_COLUMNS)
//       .eq('status', 'APPROVED')
//       .order('created_at', { ascending: false })
//       .limit(10);

//     if (error) {
//       // The error "Could not find a relationship between 'jobs' and 'profiles'..."
//       // indicates the select string for the join is the issue.
//       // If changing 'profiles' to 'profile' in the select string doesn't fix it,
//       // the relationship needs to be specified more explicitly using the foreign key name.
//       console.error(`Server Action (${actionName}): Error fetching job data from Supabase. Message:`, error.message);
//       return [];
//     }

//     if (!rawJobsData || rawJobsData.length === 0) {
//       console.log(`Server Action (${actionName}): No 'APPROVED' jobs found or data is null.`);
//       return [];
//     }
    
//     const rawJobs = rawJobsData as RawJobFromSupabase[]; // Type cast
//     console.log(`Server Action (${actionName}): Successfully fetched ${rawJobs.length} raw job(s).`);
    
//     const formattedJobs: JobCardData[] = rawJobs.map(job => {
//       let salaryDisplay: string | undefined = undefined;
//       if (job.salary_min !== null && job.salary_max !== null) {
//         salaryDisplay = `${job.salary_currency || '$'} ${job.salary_min} - ${job.salary_max}`;
//       } else if (job.salary_min !== null) {
//         salaryDisplay = `${job.salary_currency || '$'} ${job.salary_min}`;
//       }

//       // Access the first profile from the 'profile' array (singular), if it exists
//       // const employerProfileData = job.profile && job.profile.length > 0 ? job.profile[0] : null;
//       // const derivedEmployerName = employerProfileData 
//       //   ? (employerProfileData.full_name || employerProfileData.email) 
//       //   : null; // Not used in JobCardData

//       return {
//         id: job.id,
//         title: job.title,
//         companyName: job.company_name,
//         companyLogoUrl: job.company_logo_url || '/company-logos/default-company-logo.svg',
//         location: job.location,
//         isRemote: job.is_remote,
//         type: job.job_type || undefined,
//         salary: salaryDisplay,
//         postedDate: new Date(job.created_at).toLocaleDateString(),
//         tags: [], 
//       };
//     });

//     console.log(`Server Action (${actionName}): Successfully mapped to ${formattedJobs.length} JobCardData object(s).`);
//     return formattedJobs;

//   } catch (err: unknown) {
//     const message = err instanceof Error ? err.message : "An unknown error occurred during job fetching.";
//     console.error(`Server Action (${actionName}): Unexpected error. Message:`, message, err);
//     return [];
//   }
// }




// src/app/actions/jobActions.ts
"use server";

import { getSupabaseServerClient } from '@/lib/supabase/serverClient'; // Import shared client
import type { 
  JobCardData, 
  FetchJobsParams, // Assuming this is defined in src/types for getPublishedJobs
  PaginatedJobsResult, // Assuming this is defined in src/types for getPublishedJobs
  // JobTypeOption       // Assuming this is defined in src/types
} from '@/types';

// --- Helper Types for Raw Supabase Data specific to these actions ---
// These types define the structure of data as it comes directly from Supabase queries
// within this file, before being mapped to UI-friendly types like JobCardData.

// interface SupabaseProfileEmbed { // For potential future use if joining profiles
//   email: string | null;
//   full_name: string | null;
// }

// Raw structure for jobs, might vary slightly between getRecentJobs and getPublishedJobs
// This version is tailored for what's needed for JobCardData mapping.
interface RawJobDataForCard {
  id: string;
  title: string;
  company_name: string;
  company_logo_url: string | null;
  location: string;
  job_type: string | null; // Should ideally match JobTypeOption values or be null
  is_remote: boolean;
  salary_min: number | null;
  salary_max: number | null;
  salary_currency: string | null;
  created_at: string; // ISO string timestamp
  // 'profile' field from previous attempt at join, removed for now to simplify
  // If re-added, type would be: profile?: SupabaseProfileEmbed[] | null;
}


// --- Data Mapping Helper ---
/**
 * Maps a raw job object from Supabase to the JobCardData format.
 * @param rawJob - The raw job data object from Supabase.
 * @returns {JobCardData} The formatted job card data.
 */
const mapRawJobToJobCardData = (rawJob: RawJobDataForCard): JobCardData => {
  let salaryDisplay: string | undefined = undefined;
  if (rawJob.salary_min !== null && rawJob.salary_max !== null) {
    salaryDisplay = `${rawJob.salary_currency || '$'} ${rawJob.salary_min} - ${rawJob.salary_max}`;
  } else if (rawJob.salary_min !== null) {
    salaryDisplay = `${rawJob.salary_currency || '$'} ${rawJob.salary_min}`;
  }

  return {
    id: rawJob.id,
    title: rawJob.title,
    companyName: rawJob.company_name,
    companyLogoUrl: rawJob.company_logo_url || '/company-logos/default-company-logo.svg',
    location: rawJob.location,
    isRemote: rawJob.is_remote,
    type: rawJob.job_type || undefined, // Ensure it aligns with JobCardData['type']
    salary: salaryDisplay,
    postedDate: new Date(rawJob.created_at).toLocaleDateString('en-US', { // Consistent date formatting
        year: 'numeric', month: 'short', day: 'numeric' 
    }),
    tags: [], // Default to empty array; populate if tags are fetched
  };
};


// --- Server Action: Get Recent Jobs (for Landing Page) ---
/**
 * Fetches a limited list of recent, 'APPROVED' job postings.
 * Intended for display on sections like a landing page.
 * Note: This version currently does not join with 'profiles' to simplify and avoid past errors.
 * If employer name is needed, the join logic would need careful implementation.
 * @returns {Promise<JobCardData[]>} A promise resolving to an array of job card data.
 */
export async function getRecentJobs(): Promise<JobCardData[]> {
  const supabase = await getSupabaseServerClient();
  const actionName = "getRecentJobs";
  console.log(`Server Action (${actionName}): Initiating fetch.`);

  try {
    const JOB_QUERY_COLUMNS_FOR_CARD = `
      id, title, company_name, company_logo_url, location, job_type, 
      is_remote, salary_min, salary_max, salary_currency, created_at
    `; // Removed employer_id, status, and profile join for simplicity here

    const { data: rawJobsData, error } = await supabase
      .from('jobs')
      .select(JOB_QUERY_COLUMNS_FOR_CARD)
      .eq('status', 'APPROVED') // Crucial filter
      .order('created_at', { ascending: false })
      .limit(6); // Fetch a small number for "recent" display

    if (error) {
      console.error(`Server Action (${actionName}): Supabase error. Message:`, error.message);
      return [];
    }

    if (!rawJobsData || rawJobsData.length === 0) {
      console.log(`Server Action (${actionName}): No 'APPROVED' jobs found.`);
      return [];
    }
    
    const typedRawJobs = rawJobsData as RawJobDataForCard[];
    const formattedJobs: JobCardData[] = typedRawJobs.map(mapRawJobToJobCardData);

    console.log(`Server Action (${actionName}): Successfully fetched and mapped ${formattedJobs.length} job(s).`);
    return formattedJobs;

  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error during job fetching.";
    console.error(`Server Action (${actionName}): Unexpected error. Message:`, message, err);
    return [];
  }
}


// --- Server Action: Get Published Jobs (for /jobs page with filters & pagination) ---
/**
 * Fetches a paginated and filtered list of 'APPROVED' job postings.
 * @param params - Filtering and pagination parameters defined in FetchJobsParams.
 * @returns {Promise<PaginatedJobsResult>} A promise resolving to paginated job results.
 */
export async function getPublishedJobs(
  params: FetchJobsParams = {}
): Promise<PaginatedJobsResult> {
  const supabase = await getSupabaseServerClient();
  const actionName = "getPublishedJobs";
  console.log(`Server Action (${actionName}): Fetching jobs with params:`, params);

  const {
    query: searchTerm,
    location,
    jobType,
    isRemote,
    page = 1,
    limit = 10, // Default items per page
  } = params;

  try {
    // Start building the query
    let queryBuilder = supabase
      .from('jobs')
      .select( // Select same columns as recent jobs for consistent mapping
        `id, title, company_name, company_logo_url, location, job_type, 
         is_remote, salary_min, salary_max, salary_currency, created_at`,
        { count: 'exact' } // Crucial for getting total count for pagination
      )
      .eq('status', 'APPROVED');

    // Apply text search filter (on title and company_name)
    if (searchTerm) {
      // Using .or() for multiple fields. For description search, ensure description is selected.
      // Note: for performant full-text search, PostgreSQL's FTS features are better.
      queryBuilder = queryBuilder.or(`title.ilike.%${searchTerm}%,company_name.ilike.%${searchTerm}%`);
    }

    // Apply location filter (case-insensitive partial match)
    if (location) {
      queryBuilder = queryBuilder.ilike('location', `%${location}%`);
    }

    // Apply job type filter
    if (jobType) {
      queryBuilder = queryBuilder.eq('job_type', jobType);
    }

    // Apply remote filter (converts "true"/"false" string from URL param to boolean)
    if (isRemote !== undefined && (isRemote === 'true' || isRemote === 'false')) {
      queryBuilder = queryBuilder.eq('is_remote', isRemote === 'true');
    }

    // Apply pagination: calculate range based on page and limit
    const startIndex = (page - 1) * limit;
    queryBuilder = queryBuilder.range(startIndex, startIndex + limit - 1);

    // Order results (e.g., by newest first)
    queryBuilder = queryBuilder.order('created_at', { ascending: false });

    // Execute the query
    const { data: rawJobsData, error, count } = await queryBuilder;

    if (error) {
      console.error(`Server Action (${actionName}): Supabase query error.`, error);
      throw error; // Propagate error to be caught by outer try-catch
    }

    const totalCount = count || 0;
    const totalPages = Math.ceil(totalCount / limit);
    
    const typedRawJobs = (rawJobsData || []) as RawJobDataForCard[];
    const formattedJobs: JobCardData[] = typedRawJobs.map(mapRawJobToJobCardData);
    
    console.log(`Server Action (${actionName}): Fetched ${formattedJobs.length} jobs. Total: ${totalCount}. Page: ${page}/${totalPages}.`);
    return {
      jobs: formattedJobs,
      totalCount,
      totalPages,
      currentPage: page,
    };

  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error occurred.";
    console.error(`Server Action (${actionName}): Unexpected error.`, message, err);
    return { // Return a consistent PaginatedJobsResult structure on error
      jobs: [],
      totalCount: 0,
      totalPages: 0,
      currentPage: params.page || 1,
      // error: message // Optionally pass error message to client if needed
    };
  }
}

// --- Potential Future Actions in this File ---
// export async function getJobDetailsById(jobId: string): Promise<JobDetailData | null> { /* ... */ }