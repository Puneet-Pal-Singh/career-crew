// src/components/dashboard/admin/utils.ts

import type { JobStatus, ApplicationStatusOption } from '@/types';

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
      return 'destructive';
    case 'VIEWED':
    default:
      return 'outline';
  }
};