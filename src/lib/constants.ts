// src/lib/constants.ts
import type { JobTypeOption } from "@/types"; // Import the raw enum type
import type { ApplicationStatusOption } from '@/types';

/**
 * A centralized array defining the job type options for the entire application.
 * Each object contains a raw `value` for backend/logic use and a human-readable `label` for display.
 * This is the single source of truth for job types.
 */
export const JOB_TYPE_OPTIONS: { value: JobTypeOption; label: string }[] = [
  { value: "FULL_TIME", label: "Full Time" },
  { value: "PART_TIME", label: "Part Time" },
  { value: "CONTRACT", label: "Contract" },
  { value: "INTERNSHIP", label: "Internship" },
  { value: "TEMPORARY", label: "Temporary" },
];

/**
 * A centralized array of currency options.
 * This can be expanded as needed.
 */
export const CURRENCY_OPTIONS: readonly string[] = ["USD", "EUR", "GBP", "CAD", "AUD", "INR"] as const;

// You can add other application-wide constants here in the future,
// e.g., for experience levels, company sizes, etc.

export type StatItem = {
  value: string;
  label: string;
};

// ... at the bottom of the file, add the new constant
export const PLATFORM_STATS: StatItem[] = [
  { value: '50+', label: 'Jobs Posted' },
  { value: '30+', label: 'Companies Hiring' },
  { value: '500+', label: 'Active Job Seekers' },
  { value: '95%', label: 'Placement Success' },
];

/**
 * The set of application statuses that are part of the V2 ATS features.
 * These are disabled in the UI for the MVP.
 */
export const COMING_SOON_APPLICATION_STATUSES: ApplicationStatusOption[] = [
  'INTERVIEWING',
  'OFFERED',
  'HIRED',
];