// src/components/dashboard/employer/ApplicationDetailModal.tsx
"use client";

import React, { useState, useEffect, useTransition } from 'react';
import { useMediaQuery } from "@/hooks/use-media-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter, DrawerClose } from "@/components/ui/drawer";
import { Button } from '@/components/ui/button';
import { getApplicationDetailsAction, type ApplicationDetails } from '@/app/actions/employer/applications/getApplicationDetailsAction';
import { updateApplicationStatusAction } from '@/app/actions/employer/applications/updateApplicationStatusAction';
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, CheckCircle } from 'lucide-react';
import type { ApplicationStatusOption } from '@/types';

// Import our new SOLID components
import { ApplicationDetailSkeleton } from './application-details/ApplicationDetailSkeleton';
import { ApplicationDetailView } from './application-details/ApplicationDetailView';

interface ApplicationDetailModalProps {
  applicationId: string | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusChange: (applicationId: string, newStatus: ApplicationStatusOption) => void;
}

export default function ApplicationDetailModal({ applicationId, isOpen, onClose, onStatusChange }: ApplicationDetailModalProps) {
  const [details, setDetails] = useState<ApplicationDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // 1. ADD NEW STATE to track the successful update
  const [showUpdateSuccess, setShowUpdateSuccess] = useState(false);

  // THE RACE CONDITION FIX: Use separate transitions
  const [isManualUpdatePending, startManualUpdateTransition] = useTransition();
  const [isAutoUpdatePending, startAutoUpdateTransition] = useTransition();
  // A combined state to disable the entire UI during any update
  const isUpdatingStatus = isManualUpdatePending || isAutoUpdatePending;

  const isDesktop = useMediaQuery("(min-width: 768px)");

  useEffect(() => {
    if (isOpen && applicationId) {
      setIsLoading(true);
      setError(null);
      setDetails(null);

      getApplicationDetailsAction(applicationId)
        .then(result => {
          if (result.success && result.data) setDetails(result.data);
          else setError(result.error || 'An unknown error occurred.');
        })
        .finally(() => setIsLoading(false));
    }
  }, [isOpen, applicationId]);

  // THE NEW FEATURE LOGIC: This handler is now responsible for the auto-update.
  const handleViewResume = () => {
    // Prevent action if an update is already in progress
    if (!details || details.status !== 'SUBMITTED' || isUpdatingStatus) {
      // If the status is not 'SUBMITTED', do nothing. Just let the link open.
      return;
    }

    console.log(`[ViewResume] Application is SUBMITTED. Updating to VIEWED.`);
    startAutoUpdateTransition(() => {
      // No toast needed for this silent, automatic action
      updateApplicationStatusAction(details.id, 'VIEWED').then(updateResult => {
        if (updateResult.success) {
          setDetails(prev => prev ? { ...prev, status: 'VIEWED' } : null);
          onStatusChange(details.id, 'VIEWED');
        } else {
          // If the silent update fails, show a toast so the user is aware
          toast.error(`Failed to auto-update status: ${updateResult.error}`);
          console.error("Failed to auto-update status to 'VIEWED':", updateResult.error);
        }
      });
    });
  };

  const handleStatusChange = (newStatus: ApplicationStatusOption) => {
    // Prevent action if an update is already in progress
    if (!details || details.status === newStatus || isUpdatingStatus) return;

    // BUG HUNT: Log the exact value being sent to the server action.
    console.log(`[handleStatusChange] Attempting to update status from "${details.status}" to "${newStatus}"`);

    startManualUpdateTransition(() => {
      toast.promise(updateApplicationStatusAction(details.id, newStatus), {
        loading: "Updating status...",
        success: (result) => {
          if (result.success) {
            setDetails(prev => prev ? { ...prev, status: newStatus } : null);
            onStatusChange(details.id, newStatus);

            // 2. TRIGGER THE SUCCESS BANNER
            setShowUpdateSuccess(true);
            // Automatically hide the banner after a few seconds
            setTimeout(() => setShowUpdateSuccess(false), 3000);

            return result.message; // This will still show the toast as a secondary confirmation
          } else {
            throw new Error(result.error);
          }
        },
        error: (err) => err.message,
      });
    });
  };

  const ModalContent = () => {
    if (isLoading) return <ApplicationDetailSkeleton />;
    if (error) return (
      <Alert variant="destructive" className="m-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
    if (details) return (
      <>
        {/* 3. RENDER THE BANNER conditionally */}
        {showUpdateSuccess && (
          <div className="p-3 mb-4 bg-green-50 dark:bg-green-900/50 border border-green-200 dark:border-green-800 rounded-md flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
            <p className="text-sm font-medium text-green-800 dark:text-green-200">Status updated successfully!</p>
          </div>
        )}
        <ApplicationDetailView 
          details={details}
          isPending={isUpdatingStatus}
          onStatusChange={handleStatusChange}
          onViewResume={handleViewResume}
        />
      </>
    );
    return null;
  };

  if (isDesktop) {
    return (
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Application Details</DialogTitle>
            <DialogDescription>Review the candidate&apos;s information and update their status.</DialogDescription>
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
          <DrawerTitle>Application Details</DrawerTitle>
          <DrawerDescription>Review the candidate&apos;s information and update their status.</DrawerDescription>
        </DrawerHeader>
        <ModalContent />
        <DrawerFooter className="pt-2">
          <DrawerClose asChild><Button variant="outline">Close</Button></DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}