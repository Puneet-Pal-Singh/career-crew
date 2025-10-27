// src/hooks/usePendingJobs.ts
"use client";

import { useState, useTransition } from 'react';
import { useToast } from "@/hooks/use-toast";
import type { AdminPendingJobData } from '@/types';
import { approveJob } from '@/app/actions/admin/approveJobAction';
import { rejectJob } from '@/app/actions/admin/rejectJobAction';

/**
 * SRP: This hook's Single Responsibility is to manage all the state and business logic
 * related to the pending jobs approval table. It encapsulates all the complexity,
 * exposing a clean API to the UI components.
 */
export const usePendingJobs = (initialJobs: AdminPendingJobData[]) => {
  const [jobs, setJobs] = useState<AdminPendingJobData[]>(initialJobs);
  const [isProcessing, startTransition] = useTransition();
  const [processingJobId, setProcessingJobId] = useState<number | null>(null);
  const [confirmationJob, setConfirmationJob] = useState<AdminPendingJobData | null>(null);
  const [confirmationType, setConfirmationType] = useState<'approve' | 'reject' | null>(null);
  const { toast } = useToast();

  const handleApprove = (job: AdminPendingJobData) => {
    setConfirmationJob(job);
    setConfirmationType('approve');
  };

  const handleReject = (job: AdminPendingJobData) => {
    setConfirmationJob(job);
    setConfirmationType('reject');
  };

  const handleConfirmAction = () => {
    if (!confirmationJob || !confirmationType) return;

    const action = confirmationType === 'approve' ? approveJob : rejectJob;
    const jobToProcess = confirmationJob;

    setProcessingJobId(jobToProcess.id);
    startTransition(async () => {
      const result = await action(jobToProcess.id);
      if (result.success) {
        setJobs(prevJobs => prevJobs.filter(job => job.id !== jobToProcess.id));
        toast({
          title: `Job ${confirmationType === 'approve' ? 'Approved' : 'Rejected'}`,
          description: `"${jobToProcess.title}" has been ${confirmationType === 'approve' ? 'approved and is now live' : 'rejected'}.`,
        });
      } else {
        toast({
          title: `Action Failed`,
          description: result.error || `Could not ${confirmationType} the job.`,
          variant: "destructive",
        });
      }
      setProcessingJobId(null);
      setConfirmationJob(null);
      setConfirmationType(null);
    });
  };

  const handleCloseDialog = () => {
    setConfirmationJob(null);
    setConfirmationType(null);
  };

  return {
    jobs,
    isProcessing,
    processingJobId,
    confirmationJob,
    confirmationType,
    handleApprove,
    handleReject,
    handleConfirmAction,
    handleCloseDialog,
  };
};