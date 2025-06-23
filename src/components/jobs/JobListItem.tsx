// src/components/jobs/JobListItem.tsx
"use client";

import type { JobCardData } from '@/types';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
// import { Badge } from '@/components/ui/badge';
import { MapPin, Briefcase, DollarSign, ExternalLink } from 'lucide-react';

interface JobListItemProps {
  job: JobCardData;
}

export default function JobListItem({ job }: JobListItemProps) {
  return (
    <div className="bg-card p-4 rounded-lg border hover:shadow-md transition-shadow duration-200 flex flex-col sm:flex-row items-start sm:items-center gap-4">
      <div className="flex-shrink-0">
        <Image 
          src={job.companyLogoUrl || '/company-logos/default-company-logo.svg'} 
          alt={`${job.companyName} logo`}
          width={48} // 12 * 4px = 48px
          height={48}
          className="rounded-md object-contain border p-1"
        />
      </div>
      <div className="flex-grow">
        <h3 className="text-lg font-semibold text-foreground hover:text-primary transition-colors">
          <Link href={`/jobs/${job.id}`}>{job.title}</Link>
        </h3>
        <p className="text-sm text-muted-foreground">{job.companyName}</p>
        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground">
          <span className="flex items-center"><MapPin className="w-4 h-4 mr-1.5"/>{job.location}</span>
          {job.type && <span className="flex items-center"><Briefcase className="w-4 h-4 mr-1.5"/>{job.type.replace('_', ' ')}</span>}
          {job.salary && <span className="flex items-center"><DollarSign className="w-4 h-4 mr-1.5"/>{job.salary}</span>}
        </div>
      </div>
      <div className="flex-shrink-0 w-full sm:w-auto mt-4 sm:mt-0 flex flex-col sm:items-end gap-2">
        <Button asChild className="w-full sm:w-auto">
          <Link href={`/jobs/${job.id}`}>
            View Details <ExternalLink className="w-4 h-4 ml-2"/>
          </Link>
        </Button>
        <p className="text-xs text-muted-foreground text-left sm:text-right">
          Posted: {job.postedDate}
        </p>
      </div>
    </div>
  );
}