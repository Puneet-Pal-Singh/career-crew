"use client";

import React from 'react';
import { useMediaQuery } from "@/hooks/use-media-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Drawer, DrawerContent, DrawerHeader, DrawerDescription, DrawerFooter, DrawerClose } from "@/components/ui/drawer";
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, CheckCircle } from 'lucide-react';
import type { ApplicationStatusOption } from '@/types';

import { ApplicationDetailSkeleton } from './application-details/ApplicationDetailSkeleton';
import { ApplicationDetailView } from './application-details/ApplicationDetailView';
import { useApplicationDetails } from '@/hooks/useApplicationDetails'; // <-- Import our new hook

interface ApplicationDetailModalProps {
  applicationId: string | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusChange: (applicationId: string, newStatus: ApplicationStatusOption) => void;
}

export default function ApplicationDetailModal({ applicationId, isOpen, onClose, onStatusChange }: ApplicationDetailModalProps) {
  // All complex logic is now abstracted into the hook.
  const {
    details,
    isLoading,
    error,
    isPending,
    showUpdateSuccess,
    handleViewResume,
    handleStatusChange,
  } = useApplicationDetails({ applicationId, isOpen, onStatusChange });

  const isDesktop = useMediaQuery("(min-width: 768px)");

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
        {showUpdateSuccess && (
          <div className="p-3 mb-4 bg-green-50 dark:bg-green-900/50 border border-green-200 dark:border-green-800 rounded-md flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
            <p className="text-sm font-medium text-green-800 dark:text-green-200">Status updated successfully!</p>
          </div>
        )}
        <ApplicationDetailView 
          details={details}
          isPending={isPending}
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
          <DialogTitle>Application Details</DialogTitle>
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