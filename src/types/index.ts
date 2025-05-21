// src/types/index.ts

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
  location?: string;
  jobType?: JobTypeOption; // Use the defined type
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