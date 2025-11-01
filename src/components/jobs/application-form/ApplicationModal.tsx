// src/components/jobs/ApplicationModal.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { useMediaQuery } from "@/hooks/use-media-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from "@/components/ui/drawer";

// Import our new, SOLID-compliant child components
import ApplicationForm from './ApplicationForm';
import ApplicationSuccessView from './ApplicationSuccessView';

interface ApplicationModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  jobId: string;
  jobTitle: string;
}

// This component is now a clean "Orchestrator".
// Its only responsibilities are to manage state and render the correct children.
export default function ApplicationModal({ isOpen, onOpenChange, jobId, jobTitle }: ApplicationModalProps) {
  const [isSuccess, setIsSuccess] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  // Effect to reset the view back to the form when the modal is reopened.
  useEffect(() => {
    if (isOpen) {
      setIsSuccess(false);
    }
  }, [isOpen]);

  const handleApplicationSuccess = () => {
    setIsSuccess(true);
  };

  const handleClose = () => {
    onOpenChange(false);
  };

  // The content is now conditionally rendered based on the success state.
  const modalContent = isSuccess ? (
    <ApplicationSuccessView onClose={handleClose} />
  ) : (
    <ApplicationForm
      jobId={jobId}
      onApplicationSuccess={handleApplicationSuccess}
      onCancel={handleClose}
    />
  );

  if (isDesktop) {
    return (
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-2xl">Apply to: {jobTitle}</DialogTitle>
            {!isSuccess && (
              <DialogDescription>Please fill in your details below. Good luck!</DialogDescription>
            )}
          </DialogHeader>
          <div className="py-4">{modalContent}</div>
          {/* Footer is no longer needed here, as buttons are inside the children */}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={isOpen} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle className="text-2xl">Apply to: {jobTitle}</DrawerTitle>
          {!isSuccess && (
            <DrawerDescription>Please fill in your details below. Good luck!</DrawerDescription>
          )}
        </DrawerHeader>
        <div className="p-4">{modalContent}</div>
        {/* Footer is no longer needed here */}
      </DrawerContent>
    </Drawer>
  );
}