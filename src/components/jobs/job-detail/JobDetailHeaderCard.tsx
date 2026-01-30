// src/components/jobs/job-detail/JobDetailHeaderCard.tsx
"use client";

import type { JobDetailData } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, ExternalLink, ArrowLeft } from 'lucide-react';
import JobLogo from '@/components/shared/JobLogo';
import Link from 'next/link';

interface JobDetailHeaderCardProps {
  job: JobDetailData;
  onApplyNow: () => void;
}

export default function JobDetailHeaderCard({ job, onApplyNow }: JobDetailHeaderCardProps) {
  return (
    <div className="mb-8">
      <div className="flex flex-col md:flex-row gap-6 items-start justify-between">
        <div className="flex flex-col sm:flex-row items-start gap-5">
           <JobLogo
            src={job.companyLogoUrl}
            alt={`${job.companyName} Logo`}
            title={job.title}
            width={72}
            height={72}
            className="rounded-xl border bg-white shadow-sm flex-shrink-0"
          />
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-2 leading-tight">{job.title}</h1>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-muted-foreground text-sm sm:text-base">
               <span className="font-semibold text-foreground">{job.companyName}</span>
               <span className="hidden sm:inline">•</span>
               <div className="flex items-center gap-1">
                 <MapPin className="w-4 h-4" />
                 <span>{job.location}</span>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}