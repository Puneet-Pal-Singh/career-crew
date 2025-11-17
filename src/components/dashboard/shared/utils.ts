// src/components/dashboard/shared/utils.ts

import type { JobStatus, ApplicationStatusOption, ApplicationViewData } from '@/types';

/**
 * Determines the visual variant for a status badge based on the job status.
 * @param status - The status of the job.
 * @returns The variant prop for the Badge component.
 */
export const getStatusBadgeVariant = (status: JobStatus): "default" | "destructive" | "outline" | "secondary" | null | undefined => {
  switch (status) {
    case 'APPROVED': return 'default'; // Using 'default' for a "good" status (e.g., green in theme)
    case 'PENDING_APPROVAL': case 'DRAFT': return 'secondary';
    case 'REJECTED': return 'destructive';
    case 'ARCHIVED': case 'FILLED': return 'outline';
    default: return 'secondary';
  }
};

/**
 * Formats a snake_case status string into a capitalized, readable format.
 * Can handle both JobStatus and ApplicationStatusOption.
 * e.g., "PENDING_APPROVAL" -> "Pending Approval"
 * e.g., "SUBMITTED" -> "Submitted"
 * @param status - The status string.
 * @returns A formatted, human-readable status string.
 */
export const formatStatusText = (status: JobStatus | ApplicationStatusOption): string => {
    return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
};

/**
 * Determines the visual variant for an application status badge.
 * @param status - The status of the application.
 * @returns The variant prop for the Badge component.
 */
export const getApplicationStatusBadgeVariant = (status: ApplicationStatusOption): "default" | "destructive" | "outline" | "secondary" | null | undefined => {
  switch (status) {
    case 'HIRED':
    case 'OFFERED':
      return 'default'; // "Good" status
    case 'SUBMITTED':
    case 'INTERVIEWING':
      return 'secondary';
    case 'REJECTED':
      return 'outline';
    case 'VIEWED':
    default:
      return 'outline';
  }
};

/**
 * =================================================================
 * APPLICATION STATUS DISPLAY MAPPING
 * =================================================================
 * This is the dedicated "Display Layer" mapping for ApplicationStatusOption.
 * Its Single Responsibility is to convert the raw application status
 * enum into a professional, user-friendly string for the UI.
 */
export const formatApplicationStatusDisplay = (status: ApplicationStatusOption): string => {
  switch (status) {
    case 'SUBMITTED':
      return 'Submitted';
    case 'VIEWED':
      return 'Viewed';
    case 'INTERVIEWING':
      return 'Interviewing';
    case 'OFFERED':
      return 'Offered';
    case 'HIRED':
      return 'Hired';
    case 'REJECTED':
      // This is the key business logic change for UX.
      return 'Not Selected';
    default: {
      // This ensures the function is exhaustive and handles any future status additions.
      const exhaustiveCheck: never = status;
      return exhaustiveCheck;
    }
  }
};

/**
 * Returns specific Tailwind CSS class names for richer application status badges.
 * This is an extension for UIs that require more detailed styling than the basic variant.
 * @param status - The status of the application.
 * @returns A string of Tailwind CSS classes.
 */
export const getApplicationStatusColorClasses = (status: ApplicationStatusOption): string => {
  switch (status) {
    case 'HIRED':
      return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 border-green-200 dark:border-green-700';
    case 'OFFERED':
      return 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 border-blue-200 dark:border-blue-700';
    case 'INTERVIEWING':
      return 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 border-purple-200 dark:border-purple-700';
    case 'REJECTED': // Data value is REJECTED (maps to "Not Selected")
      return 'text-muted-foreground border-gray-300 dark:border-gray-700'; // Neutral
    case 'VIEWED':
      return 'text-foreground border-gray-400 dark:border-gray-600';
    case 'SUBMITTED':
    default:
      return 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 border-gray-200 dark:border-gray-700';
  }
};

/**
 * =================================================================
 * JOB SEEKER APPLICATION STATUS DISPLAY MAPPING
 * =================================================================
 * This function converts a raw application status into a simple,
 * encouraging, and non-committal string for the job seeker's "Ongoing" view.
 */
export const formatSeekerApplicationStatus = (status: ApplicationStatusOption): string => {
  switch (status) {
    case 'SUBMITTED':
      return 'Application Sent';
    case 'VIEWED':
    case 'INTERVIEWING':
    case 'OFFERED':
    case 'HIRED':
      return 'In Review';
    // We explicitly don't handle REJECTED here, as it will be in the "Archived" tab.
    default:
      return 'Pending';
  }
};

// =======================================================================
// --- START: NEW CENTRALIZED SEEKER STATUS LOGIC ---
// =======================================================================

// NEW TYPE: Defines the possible display states for a seeker's application.
export type SeekerStatusType = 'IN_REVIEW' | 'SENT' | 'NOT_ACCEPTED' | 'EXPIRED';

// NEW TYPE: Defines the shape of the display attributes for a status.
export interface SeekerStatusDisplay {
  text: string;
  className: string;
}

const ARCHIVE_THRESHOLD_DAYS = 21;

/**
 * The single source of truth for determining the seeker's application status type.
 * This function contains all the business logic (e.g., 21-day expiry).
 * @param app - The application data object.
 * @returns The calculated status type.
 */
export const getSeekerApplicationStatusType = (app: ApplicationViewData): SeekerStatusType => {
  const thresholdDate = new Date();
  thresholdDate.setDate(thresholdDate.getDate() - ARCHIVE_THRESHOLD_DAYS);
  const applicationDate = new Date(app.dateApplied);

  if (app.applicationStatus === 'REJECTED') {
    return 'NOT_ACCEPTED';
  }

  if (applicationDate < thresholdDate && (app.applicationStatus === 'SUBMITTED' || app.applicationStatus === 'VIEWED')) {
    return 'EXPIRED';
  }

  if (app.applicationStatus === 'SUBMITTED') {
    return 'SENT';
  }

  // Any other active status ('VIEWED', 'INTERVIEWING', etc.) is considered 'In Review'.
  return 'IN_REVIEW';
};

/**
 * Returns the correct text and Tailwind CSS classes for a given status type.
 * This is a pure display mapping function.
 * @param statusType - The calculated status type from the function above.
 * @returns An object with the text and className for display.
 */
export const getSeekerStatusAttributes = (statusType: SeekerStatusType): SeekerStatusDisplay => {
  switch (statusType) {
    case 'SENT':
      return {
        text: 'Application Sent',
        className: 'text-muted-foreground',
      };
    case 'IN_REVIEW':
      return {
        text: 'In Review',
        className: 'text-blue-600 dark:text-blue-400',
      };
    case 'NOT_ACCEPTED':
      return {
        text: 'Not Accepted',
        className: 'text-red-600 dark:text-red-500',
      };
    case 'EXPIRED':
      return {
        text: 'Expired',
        className: 'text-amber-600 dark:text-amber-500',
      };
    default:
      // Fallback for safety
      return {
        text: 'Pending',
        className: 'text-muted-foreground',
      };
  }
};
// =======================================================================
// --- END: NEW CENTRALIZED SEEKER STATUS LOGIC ---
// =======================================================================

// ... (keep the other existing functions below this)