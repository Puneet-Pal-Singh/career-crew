// src/components/dashboard/admin/utils.ts
import type { JobStatus } from '@/types';

export const getStatusBadgeVariant = (status: JobStatus): "default" | "destructive" | "outline" | "secondary" | null | undefined => {
  switch (status) {
    case 'APPROVED': return 'default';
    case 'PENDING_APPROVAL': case 'DRAFT': return 'secondary';
    case 'REJECTED': return 'destructive';
    case 'ARCHIVED': case 'FILLED': return 'outline';
    default: return 'default';
  }
};

export const formatStatusText = (status: JobStatus): string => {
  return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
};