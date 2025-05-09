// src/types/index.ts

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
}