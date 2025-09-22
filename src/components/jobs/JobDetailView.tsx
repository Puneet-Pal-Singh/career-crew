// src/components/jobs/JobDetailView.tsx
"use client";

import React, { useState } from 'react';
import type { JobDetailData } from '@/types';
import type { User } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import ApplicationModal from '@/components/jobs/ApplicationModal';
import JobDetailHeaderCard from './job-detail/JobDetailHeaderCard';
import JobDetailAbout from './job-detail/JobDetailAbout';
// --- NEW IMPORTS ---
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Eye } from "lucide-react";

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

  // --- NEW LOGIC: PREVIEW MODE CHECK ---
  // A job is in "preview mode" if its status is anything other than APPROVED.
  const isPreview = job.status !== 'APPROVED';

  return (
    <>
      <div className="bg-muted/30 min-h-screen">
        {/* --- NEW COMPONENT: PREVIEW BANNER --- */}
        {isPreview && (
          <div className="bg-yellow-100 text-yellow-800 sticky top-16 z-10 border-b">
            <div className="container mx-auto max-w-5xl px-4 py-3">
              <Alert variant="default" className="border-yellow-300 bg-yellow-50">
                <Eye className="h-4 w-4 !text-yellow-800" />
                <AlertTitle className="font-semibold !text-yellow-900">Preview Mode</AlertTitle>
                <AlertDescription className="!text-yellow-800">
                  This job posting is not live. It is only visible to you.
                </AlertDescription>
              </Alert>
            </div>
          </div>
        )}

        <div className="container mx-auto max-w-5xl py-8 px-4">
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