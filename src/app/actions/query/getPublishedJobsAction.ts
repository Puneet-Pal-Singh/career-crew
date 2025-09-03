// src/app/actions/query/getPublishedJobsAction.ts
"use server";

import { getSupabaseServerClient } from '@/lib/supabase/serverClient';
import type { JobCardData, FetchJobsParams, PaginatedJobsResult } from '@/types';
import { mapRawJobToJobCardData, type RawJobDataForCard } from '@/app/actions/helpers/jobDataMappers';

export async function getPublishedJobs(
  params: FetchJobsParams = {}
): Promise<PaginatedJobsResult> {
  const supabase = await getSupabaseServerClient();
  const actionName = "getPublishedJobs";

  const {
    query: searchTerm,
    location,
    jobType,
    isRemote,
    page = 1,
    limit = 10,
  } = params;

  try {
    let queryBuilder = supabase
      .from('jobs')
      .select(
        `id, title, company_name, company_logo_url, location, job_type, 
         is_remote, salary_min, salary_max, salary_currency, created_at, tags`,
        { count: 'exact' }
      )
      .eq('status', 'APPROVED');

    // Apply text search filter
    if (searchTerm) {
      queryBuilder = queryBuilder.or(`title.ilike.%${searchTerm}%,company_name.ilike.%${searchTerm}%`);
    }

    // --- UPDATED FILTER LOGIC FOR ARRAYS ---
    // Handle Location filter (can be string from hero search or array from sidebar)
    if (location && Array.isArray(location) && location.length > 0) {
      queryBuilder = queryBuilder.in('location', location);
    } else if (location && typeof location === 'string') {
      queryBuilder = queryBuilder.ilike('location', `%${location}%`);
    }

    // Handle Job Type filter (can now be an array)
    if (jobType && Array.isArray(jobType) && jobType.length > 0) {
      queryBuilder = queryBuilder.in('job_type', jobType);
    } else if (jobType && typeof jobType === 'string') {
      queryBuilder = queryBuilder.eq('job_type', jobType);
    }

    // Handle standalone Remote filter
    if (isRemote === 'true') {
      queryBuilder = queryBuilder.eq('is_remote', true);
    }
    
    // Apply pagination and ordering
    const startIndex = (page - 1) * limit;
    queryBuilder = queryBuilder.range(startIndex, startIndex + limit - 1)
                               .order('created_at', { ascending: false });

    const { data: rawJobsData, error, count } = await queryBuilder;

    if (error) {
      console.error(`Server Action (${actionName}): Supabase query error.`, error);
      throw error;
    }

    const totalCount = count || 0;
    const totalPages = Math.ceil(totalCount / limit);
    
    const formattedJobs: JobCardData[] = (rawJobsData || []).map(job => mapRawJobToJobCardData(job as RawJobDataForCard));
    
    return {
      jobs: formattedJobs,
      totalCount,
      totalPages,
      currentPage: page,
    };

  } catch (err) {
    const message = err instanceof Error ? err.message : "An unexpected error occurred.";
    console.error(`Server Action (${actionName}): Unexpected error.`, message, err);
    return { jobs: [], totalCount: 0, totalPages: 0, currentPage: params.page || 1 };
  }
}