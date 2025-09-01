// src/components/jobs/JobListItem.tsx
"use client";

import type { JobCardData } from '@/types';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { MapPin, Briefcase, DollarSign, ExternalLink } from 'lucide-react';
// ✅ THE FIX: Import our new, centralized date formatting function.
import { formatDatePosted } from '@/lib/utils';
import { generateJobSlug } from '@/lib/utils'; // Make sure slug generation is also in utils

interface JobListItemProps {
  // ✅ IMPORTANT: We are now expecting the unformatted JobCardData type.
  job: JobCardData;
}

export default function JobListItem({ job }: JobListItemProps) {
  // The component expects a slug, so we generate it here if it's not provided.
  // This makes the component more robust.
  const slug = generateJobSlug(job.id, job.title);
  
  // This logic is now more robust, expecting numbers and formatting them.
  const formatSalary = (min?: number | null, max?: number | null): string | null => {
    if (!min && !max) return null;
    if (min && max) return `$${min / 1000}k - $${max / 1000}k`;
    if (min) return `From $${min / 1000}k`;
    if (max) return `Up to $${max / 1000}k`;
    return "Competitive";
  };
  const salaryDisplay = formatSalary(job.salaryMin, job.salaryMax);

  return (
    <div className="bg-card p-4 rounded-lg border hover:shadow-md transition-shadow duration-200 flex flex-col sm:flex-row items-start sm:items-center gap-4">
      <div className="flex-shrink-0">
        <Image 
          src={job.companyLogoUrl || '/company-logos/default-company-logo.svg'} 
          alt={`${job.companyName} logo`}
          width={48}
          height={48}
          className="rounded-md object-contain border p-1 bg-white"
        />
      </div>
      <div className="flex-grow">
        <h3 className="text-lg font-semibold text-foreground hover:text-primary transition-colors">
          <Link href={`/jobs/${slug}`}>{job.title}</Link>
        </h3>
        <p className="text-sm text-muted-foreground">{job.companyName}</p>
        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground">
          <span className="flex items-center"><MapPin className="w-4 h-4 mr-1.5"/>{job.location}</span>
          {job.jobType && <span className="flex items-center"><Briefcase className="w-4 h-4 mr-1.5"/>{job.jobType}</span>}
          {salaryDisplay && <span className="flex items-center"><DollarSign className="w-4 h-4 mr-1.5"/>{salaryDisplay}</span>}
        </div>
      </div>
      <div className="flex-shrink-0 w-full sm:w-auto mt-4 sm:mt-0 flex flex-col sm:items-end gap-2">
        <Button asChild className="w-full sm:w-auto">
          <Link href={`/jobs/${slug}`}>
            View Details <ExternalLink className="w-4 h-4 ml-2"/>
          </Link>
        </Button>
        <p className="text-xs text-muted-foreground text-left sm:text-right">
          {/* ✅ THE FIX: Use the utility function to display a clean, human-readable date. */}
          {formatDatePosted(job.postedDate)}
        </p>
      </div>
    </div>
  );
}