"use client";

import React, { useState } from 'react';
import type { JobDetailData } from '@/types';
import type { User } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import ApplicationModal from '@/components/jobs/ApplicationModal';

// Import our new, focused components
import JobDetailHeader from './job-detail/JobDetailHeader';
import JobDetailBody from './job-detail/JobDetailBody';
import JobApplicationInstructions from './job-detail/JobApplicationInstructions';

interface JobDetailViewProps {
  job: JobDetailData;
  user: User | null;
}

export default function JobDetailView({ job, user }: JobDetailViewProps) {
  const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false);
  const router = useRouter();

  const handleApplyNow = () => {
    if (!user) {
      // The "redirect-back" logic is preserved.
      router.push(`/login?redirectTo=${window.location.pathname}`);
    } else {
      setIsApplicationModalOpen(true);
    }
  };

  return (
    <>
      <div className="container mx-auto max-w-3xl py-12 px-4">
        <div className="bg-card p-6 sm:p-10 rounded-xl shadow-lg">
          
          {/* Component 1: The Header */}
          <JobDetailHeader job={job} />

          {/* Component 2: The Body */}
          <JobDetailBody 
            description={job.description} 
            requirements={job.requirements} 
          />
          
          {/* Component 3: The Application Instructions */}
          <JobApplicationInstructions
            applicationEmail={job.applicationEmail}
            applicationUrl={job.applicationUrl}
          />

        </div>
      </div>

      {/* The "Apply Now" button is now a simple button within the main content. */}
      {/* We can later add a floating bar if desired. */}
      <div className="sticky bottom-0 w-full bg-background/80 backdrop-blur-sm border-t p-4 flex justify-center">
        <Button size="lg" onClick={handleApplyNow}>
          Apply Now
        </Button>
      </div>

      <ApplicationModal
        isOpen={isApplicationModalOpen}
        onOpenChange={setIsApplicationModalOpen}
        jobId={String(job.id)}
        jobTitle={job.title}
      />
    </>
  );
}