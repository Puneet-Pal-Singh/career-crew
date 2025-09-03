// src/components/jobs/job-detail/JobDetailHeaderCard.tsx
"use client";

import type { JobDetailData } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { MapPin, Briefcase } from 'lucide-react';

interface JobDetailHeaderCardProps {
  job: JobDetailData;
  onApplyNow: () => void;
}

export default function JobDetailHeaderCard({ job, onApplyNow }: JobDetailHeaderCardProps) {
  return (
    <div className="bg-card p-6 rounded-lg border shadow-sm">
      <div className="flex flex-col sm:flex-row items-start gap-4">
        <Image 
          src={job.companyLogoUrl || '/company-logos/default-company-logo.svg'}
          alt={`${job.companyName} Logo`}
          width={48}
          height={48}
          className="rounded-md border bg-white flex-shrink-0"
        />
        <div className="flex-grow">
          <p className="text-sm text-muted-foreground">{job.companyName}</p>
          <h1 className="text-2xl font-bold tracking-tight">{job.title}</h1>
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
            <span className="flex items-center"><MapPin className="w-4 h-4 mr-1.5" />{job.location}</span>
            {job.jobType && <span className="flex items-center"><Briefcase className="w-4 h-4 mr-1.5" />{job.jobType}</span>}
          </div>
        </div>
        <div className="flex-shrink-0 w-full sm:w-auto mt-4 sm:mt-0">
          <Button size="lg" onClick={onApplyNow} className="w-full">Apply Now</Button>
        </div>
      </div>
      
      {job.tags && job.tags.length > 0 && (
        <div className="mt-4 pt-4 border-t">
          <h3 className="text-sm font-semibold mb-2">Skills</h3>
          <div className="flex flex-wrap gap-2">
            {job.tags.map(tag => <Badge key={tag} variant="secondary">{tag}</Badge>)}
          </div>
        </div>
      )}
    </div>
  );
}