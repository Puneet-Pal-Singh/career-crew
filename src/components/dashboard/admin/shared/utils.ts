// src/components/dashboard/admin/utils.ts

import type { JobStatus } from '@/types';

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
 * e.g., "PENDING_APPROVAL" -> "Pending Approval"
 * @param status - The status string.
 * @returns A formatted, human-readable status string.
 */
export const formatStatusText = (status: JobStatus): string => {
    return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
};