// src/components/dashboard/admin/PendingJobsTable.tsx
"use client";

import React, { useState }  from 'react';
import { usePendingJobs } from '@/hooks/usePendingJobs'; // Import our new custom hook
import type { AdminPendingJobData } from '@/types';

// Import the dumb UI components we just created
import { Table, TableBody, TableCaption, TableHeader, TableRow, TableHead } from "@/components/ui/table";
import { Card } from '@/components/ui/card';
import PendingJobTableRow from './PendingJobTableRow';
import PendingJobCard from './PendingJobCard';
import PendingJobsEmptyState from './PendingJobsEmptyState';
import ConfirmationDialog from '@/components/shared/ConfirmationDialog';
import CompanyDetailsModal from './CompanyDetailsModal'; 

interface PendingJobsTableProps {
  initialJobs: AdminPendingJobData[];
}

// This is now an ORCHESTRATOR component. Its only job is to connect
// the logic (hook) with the UI (dumb components).
export default function PendingJobsTable({ initialJobs }: PendingJobsTableProps) {
  const {
    jobs,
    isProcessing,
    processingJobId,
    confirmationJob,
    confirmationType,
    handleApprove,
    handleReject,
    handleConfirmAction,
    handleCloseDialog,
  } = usePendingJobs(initialJobs);

  // NEW: State management for the company details modal
  const [selectedEmployerId, setSelectedEmployerId] = useState<string | null>(null);

  const handleCompanyClick = (employerId: string) => {
    setSelectedEmployerId(employerId);
  };

  const handleCloseCompanyModal = () => {
    setSelectedEmployerId(null);
  };

  // If there are no jobs to display, render the appropriate empty state.
  if (jobs.length === 0) {
    return <PendingJobsEmptyState wasInitiallyPopulated={initialJobs.length > 0} />;
  }

  // If there are jobs, render the responsive layouts.
  return (
    <>
      <Card>
        {/* DESKTOP VIEW */}
        <div className="hidden lg:block">
          <Table>
            <TableCaption>Job postings awaiting approval.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[250px]">Job Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Date Submitted</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {jobs.map((job) => (
                <PendingJobTableRow
                  key={job.id}
                  job={job}
                  isProcessing={isProcessing && processingJobId === job.id}
                  onApprove={handleApprove}
                  onReject={handleReject}
                  onCompanyClick={handleCompanyClick}
                />
              ))}
            </TableBody>
          </Table>
        </div>

        {/* MOBILE + TABLET VIEW */}
        <div className="lg:hidden p-4 space-y-3">
          {jobs.map((job) => (
            <PendingJobCard
              key={job.id}
              job={job}
              isProcessing={isProcessing && processingJobId === job.id}
              onApprove={handleApprove}
              onReject={handleReject}
              onCompanyClick={handleCompanyClick}
            />
          ))}
        </div>
      </Card>

      {/* MODAL (State is managed by the hook) */}
      <ConfirmationDialog
        isOpen={!!confirmationJob}
        onClose={handleCloseDialog}
        onConfirm={handleConfirmAction}
        title={confirmationType === 'approve' ? 'Approve Job?' : 'Reject Job?'}
        description={confirmationType === 'approve' ? `Are you sure you want to approve "${confirmationJob?.title}"? This will make the job live.` : `Are you sure you want to reject "${confirmationJob?.title}"?`}
        confirmText={confirmationType === 'approve' ? 'Approve' : 'Reject'}
      />

      {/* NEW: The Company Details Modal */}
      <CompanyDetailsModal
        isOpen={!!selectedEmployerId}
        employerId={selectedEmployerId}
        onClose={handleCloseCompanyModal}
      />
    </>
  );
}