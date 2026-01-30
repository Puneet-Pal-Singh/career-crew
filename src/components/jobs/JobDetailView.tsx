// src/components/jobs/JobDetailView.tsx
"use client";

import React, { useState } from 'react';
import type { JobDetailData } from '@/types';
import type { User } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import ApplicationModal from '@/components/jobs/application-form/ApplicationModal';
import JobDetailHeaderCard from './job-detail/JobDetailHeaderCard';
import JobDetailAbout from './job-detail/JobDetailAbout';
import JobDetailSidebar from './job-detail/JobDetailSidebar';
// --- NEW IMPORTS ---
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Eye, ArrowLeft } from "lucide-react";
import Link from 'next/link';

interface JobDetailViewProps {
  job: JobDetailData;
  user: User | null;
}

export default function JobDetailView({ job, user }: JobDetailViewProps) {
  const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false);
  const router = useRouter();

  const handleApplyNow = () => {
    if (job.applicationUrl) {
      window.open(job.applicationUrl, '_blank');
      return;
    }

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
      <div className="bg-background min-h-screen pb-20">
        {/* --- NEW COMPONENT: PREVIEW BANNER --- */}
        {isPreview && (
          <div className="bg-yellow-100 text-yellow-800 sticky top-16 z-10 border-b">
            <div className="container mx-auto max-w-6xl px-4 py-3">
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

        <div className="container mx-auto max-w-6xl py-10 px-4">
          <div className="mb-8">
            <Link href="/jobs" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Back to Jobs
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Main Content */}
            <div className="lg:col-span-9">
              <JobDetailHeaderCard job={job} onApplyNow={handleApplyNow} />
              <JobDetailAbout
                description={job.description}
                requirements={job.requirements}
                applicationUrl={job.applicationUrl}
                onApplyNow={handleApplyNow}
              />
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-3 lg:pt-1">
               <div className="sticky top-24">
                  <JobDetailSidebar job={job} onApplyNow={handleApplyNow} />
               </div>
            </div>
          </div>
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
