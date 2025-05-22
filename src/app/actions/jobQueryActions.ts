// src/app/actions/jobQueryActions.ts
"use server";

import { getSupabaseServerClient } from '@/lib/supabase/serverClient';
import type { 
  JobCardData, 
  FetchJobsParams,
  PaginatedJobsResult,
  // JobTypeOption (not directly used in this file's exposed functions' params, but good for RawJobDataForCard)
} from '@/types';

// --- Helper Types ---
interface RawJobDataForCard {
  id: string;
  title: string;
  company_name: string;
  company_logo_url: string | null;
  location: string;
  job_type: string | null;
  is_remote: boolean;
  salary_min: number | null;
  salary_max: number | null;
  salary_currency: string | null;
  created_at: string;
}

// --- Data Mapping Helper ---
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
    type: rawJob.job_type || undefined,
    salary: salaryDisplay,
    postedDate: new Date(rawJob.created_at).toLocaleDateString('en-US', { 
        year: 'numeric', month: 'short', day: 'numeric' 
    }),
    tags: [],
  };
};

// --- Server Action: Get Recent Jobs ---
export async function getRecentJobs(): Promise<JobCardData[]> {
  const supabase = await getSupabaseServerClient();
  // const actionName = "getRecentJobs";
  // console.log(`Server Action (${actionName}): Initiating fetch.`); // Reduce noise if too frequent
  try {
    const JOB_QUERY_COLUMNS_FOR_CARD = `
      id, title, company_name, company_logo_url, location, job_type, 
      is_remote, salary_min, salary_max, salary_currency, created_at
    `;
    const { data: rawJobsData, error } = await supabase
      .from('jobs')
      .select(JOB_QUERY_COLUMNS_FOR_CARD)
      .eq('status', 'APPROVED')
      .order('created_at', { ascending: false })
      .limit(6);

    if (error) { /* ... error handling ... */ return []; }
    if (!rawJobsData || rawJobsData.length === 0) { /* ... no data handling ... */ return []; }
    
    const typedRawJobs = rawJobsData as RawJobDataForCard[];
    return typedRawJobs.map(mapRawJobToJobCardData);
  } catch (error) { 
    /* ... error handling ... */
    console.error("Error fetching recent jobs:", error);
     return []; 
  }
}

// --- Server Action: Get Published Jobs ---
export async function getPublishedJobs(
  params: FetchJobsParams = {}
): Promise<PaginatedJobsResult> {
  const supabase = await getSupabaseServerClient();
  // const actionName = "getPublishedJobs";
  // console.log(`Server Action (${actionName}): Fetching jobs with params:`, params);
  const { query: searchTerm, location, jobType, isRemote, page = 1, limit = 10 } = params;

  try {
    let queryBuilder = supabase
      .from('jobs')
      .select(
        `id, title, company_name, company_logo_url, location, job_type, 
         is_remote, salary_min, salary_max, salary_currency, created_at`,
        { count: 'exact' }
      )
      .eq('status', 'APPROVED');

    if (searchTerm) { queryBuilder = queryBuilder.or(`title.ilike.%${searchTerm}%,company_name.ilike.%${searchTerm}%`); }
    if (location) { queryBuilder = queryBuilder.ilike('location', `%${location}%`); }
    if (jobType) { queryBuilder = queryBuilder.eq('job_type', jobType); }
    if (isRemote !== undefined && (isRemote === 'true' || isRemote === 'false')) {
      queryBuilder = queryBuilder.eq('is_remote', isRemote === 'true');
    }

    const startIndex = (page - 1) * limit;
    queryBuilder = queryBuilder.range(startIndex, startIndex + limit - 1)
                               .order('created_at', { ascending: false });

    const { data: rawJobsData, error, count } = await queryBuilder;

    if (error) { /* ... error handling ... */ throw error; }

    const totalCount = count || 0;
    const totalPages = Math.ceil(totalCount / limit);
    const typedRawJobs = (rawJobsData || []) as RawJobDataForCard[];
    const formattedJobs: JobCardData[] = typedRawJobs.map(mapRawJobToJobCardData);
    
    return { jobs: formattedJobs, totalCount, totalPages, currentPage: page };
  } catch (err: unknown) {
    /* ... error handling ... */
    console.error("Error fetching published jobs:", err);
    // Return an empty result set on error
    return { jobs: [], totalCount: 0, totalPages: 0, currentPage: params.page || 1 };
  }
}