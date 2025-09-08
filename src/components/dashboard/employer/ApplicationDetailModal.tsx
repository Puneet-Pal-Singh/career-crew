// src/components/dashboard/employer/ApplicationDetailModal.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { getApplicationDetailsAction, type ApplicationDetails } from '@/app/actions/employer/getApplicationDetailsAction';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, ExternalLink } from 'lucide-react';

interface ApplicationDetailModalProps {
  applicationId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

const DetailRow = ({ label, value }: { label: string, value: React.ReactNode }) => (
  <div className="grid grid-cols-3 gap-4 py-2">
    <dt className="text-sm font-medium text-muted-foreground">{label}</dt>
    <dd className="col-span-2 text-sm">{value || 'N/A'}</dd>
  </div>
);

export default function ApplicationDetailModal({ applicationId, isOpen, onClose }: ApplicationDetailModalProps) {
  const [details, setDetails] = useState<ApplicationDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Application Details</DialogTitle>
          <DialogDescription>Review the candidate&quot;s information and resume.</DialogDescription>
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
              <DetailRow label="Status" value={<Badge variant="outline" className="capitalize">{details.status.toLowerCase()}</Badge>} />
              <DetailRow label="Cover Letter" value={<p className="italic text-muted-foreground">&quot;{details.coverLetterSnippet}&quot;</p>} />
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