// src/components/dashboard/employer/ApplicationDetailModal.tsx
"use client";

import React, { useState, useEffect, useTransition } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { getApplicationDetailsAction, type ApplicationDetails } from '@/app/actions/employer/applications/getApplicationDetailsAction';
import { updateApplicationStatusAction } from '@/app/actions/employer/applications/updateApplicationStatusAction';
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, ExternalLink, ChevronDown } from 'lucide-react';

// Import the specific type from your main types file
import type { ApplicationStatusOption } from '@/types';

interface ApplicationDetailModalProps {
  applicationId: string | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusChange: (applicationId: string, newStatus: ApplicationStatusOption) => void;
}

// A reusable component for displaying a row of details.
const DetailRow = ({ label, value }: { label: string, value: React.ReactNode }) => (
  <div className="grid grid-cols-3 gap-4 py-3 first:pt-0 last:pb-0">
    <dt className="text-sm font-medium text-muted-foreground">{label}</dt>
    <dd className="col-span-2 text-sm">{value || 'N/A'}</dd>
  </div>
);

// Use the imported type as the single source of truth for the available statuses.
const APPLICATION_STATUSES: ApplicationStatusOption[] = [
  "SUBMITTED", 
  "VIEWED", 
  "INTERVIEWING", 
  "OFFERED", 
  "HIRED", 
  "REJECTED"
];

export default function ApplicationDetailModal({ applicationId, isOpen, onClose, onStatusChange }: ApplicationDetailModalProps) {
  const [details, setDetails] = useState<ApplicationDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (isOpen && applicationId) {
      setIsLoading(true);
      setError(null);
      setDetails(null);

      getApplicationDetailsAction(applicationId)
        .then(result => {
          if (result.success && result.data) {
            setDetails(result.data);
          } else {
            setError(result.error || 'An unknown error occurred.');
          }
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [isOpen, applicationId]);

  // This function is now fully type-safe.
  const handleStatusChange = (newStatus: ApplicationStatusOption) => {
    if (!details || details.status === newStatus) return;

    startTransition(() => {
      toast.info("Updating status...");
      updateApplicationStatusAction(details.id, newStatus).then(result => {
        if (result.success) {
          toast.success(result.message);
          setDetails(prev => prev ? { ...prev, status: newStatus } : null);
          onStatusChange(details.id, newStatus);
        } else {
          toast.error(result.message);
        }
      });
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Application Details</DialogTitle>
          <DialogDescription>Review the candidate&apos;s information and update their status.</DialogDescription>
        </DialogHeader>
        
        {isLoading && (
          <div className="space-y-4 py-4">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
            <Skeleton className="h-4 w-[300px]" />
            <Skeleton className="h-4 w-[280px]" />
          </div>
        )}

        {error && (
           <Alert variant="destructive">
             <AlertCircle className="h-4 w-4" />
             <AlertTitle>Error</AlertTitle>
             <AlertDescription>{error}</AlertDescription>
           </Alert>
        )}

        {details && (
          <div className="py-4">
            <dl className="divide-y divide-border">
              <DetailRow label="Applicant Name" value={details.applicantName} />
              <DetailRow label="Applicant Email" value={details.applicantEmail} />
              <DetailRow label="Applying For" value={details.jobTitle} />
              <DetailRow label="Date Applied" value={details.appliedAt} />
              <DetailRow 
                label="Status" 
                value={
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" disabled={isPending} className="capitalize w-[150px] justify-between">
                        {details.status.toLowerCase()}
                        <ChevronDown className="ml-2 h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                      <DropdownMenuLabel>Change Status</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {APPLICATION_STATUSES.map(status => (
                        <DropdownMenuItem 
                          key={status} 
                          disabled={isPending || details.status === status}
                          onClick={() => handleStatusChange(status)}
                          className="capitalize"
                        >
                          {status.toLowerCase()}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                } 
              />
              <DetailRow 
                label="Cover Letter" 
                value={details.coverLetterSnippet ? <p className="italic text-muted-foreground">&quot;{details.coverLetterSnippet}&quot;</p> : "N/A"} 
              />
              <DetailRow 
                label="Resume" 
                value={
                  details.resumeUrl ? (
                    <a href={details.resumeUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-primary hover:underline">
                      View Resume <ExternalLink className="h-4 w-4" />
                    </a>
                  ) : "No resume submitted"
                } 
              />
            </dl>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}