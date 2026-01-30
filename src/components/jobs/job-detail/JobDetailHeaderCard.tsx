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
      <div className="mb-6">
         <Link href="/jobs" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Jobs
         </Link>
      </div>

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
               {job.jobType && (
                 <>
                   <span className="hidden sm:inline">•</span>
                   <Badge variant="secondary" className="font-normal">
                     {job.jobType}
                   </Badge>
                 </>
               )}
            </div>
          </div>
        </div>

        <div className="w-full md:w-auto flex-shrink-0 pt-2">
           <Button size="lg" onClick={onApplyNow} className="w-full md:w-auto px-8 shadow-sm h-12 text-base">
             {job.applicationUrl ? (
              <>
                Apply on Company Site
                <ExternalLink className="ml-2 h-4 w-4" />
              </>
            ) : (
              "Apply Now"
            )}
           </Button>
        </div>
      </div>
    </div>
  );
}