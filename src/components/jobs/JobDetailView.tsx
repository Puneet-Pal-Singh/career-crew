// src/components/jobs/JobDetailView.tsx
"use client";

import React, { useState } from 'react';
import type { JobDetailData } from '@/types';
import type { User } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import ApplicationModal from '@/components/jobs/ApplicationModal';
// ✅ Import our two new, correct components.
import JobDetailHeaderCard from './job-detail/JobDetailHeaderCard';
import JobDetailAbout from './job-detail/JobDetailAbout';

interface JobDetailViewProps {
  job: JobDetailData;
  user: User | null;
}

export default function JobDetailView({ job, user }: JobDetailViewProps) {
  const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false);
  const router = useRouter();

  const handleApplyNow = () => {
    if (!user) {
      router.push(`/login?redirectTo=${window.location.pathname}`);
    } else {
      setIsApplicationModalOpen(true);
    }
  };

  return (
    <>
      <div className="bg-muted/40">
        <div className="container mx-auto max-w-4xl py-12 px-4">
          {/* ✅ Compose the two components to create the final layout. */}
          <JobDetailHeaderCard job={job} onApplyNow={handleApplyNow} />
          <JobDetailAbout 
            description={job.description} 
            requirements={job.requirements}
            onApplyNow={handleApplyNow}
          />
        </div>
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