// src/components/dashboard/admin/PendingJobsTable.tsx
"use client";

import React, { useState, useTransition } from 'react';
import type { AdminPendingJobData } from '@/app/actions/adminActions'; // Import type from action file
import { approveJob, rejectJob } from '@/app/actions/adminActions';
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
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface PendingJobsTableProps {
  initialJobs: AdminPendingJobData[];
}

export default function PendingJobsTable({ initialJobs }: PendingJobsTableProps) {
  const [jobs, setJobs] = useState<AdminPendingJobData[]>(initialJobs);
  const [isProcessing, startTransition] = useTransition();
  const [processingJobId, setProcessingJobId] = useState<string | null>(null);
  const { toast } = useToast(); // For showing success/error messages

  const handleApprove = async (jobId: string, jobTitle: string) => {
    setProcessingJobId(jobId);
    startTransition(async () => {
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

  const handleReject = async (jobId: string, jobTitle: string) => {
    // Optional: Add a confirmation dialog before rejecting
    setProcessingJobId(jobId);
    startTransition(async () => {
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

  if (jobs.length === 0 && initialJobs.length > 0) {
    // This case handles when all initial jobs have been processed
    return (
        <div className="text-center py-10 border rounded-lg bg-card mt-8">
            <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
            <h3 className="mt-2 text-lg font-medium text-foreground">All Clear!</h3>
            <p className="mt-1 text-sm text-muted-foreground">
            All pending jobs have been reviewed.
            </p>
        </div>
    );
  }
  
  // This should ideally be handled by the parent page if initialJobs is empty.
  // But as a fallback if for some reason initialJobs is empty but the page rendered the table.
  if (initialJobs.length === 0) {
    return null; // Or a message, but page component should handle "no pending jobs"
  }


  return (
    <Table>
      <TableCaption>Job postings awaiting approval.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[40%]">Job Title</TableHead>
          <TableHead className="w-[30%]">Company</TableHead>
          <TableHead>Date Submitted</TableHead>
          <TableHead className="text-right w-[150px]">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {jobs.map((job) => (
          <TableRow key={job.id}>
            <TableCell className="font-medium">{job.title}</TableCell>
            <TableCell>{job.companyName}</TableCell>
            <TableCell>{job.createdAt}</TableCell>
            <TableCell className="text-right space-x-2">
              {processingJobId === job.id && isProcessing ? (
                <Loader2 className="h-5 w-5 animate-spin inline-block" />
              ) : (
                <>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleApprove(job.id, job.title)}
                    disabled={isProcessing}
                    className="text-green-600 border-green-600 hover:bg-green-50 hover:text-green-700"
                    title="Approve Job"
                  >
                    <CheckCircle className="h-4 w-4 mr-1 sm:mr-2" /> 
                    <span className="hidden sm:inline">Approve</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleReject(job.id, job.title)}
                    disabled={isProcessing}
                    className="text-red-600 border-red-600 hover:bg-red-50 hover:text-red-700"
                    title="Reject Job"
                  >
                    <XCircle className="h-4 w-4 mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">Reject</span>
                  </Button>
                </>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}