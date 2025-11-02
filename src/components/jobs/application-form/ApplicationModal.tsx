// src/components/jobs/application-form/ApplicationModal.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { useMediaQuery } from "@/hooks/use-media-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from '@/components/ui/drawer';

import ApplicationForm from './ApplicationForm';
import ApplicationSuccessView from './ApplicationSuccessView';
import ApplicationErrorView from './ApplicationErrorView'; // <-- 1. Import the new error view

interface ApplicationModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  jobId: string;
  jobTitle: string;
}

export default function ApplicationModal({ isOpen, onOpenChange, jobId, jobTitle }: ApplicationModalProps) {
  const [view, setView] = useState<'form' | 'success' | 'error'>('form'); // <-- 2. State now manages the view
  const [errorMessage, setErrorMessage] = useState('');
  const isDesktop = useMediaQuery("(min-width: 768px)");

  useEffect(() => {
    if (isOpen) {
      setView('form'); // Reset to the form view when opened
      setErrorMessage('');
    }
  }, [isOpen]);

  const handleApplicationSuccess = () => setView('success');
  const handleApplicationError = (message: string) => {
    setErrorMessage(message);
    setView('error');
  };
  const handleRetry = () => setView('form');
  const handleClose = () => onOpenChange(false);

  // 3. Conditionally render the content based on the `view` state
  const renderContent = () => {
    switch (view) {
      case 'success':
        return <ApplicationSuccessView onClose={handleClose} />;
      case 'error':
        return <ApplicationErrorView message={errorMessage} onClose={handleClose} onRetry={handleRetry} />;
      case 'form':
      default:
        return (
          <ApplicationForm
            jobId={jobId}
            onApplicationSuccess={handleApplicationSuccess}
            onApplicationError={handleApplicationError}
            onCancel={handleClose}
          />
        );
    }
  };

  const showDescription = view === 'form';

  if (isDesktop) {
    return (
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-2xl">Apply to: {jobTitle}</DialogTitle>
            {showDescription && <DialogDescription>Please fill in your details below. Good luck!</DialogDescription>}
          </DialogHeader>
          <div className="py-4">{renderContent()}</div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={isOpen} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle className="text-2xl">Apply to: {jobTitle}</DrawerTitle>
          {showDescription && <DrawerDescription>Please fill in your details below. Good luck!</DrawerDescription>}
        </DrawerHeader>
        <div className="p-4">{renderContent()}</div>
      </DrawerContent>
    </Drawer>
  );
}