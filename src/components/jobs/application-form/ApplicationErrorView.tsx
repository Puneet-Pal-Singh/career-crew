// src/components/jobs/application-form/ApplicationErrorView.tsx
"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { XCircle, Info, FileText } from 'lucide-react';
import Link from 'next/link';

interface ApplicationErrorViewProps {
  message: string;
  onClose: () => void;
  onRetry: () => void;
}

export default function ApplicationErrorView({ message, onClose, onRetry }: ApplicationErrorViewProps) {
  const isAlreadyApplied = message.toLowerCase().includes("already applied");

  // A. The "Already Applied" Informational View
  if (isAlreadyApplied) {
    return (
      <div className="py-8 text-center flex flex-col items-center">
        <Info className="h-16 w-16 text-blue-500 mb-4" />
        <h3 className="text-xl font-semibold">You Have Already Applied</h3>
        <p className="text-muted-foreground mt-2">
          Our records show you&apos;ve already submitted an application for this position.
        </p>
        <div className="mt-6 flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Button onClick={onClose} variant="outline">Close</Button>
          <Button asChild>
            <Link href="/dashboard/seeker/applications">
              <FileText className="mr-2 h-4 w-4" /> View My Applications
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  // B. The Generic Error View (for network errors, etc.)
  return (
    <div className="py-8 text-center flex flex-col items-center">
      <XCircle className="h-16 w-16 text-destructive mb-4" />
      <h3 className="text-xl font-semibold">Submission Failed</h3>
      <p className="text-muted-foreground mt-2">{message}</p>
      <div className="mt-6 flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
        <Button onClick={onRetry} variant="outline">Try Again</Button>
        <Button onClick={onClose}>Close</Button>
      </div>
    </div>
  );
}