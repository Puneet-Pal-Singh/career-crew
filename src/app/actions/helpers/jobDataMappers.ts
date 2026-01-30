// src/app/actions/helpers/jobDataMappers.ts
import type { JobCardData, JobTypeOption, JobStatus, JobDetailData, AdminJobRowData } from '@/types';
import { JOB_TYPE_OPTIONS } from '@/lib/constants'; // <-- Import the constant
// import { generateJobSlug } from '@/lib/utils';

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
  tags: string[] | null;  // It can be a string array or null if the column is empty.
  status: JobStatus;
  employer_id: string;
}

// A new interface for the full job detail data from the database.
export interface RawJobDataForDetail extends RawJobDataForCard {
  description: string;
  requirements: string | null;
  application_email: string | null;
  application_url: string | null;
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
    // slug: generateJobSlug(rawJob.id, rawJob.title), // Generate SEO-friendly slug
    title: rawJob.title,
    companyName: rawJob.company_name,
    companyLogoUrl: rawJob.company_logo_url,
    location: rawJob.location,
    isRemote: rawJob.is_remote,
    // salary: salaryDisplay,
    salaryMin: rawJob.salary_min,
    salaryMax: rawJob.salary_max,
    salaryCurrency: rawJob.salary_currency,
    // type: rawJob.job_type || undefined, 
    jobType: jobTypeLabelMap.get(rawJob.job_type as JobTypeOption) || rawJob.job_type,
    postedDate: rawJob.created_at,
    // tags: [], // Default to empty array; populate if tags are fetched from DB
    tags: rawJob.tags || [],
  };
};

// dedicated mapper for the Job Detail Page.
export const mapRawJobToJobDetailData = (rawJob: RawJobDataForDetail): JobDetailData => {
  return {
    id: rawJob.id,
    title: rawJob.title,
    companyName: rawJob.company_name,
    companyLogoUrl: rawJob.company_logo_url,
    location: rawJob.location,
    isRemote: rawJob.is_remote,
    jobType: jobTypeLabelMap.get(rawJob.job_type as JobTypeOption) || rawJob.job_type || undefined,
    salaryMin: rawJob.salary_min,
    salaryMax: rawJob.salary_max,
    salaryCurrency: rawJob.salary_currency,
    postedDate: rawJob.created_at,
    description: rawJob.description,
    requirements: rawJob.requirements,
    applicationEmail: rawJob.application_email,
    applicationUrl: rawJob.application_url,
    tags: rawJob.tags || [],
    status: rawJob.status,
    employerId: rawJob.employer_id,
  };
};

// Admin job data mapper
// Define the shape of the raw data we expect for this specific mapping
// This should match the columns returned by the `get_all_jobs_for_admin` function
export interface RawAdminJobData {
  id: number;
  title: string;
  company_name: string;
  status: JobStatus;
  created_at: string; // ISO string timestamp
}

/**
 * Maps raw job data to the format needed for the admin's "Manage All Jobs" table.
 * @param rawJob - The raw job data object from the database.
 * @returns {AdminJobRowData} The formatted data for the admin table row.
 */
export const mapRawJobToAdminJobRowData = (rawJob: RawAdminJobData): AdminJobRowData => {
  return {
    id: rawJob.id,
    title: rawJob.title,
    companyName: rawJob.company_name,
    status: rawJob.status,
    createdAt: new Date(rawJob.created_at).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }),
  };
};