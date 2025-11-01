// src/components/jobs/application-form/ApplicationSuccessView.tsx
"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';

interface ApplicationSuccessViewProps {
  onClose: () => void;
}

export default function ApplicationSuccessView({ onClose }: ApplicationSuccessViewProps) {
  return (
    <div className="py-8 text-center flex flex-col items-center">
      <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
      <h3 className="text-xl font-semibold">Application Submitted!</h3>
      <p className="text-muted-foreground mt-2">The employer has received your application.</p>
      <Button onClick={onClose} className="mt-6 w-full sm:w-auto">Close</Button>
    </div>
  );
}