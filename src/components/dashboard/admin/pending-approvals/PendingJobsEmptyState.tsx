// src/components/dashboard/admin/PendingJobsEmptyState.tsx
"use client";

import { CheckCircle, Clock } from 'lucide-react';

interface PendingJobsEmptyStateProps {
  // If the initial load had jobs, we show an "All Clear!" message.
  // Otherwise, we show a "No Pending Jobs" message.
  wasInitiallyPopulated: boolean;
}

export default function PendingJobsEmptyState({ wasInitiallyPopulated }: PendingJobsEmptyStateProps) {
  if (wasInitiallyPopulated) {
    return (
      <div className="text-center py-10 border rounded-lg bg-card mt-8">
        <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-4" />
        <h3 className="text-lg font-medium text-foreground mb-2">All Clear!</h3>
        <p className="text-sm text-muted-foreground">
          All pending jobs have been reviewed.
        </p>
      </div>
    );
  }

  return (
    <div className="text-center py-10 border rounded-lg bg-card mt-8">
      <Clock className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
      <h3 className="text-lg font-medium text-foreground mb-2">No Pending Jobs</h3>
      <p className="text-sm text-muted-foreground">
        There are currently no job postings awaiting review.
      </p>
    </div>
  );
}