// src/components/jobs/JobListItem.tsx
"use client";

import type { JobCardData } from '@/types';
import Link from 'next/link';
import Image from 'next/image';
// ✅ THE FIX: Import the Badge component from your UI library.
import { Badge } from '@/components/ui/badge';
import { MapPin, Briefcase } from 'lucide-react';
import { generateJobSlug } from '@/lib/utils';

interface JobListItemProps {
  job: JobCardData;
}

export default function JobListItem({ job }: JobListItemProps) {
  const slug = generateJobSlug(job.id, job.title);

  return (
    // The entire component is a single, clickable link for a cleaner user experience.
    <Link 
      href={`/jobs/${slug}`}
      className="block group bg-card p-4 rounded-lg border hover:bg-muted/40 hover:border-primary/30 transition-all duration-200"
    >
      <div className="flex flex-col sm:flex-row items-start gap-4">
        
        {/* Company Logo */}
        <div className="flex-shrink-0">
          <Image 
            src={job.companyLogoUrl || '/company-logos/default-company-logo.svg'} 
            alt={`${job.companyName} logo`}
            width={40}
            height={40}
            className="rounded-md object-contain border bg-white"
          />
        </div>

        {/* Main Content Area */}
        <div className="flex-grow">
          
          {/* Top Row: Title and Company */}
          <div>
            <h3 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors">
              {job.title}
            </h3>
            <p className="text-sm text-muted-foreground">{job.companyName}</p>
          </div>

          {/* Middle Row: Location and Job Type */}
          <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center">
              <MapPin className="w-4 h-4 mr-1.5"/>
              {job.location}
            </span>
            {job.jobType && (
              <span className="flex items-center">
                <Briefcase className="w-4 h-4 mr-1.5"/>
                {job.jobType}
              </span>
            )}
          </div>
          
          {/* Bottom Row: Skill Tags - This will now work correctly */}
          {job.tags && job.tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {job.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="font-normal">{tag}</Badge>
              ))}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}