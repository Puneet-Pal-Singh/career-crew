// src/components/dashboard/admin/PendingJobsTable.tsx
"use client";

import React, { useState, useTransition } from 'react';
import Link from 'next/link';
import type { AdminPendingJobData, JobStatus } from '@/types';
import { approveJob } from '@/app/actions/admin/approveJobAction';
import { rejectJob } from '@/app/actions/admin/rejectJobAction';
import { generateJobSlug } from '@/lib/utils';

// Import components
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { CheckCircle, XCircle, Loader2, Eye, Clock } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import ConfirmationDialog from '@/components/shared/ConfirmationDialog';

interface PendingJobsTableProps {
  initialJobs: AdminPendingJobData[];
}

const getStatusBadgeVariant = (status: JobStatus): "default" | "destructive" | "outline" | "secondary" | null | undefined => {
  switch (status) {
    case 'APPROVED': return 'default';
    case 'PENDING_APPROVAL': case 'DRAFT': return 'secondary';
    case 'REJECTED': return 'destructive';
    case 'ARCHIVED': case 'FILLED': return 'outline';
    default: return 'default';
  }
};

const formatStatusText = (status: JobStatus): string => {
  return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
};

export default function PendingJobsTable({ initialJobs }: PendingJobsTableProps) {
  const [jobs, setJobs] = useState<AdminPendingJobData[]>(initialJobs);
  const [isProcessing, startTransition] = useTransition();
  // FIX: The processing ID should be a number to match the job.id type.
  const [processingJobId, setProcessingJobId] = useState<number | null>(null);
  const [confirmationJob, setConfirmationJob] = useState<AdminPendingJobData | null>(null);
  const [confirmationType, setConfirmationType] = useState<'approve' | 'reject' | null>(null);
  const { toast } = useToast(); // For showing success/error messages

  // FIX: This handler now accepts a number for the jobId.
  const handleApproveJob = async (jobId: number, jobTitle: string) => {
    setProcessingJobId(jobId);
    startTransition(async () => {
      // we used to Convert the numeric ID to a string before sending to the server action.
      // FIX: Pass the numeric ID directly to the server action.
      // The server action is now responsible for handling the type.
      const result = await approveJob(jobId);
      if (result.success) {
        setJobs(prevJobs => prevJobs.filter(job => job.id !== jobId));
        toast({
          title: "Job Approved",
          description: `"${jobTitle}" has been approved and is now live.`,
          variant: "default", // Or "success" if you have it
        });
      } else {
        toast({
          title: "Approval Failed",
          description: result.error || "Could not approve the job.",
          variant: "destructive",
        });
      }
      setProcessingJobId(null);
    });
  };

  // FIX: This handler now accepts a number for the jobId.
  const handleRejectJob = async (jobId: number, jobTitle: string) => {
    // Optional: Add a confirmation dialog before rejecting
    setProcessingJobId(jobId);
    startTransition(async () => {
      // FIX: Convert the numeric ID to a string before sending to the server action.
      // FIX: Pass the numeric ID directly to the server action.
      const result = await rejectJob(jobId);
      if (result.success) {
        setJobs(prevJobs => prevJobs.filter(job => job.id !== jobId));
        toast({
          title: "Job Rejected",
          description: `"${jobTitle}" has been rejected.`,
        });
      } else {
        toast({
          title: "Rejection Failed",
          description: result.error || "Could not reject the job.",
          variant: "destructive",
        });
      }
      setProcessingJobId(null);
    });
  };

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
    if (confirmationType === 'approve') {
      handleApproveJob(confirmationJob.id, confirmationJob.title);
    } else if (confirmationType === 'reject') {
      handleRejectJob(confirmationJob.id, confirmationJob.title);
    }
    setConfirmationJob(null);
    setConfirmationType(null);
  };

  const handleCloseDialog = () => {
    setConfirmationJob(null);
    setConfirmationType(null);
  };

  if (jobs.length === 0 && initialJobs.length > 0) {
    // This case handles when all initial jobs have been processed
    return (
      <div className="text-center py-10 border rounded-lg bg-card">
          <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">All Clear!</h3>
          <p className="text-sm text-muted-foreground">
            All pending jobs have been reviewed.
          </p>
      </div>
    );
  }

   // This should ideally be handled by the parent page if initialJobs is empty.
   // But as a fallback if for some reason initialJobs is empty but the page rendered the table.
   if (initialJobs.length === 0) {
     return (
       <div className="text-center py-10 border rounded-lg bg-card">
         <Clock className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
         <h3 className="text-lg font-medium text-foreground mb-2">No Pending Jobs</h3>
         <p className="text-sm text-muted-foreground">
           There are currently no job postings awaiting review.
         </p>
       </div>
     );
   }


   return (
     <>
       <Card>
      {/* DESKTOP VIEW - Large screens */}
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
            {jobs.map((job) => {
              const jobSlug = generateJobSlug(job.id, job.title);

              return (
                <TableRow key={job.id} className="hover:bg-muted/50">
                  <TableCell className="font-medium">
                    <Link
                      href={`/jobs/${jobSlug}`}
                      className="hover:underline text-primary"
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Preview job post (opens in new tab)"
                    >
                      {job.title}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(job.status)}>
                      {formatStatusText(job.status)}
                    </Badge>
                  </TableCell>
                   <TableCell>
                     <div>{job.companyName}</div>
                     <div className="text-sm text-muted-foreground">{job.employerEmail}</div>
                   </TableCell>
                  <TableCell>{job.createdAt}</TableCell>
                  <TableCell className="text-right space-x-1">
                    <Button
                      variant="outline"
                      size="icon"
                      asChild
                      title="Preview Job"
                      className="h-8 w-8"
                    >
                      <Link href={`/jobs/${jobSlug}`} >
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                    {processingJobId === job.id && isProcessing ? (
                      <Button variant="outline" size="icon" disabled className="h-8 w-8">
                        <Loader2 className="h-4 w-4 animate-spin" />
                      </Button>
                    ) : (
                      <>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleApprove(job)}
                          disabled={isProcessing}
                          className="h-8 w-8 text-green-600 border-green-200 hover:bg-green-50"
                          title="Approve Job"
                        >
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleReject(job)}
                          disabled={isProcessing}
                          className="h-8 w-8 text-red-600 border-red-200 hover:bg-red-50"
                          title="Reject Job"
                        >
                          <XCircle className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* TABLET VIEW - Medium screens */}
      <div className="hidden md:block lg:hidden">
        <div className="p-4 space-y-3">
          {jobs.map((job) => {
            const jobSlug = generateJobSlug(job.id, job.title);

            return (
              <div key={job.id} className="border rounded-lg p-4 bg-card">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-grow min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <Link
                        href={`/jobs/${jobSlug}`}
                        className="font-semibold text-base hover:underline text-primary flex-shrink-0"
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Preview job post (opens in new tab)"
                      >
                        {job.title}
                      </Link>
                      <Badge variant={getStatusBadgeVariant(job.status)} className="text-xs">
                        {formatStatusText(job.status)}
                      </Badge>
                    </div>
                     <div className="text-sm text-muted-foreground">
                       <p>{job.companyName}</p>
                       <p>{job.employerEmail}</p>
                       <p>Submitted: {job.createdAt}</p>
                     </div>
                  </div>
                  <div className="flex-shrink-0 flex items-center gap-1">
                    <Button
                      variant="outline"
                      size="icon"
                      asChild
                      title="Preview Job"
                      className="h-8 w-8"
                    >
                      <Link href={`/jobs/${jobSlug}`} >
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                    {processingJobId === job.id && isProcessing ? (
                      <Button variant="outline" size="icon" disabled className="h-8 w-8">
                        <Loader2 className="h-4 w-4 animate-spin" />
                      </Button>
                    ) : (
                      <>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleApprove(job)}
                          disabled={isProcessing}
                          className="h-8 w-8 text-green-600 border-green-200 hover:bg-green-50"
                          title="Approve Job"
                        >
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleReject(job)}
                          disabled={isProcessing}
                          className="h-8 w-8 text-red-600 border-red-200 hover:bg-red-50"
                          title="Reject Job"
                        >
                          <XCircle className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* MOBILE VIEW - Small screens */}
      <div className="md:hidden space-y-3 p-4">
        {jobs.map((job) => {
          const jobSlug = generateJobSlug(job.id, job.title);

          return (
            <div key={job.id} className="border rounded-lg p-4 bg-card">
              <div className="space-y-3">
                {/* Header with title and status */}
                <div className="flex items-start justify-between gap-2">
                  <Link
                    href={`/jobs/${jobSlug}`}
                    className="font-semibold text-base hover:underline text-primary flex-1"
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Preview job post"
                  >
                    {job.title}
                  </Link>
                  <Badge variant={getStatusBadgeVariant(job.status)} className="text-xs">
                    {formatStatusText(job.status)}
                  </Badge>
                </div>

                 {/* Company and date */}
                 <div className="text-sm text-muted-foreground">
                   <p>{job.companyName}</p>
                   <p>{job.employerEmail}</p>
                   <p>Submitted: {job.createdAt}</p>
                 </div>

                 {/* Actions */}
                 <div className="flex items-center gap-1 pt-2">
                   <Button
                     variant="outline"
                     size="icon"
                     asChild
                     className="h-8 w-8"
                   >
                     <Link href={`/jobs/${jobSlug}`} >
                       <Eye className="h-4 w-4" />
                     </Link>
                   </Button>

                   {processingJobId === job.id && isProcessing ? (
                     <Button variant="outline" size="icon" disabled className="h-8 w-8">
                       <Loader2 className="h-4 w-4 animate-spin" />
                     </Button>
                   ) : (
                     <>
                       <Button
                         variant="outline"
                         size="icon"
                         onClick={() => handleApprove(job)}
                         disabled={isProcessing}
                         className="h-8 w-8 text-green-600 border-green-200 hover:bg-green-50"
                       >
                         <CheckCircle className="h-4 w-4" />
                       </Button>
                       <Button
                         variant="outline"
                         size="icon"
                         onClick={() => handleReject(job)}
                         disabled={isProcessing}
                         className="h-8 w-8 text-red-600 border-red-200 hover:bg-red-50"
                       >
                         <XCircle className="h-4 w-4" />
                       </Button>
                     </>
                   )}
                 </div>
              </div>
            </div>
          );
        })}
       </div>
     </Card>

     <ConfirmationDialog
       isOpen={!!confirmationJob}
       onClose={handleCloseDialog}
       onConfirm={handleConfirmAction}
       title={confirmationType === 'approve' ? 'Approve Job?' : 'Reject Job?'}
       description={confirmationType === 'approve' ? `Are you sure you want to approve "${confirmationJob?.title}"? This will make the job live.` : `Are you sure you want to reject "${confirmationJob?.title}"?`}
       confirmText={confirmationType === 'approve' ? 'Approve' : 'Reject'}
     />
   </>
   );
 }
