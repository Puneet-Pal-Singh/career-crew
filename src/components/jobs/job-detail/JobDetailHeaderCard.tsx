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
      <div className="grid grid-cols-1 md:grid-cols-[auto_1fr_auto] items-start gap-4">
        {/* Company Logo */}
        <Image 
          src={job.companyLogoUrl || '/company-logos/default-company-logo.svg'}
          alt={`${job.companyName} Logo`}
          width={64} // Slightly larger for more impact
          height={64}
          className="rounded-lg border bg-white flex-shrink-0"
        />

        {/* Job Title and Metadata */}
        <div className="flex flex-col gap-1.5">
          <p className="text-sm font-medium text-muted-foreground">{job.companyName}</p>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">{job.title}</h1>
          <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
            <span className="flex items-center"><MapPin className="w-4 h-4 mr-1.5" />{job.location}</span>
            {job.jobType && <span className="flex items-center"><Briefcase className="w-4 h-4 mr-1.5" />{job.jobType}</span>}
          </div>
        </div>

        {/* Apply Button */}
        <div className="w-full md:w-auto">
          <Button size="lg" onClick={onApplyNow} className="w-full">Apply Now</Button>
        </div>
      </div>
      
      {/* --- REFACTORED: Skills / Tags Section --- */}
      {/* We now place the tags at the bottom of the card, but without an extra title for a cleaner look */}
      {job.tags && job.tags.length > 0 && (
        <div className="mt-5 pt-4 border-t flex flex-wrap gap-2">
          {job.tags.map(tag => (
            <Badge key={tag} variant="secondary" className="font-medium">
              {tag}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}