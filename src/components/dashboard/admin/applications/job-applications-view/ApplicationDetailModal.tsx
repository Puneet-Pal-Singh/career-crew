// src/components/dashboard/admin/applications/job-applications-view/ApplicationDetailModal.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { useMediaQuery } from "@/hooks/use-media-query";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Drawer, DrawerContent, DrawerHeader, DrawerFooter, DrawerClose } from "@/components/ui/drawer";
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getApplicationDetailsForAdminAction, type AdminApplicationDetails } from '@/app/actions/admin/applications/getApplicationDetailsForAdminAction';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, ExternalLink, Mail, Linkedin } from 'lucide-react';
import { getApplicationStatusBadgeVariant, formatStatusText } from '@/components/dashboard/shared/utils';

interface ApplicationDetailModalProps {
  applicationId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

// Reusable component for displaying a row of details, adapted from the employer modal.
const DetailRow = ({ label, value }: { label: string, value: React.ReactNode }) => (
  <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-4 gap-y-1 py-3 border-b last:border-b-0">
    <dt className="text-sm font-medium text-muted-foreground">{label}</dt>
    <dd className="col-span-1 sm:col-span-2 text-sm text-foreground break-words">{value || 'N/A'}</dd>
  </div>
);

export default function ApplicationDetailModal({ applicationId, isOpen, onClose }: ApplicationDetailModalProps) {
  const [details, setDetails] = useState<AdminApplicationDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isDesktop = useMediaQuery("(min-width: 768px)");

  useEffect(() => {
    if (isOpen && applicationId) {
      setIsLoading(true);
      setError(null);
      setDetails(null);

      getApplicationDetailsForAdminAction(applicationId)
        .then(result => {
          if (result.success && result.data) {
            setDetails(result.data);
          } else {
            setError(result.error || 'An unknown error occurred while fetching details.');
          }
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [isOpen, applicationId]);

  const ModalContent = () => (
    <>
      {isLoading && (
        <div className="space-y-4 p-4">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      )}

      {error && (
         <Alert variant="destructive" className="m-4">
           <AlertCircle className="h-4 w-4" />
           <AlertTitle>Error</AlertTitle>
           <AlertDescription>{error}</AlertDescription>
         </Alert>
      )}

      {details && (
        <div className="p-4">
          <dl>
            <DetailRow label="Applicant Name" value={details.applicantName} />
            <DetailRow 
              label="Applicant Email" 
              value={
                <a href={`mailto:${details.applicantEmail}`} className="flex items-center gap-2 text-primary hover:underline">
                  <Mail className="h-4 w-4" /> {details.applicantEmail}
                </a>
              } 
            />
            {details.linkedinProfileUrl && (
              <DetailRow 
                label="LinkedIn Profile" 
                value={
                  <a href={details.linkedinProfileUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-primary hover:underline">
                     <Linkedin className="h-4 w-4" /> View Profile <ExternalLink className="h-3 w-3" />
                  </a>
                } 
              />
            )}
            <DetailRow label="Applying For" value={details.jobTitle} />
            <DetailRow label="Date Applied" value={details.appliedAt} />
            <DetailRow 
              label="Status" 
              value={
                <Badge variant={getApplicationStatusBadgeVariant(details.status)} className="capitalize">
                  {formatStatusText(details.status)}
                </Badge>
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
                  <a href={details.resumeUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-primary hover:underline font-medium">
                    Download Resume <ExternalLink className="h-4 w-4" />
                  </a>
                ) : "No resume submitted"
              } 
            />
          </dl>
        </div>
      )}
    </>
  );

  if (isDesktop) {
    return (
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Application Details</DialogTitle>
            <DialogDescription>Viewing candidate&apos;s information as an administrator.</DialogDescription>
          </DialogHeader>
          <ModalContent />
          <DialogFooter className="pt-2">
            <Button variant="outline" onClick={onClose}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DialogTitle>Application Details</DialogTitle>
          <DialogDescription>Viewing candidate&apos;s information as an administrator.</DialogDescription>
        </DrawerHeader>
        <ModalContent />
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}