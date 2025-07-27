// src/types/index.ts

// Define UserRole and UserProfile (ensure UserProfile includes has_made_role_choice)
export type UserRole = 'JOB_SEEKER' | 'EMPLOYER' | 'ADMIN';

export interface UserProfile {
  id: string;
  updated_at: string;
  email: string;
  full_name?: string | null;
  avatar_url?: string | null;
  role: UserRole;
  has_completed_onboarding: boolean; // This flag makes the role choice optional
}

export type JobStatus = 
  | "PENDING_APPROVAL" 
  | "APPROVED" 
  | "REJECTED" 
  | "ARCHIVED" 
  | "FILLED" 
  | "DRAFT";

// Interface for data expected by the JobCard component
export interface JobCardData {
  id: string;
  slug: string;
  title: string;
  companyName: string;
  companyLogoUrl?: string | null;
  location: string;
  isRemote: boolean;
  salary?: string | null; // e.g., "$100k - $120k" or "Competitive"
  postedDate: string; // e.g., "Posted 2 days ago", "2023-10-26"
  type?: string; // e.g., "Full-time", "Contract", "Part-time"
  tags?: string[]; // NEWLY ADDED: Optional array of strings for tags
}

// Interface for displaying an employer's jobs in their dashboard
export interface EmployerJobDisplayData {
  id: string;
  title: string;
  status: JobStatus; // Uses the JobStatus type
  createdAt: string; // Formatted date string, e.g., "YYYY-MM-DD" or "Month DD, YYYY"
  // companyName?: string; // Could be useful if an employer manages multiple entities under one account
  // applicationCount?: number; // For future enhancement
}

// Parameters for fetching published jobs
export type JobTypeOption = "FULL_TIME" | "PART_TIME" | "CONTRACT" | "INTERNSHIP" | "TEMPORARY"; // Match your enum

export interface FetchJobsParams {
  query?: string;          // For text search
  // Change location and jobType to allow for arrays for multi-select filtering
  location?: string | string[]; 
  jobType?: JobTypeOption | JobTypeOption[];
  isRemote?: string;       // "true" or "false" from URL searchParams, or undefined
  page?: number;
  limit?: number;
  // Future: sortBy?: string, sortOrder?: 'asc' | 'desc'
}

export interface PaginatedJobsResult {
  jobs: JobCardData[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
}

// Interface for the full details of a job, used on the job detail page
export interface JobDetailData {
  id: string;
  title: string;
  companyName: string;
  companyLogoUrl?: string | null;
  location: string;
  isRemote: boolean;
  jobType?: JobTypeOption | string; // Allow string for flexibility if DB enum isn't strictly JobTypeOption
  salaryMin?: number | null;
  salaryMax?: number | null;
  salaryCurrency?: string | null;
  postedDate: string; // Formatted string
  description: string; // Full description (HTML or Markdown if you support it, plain text otherwise)
  requirements?: string | null; // Full requirements
  applicationEmail?: string | null;
  applicationUrl?: string | null;
  // Optional: Further company details if you have a separate company profile table later
  // companyDescription?: string;
  // companyWebsite?: string;
}

export interface AdminPendingJobData {
  id: string;
  title: string;
  companyName: string;
  createdAt: string; // Formatted date
}

// If your 'applications' table has a distinct status enum like 'application_status_option'
// you defined earlier (SUBMITTED, VIEWED, INTERVIEWING, OFFERED, HIRED, REJECTED):
export type ApplicationStatusOption = 
  | "SUBMITTED" 
  | "VIEWED" 
  | "INTERVIEWING" 
  | "OFFERED" 
  | "HIRED" 
  | "REJECTED";
  
// Interface for displaying a seeker's application in their dashboard
export interface ApplicationViewData {
  applicationId: string; // ID from the 'applications' table
  jobId: string;         // ID from the 'jobs' table
  jobTitle: string;
  companyName: string;
  // companyLogoUrl?: string | null; // Optional, if you want to display it
  dateApplied: string;   // Formatted date string
  applicationStatus: ApplicationStatusOption;
}

// ... (add this to your existing types)
export interface RecentApplication {
  applicationId: string;
  applicationStatus: ApplicationStatusOption;
  dateApplied: string;
  jobId: string;
  jobTitle: string;
  companyName: string;
}