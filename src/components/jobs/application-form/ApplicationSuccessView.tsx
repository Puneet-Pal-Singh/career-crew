// src/components/jobs/application-form/ApplicationSuccessView.tsx
"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle, FileText } from 'lucide-react';
import Link from 'next/link'; // <-- Import Link

interface ApplicationSuccessViewProps {
  onClose: () => void;
}

export default function ApplicationSuccessView({ onClose }: ApplicationSuccessViewProps) {
  return (
    <div className="py-8 text-center flex flex-col items-center">
      <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
      <h3 className="text-xl font-semibold">Application Submitted!</h3>
      <p className="text-muted-foreground mt-2">The employer has received your application. Good luck!</p>
      
      {/* THE IMPROVEMENT: Add consistent action buttons */}
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