// src/components/jobs/job-detail/JobDetailHeaderCard.tsx
"use client";

import type { JobDetailData } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, ExternalLink } from 'lucide-react';
import JobLogo from '@/components/shared/JobLogo';

interface JobDetailHeaderCardProps {
  job: JobDetailData;
  onApplyNow: () => void;
}

export default function JobDetailHeaderCard({ job, onApplyNow }: JobDetailHeaderCardProps) {
  return (
    <div className="bg-card p-8 rounded-xl border shadow-sm">
      <div className="flex flex-col lg:flex-row lg:items-center gap-6">
        {/* Company Logo and Basic Info */}
        <div className="flex items-center gap-4">
          <JobLogo
            src={job.companyLogoUrl}
            alt={`${job.companyName} Logo`}
            title={job.title}
            width={80}
            height={80}
            className="rounded-xl border bg-white flex-shrink-0"
          />
          <div>
            <p className="text-sm font-medium text-muted-foreground">{job.companyName}</p>
            <div className="flex items-center gap-2 mt-1">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{job.location}</span>
              {job.jobType && (
                <>
                  <span className="text-muted-foreground">•</span>
                  <Badge variant="secondary" className="text-xs">
                    {job.jobType}
                  </Badge>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Job Title and Apply Button */}
        <div className="flex-1 lg:text-center">
          <h1 className="text-3xl lg:text-4xl font-bold tracking-tight mb-4">{job.title}</h1>
          <Button size="lg" onClick={onApplyNow} className="w-full lg:w-auto">
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

      {/* Skills / Tags Section */}
      {job.tags && job.tags.length > 0 && (
        <div className="mt-6 pt-6 border-t flex flex-wrap gap-2">
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
