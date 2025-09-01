// src/app/actions/helpers/jobDataMappers.ts
import type { JobCardData, JobTypeOption } from '@/types';
import { JOB_TYPE_OPTIONS } from '@/lib/constants'; // <-- Import the constant
import { generateJobSlug } from '@/lib/utils';

// Raw structure for jobs when data is intended for JobCardData mapping
export interface RawJobDataForCard {
  id: number; // Changed from string to number to match the new DB schema.
  title: string;
  company_name: string;
  company_logo_url: string | null;
  location: string;
  job_type: string | null; // This will be from your job_type_option enum
  is_remote: boolean;
  salary_min: number | null;
  salary_max: number | null;
  salary_currency: string | null;
  created_at: string; // ISO string timestamp
}

// Create a lookup map for efficiency
const jobTypeLabelMap = new Map(JOB_TYPE_OPTIONS.map(opt => [opt.value, opt.label]));

/**
 * Maps a raw job object from Supabase to the JobCardData format.
 * @param rawJob - The raw job data object from Supabase.
 * @returns {JobCardData} The formatted job card data.
 */
export const mapRawJobToJobCardData = (rawJob: RawJobDataForCard): JobCardData => {
  // let salaryDisplay: string | undefined = undefined;
  // if (rawJob.salary_min !== null && rawJob.salary_max !== null) {
  //   salaryDisplay = `${rawJob.salary_currency || '$'} ${rawJob.salary_min} - ${rawJob.salary_max}`;
  // } else if (rawJob.salary_min !== null) {
  //   salaryDisplay = `${rawJob.salary_currency || '$'} ${rawJob.salary_min}`;
  // }

  return {
    id: rawJob.id,
    slug: generateJobSlug(rawJob.id, rawJob.title), // Generate SEO-friendly slug
    title: rawJob.title,
    companyName: rawJob.company_name,
    companyLogoUrl: rawJob.company_logo_url || '/company-logos/default-company-logo.svg',
    location: rawJob.location,
    isRemote: rawJob.is_remote,
    // salary: salaryDisplay,
    salaryMin: rawJob.salary_min,
    salaryMax: rawJob.salary_max,
    // type: rawJob.job_type || undefined, 
    jobType: jobTypeLabelMap.get(rawJob.job_type as JobTypeOption) || rawJob.job_type,
    postedDate: rawJob.created_at,
    // tags: [], // Default to empty array; populate if tags are fetched from DB
    tags: ['React', 'TypeScript', 'Next.js']
  };
};