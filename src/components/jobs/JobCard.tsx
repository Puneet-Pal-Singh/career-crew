// src/components/jobs/JobCard.tsx
"use client";

import type { JobCardData } from '@/types';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/Badge';
import { MapPin, DollarSign } from 'lucide-react';
import { generateJobSlug } from '@/lib/utils';

// Helper to format date into "X days ago"
const formatDatePosted = (dateStr: string): string => {
  const date = new Date(dateStr);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  if (diffDays <= 1) return '1 day ago';
  return `${diffDays} days ago`;
};

// Helper to format salary into the "$120k - $160k" format
const formatSalary = (min?: number | null, max?: number | null): string | null => {
  if (!min || !max) return null;
  const minK = Math.round(min / 1000);
  const maxK = Math.round(max / 1000);
  return `$${minK}k - $${maxK}k`;
};

interface JobCardProps {
  job: JobCardData;
}

export default function JobCard({ job }: JobCardProps) {
  const slug = generateJobSlug(job.id, job.title);
  const salaryDisplay = formatSalary(job.salaryMin, job.salaryMax);

  return (
    <Link href={`/jobs/${slug}`} className="block group">
      <Card className="hover:shadow-lg hover:border-primary/30 transition-all duration-300 h-full flex flex-col p-4 bg-white dark:bg-card">
        <CardHeader className="p-0">
          <div className="flex justify-between items-start gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-lg border bg-white">
                <Image 
                  src={job.companyLogoUrl || '/company-logos/default-company-logo.svg'}
                  alt={`${job.companyName} logo`}
                  width={32}
                  height={32}
                  className="rounded-md object-contain"
                />
              </div>
              <div>
                <CardTitle className="text-base font-semibold leading-tight group-hover:text-primary transition-colors">
                  {job.title}
                </CardTitle>
                <CardDescription className="text-sm pt-1">{job.companyName}</CardDescription>
              </div>
            </div>
            <p className="text-xs text-muted-foreground flex-shrink-0 pt-1">{formatDatePosted(job.postedDate)}</p>
          </div>
        </CardHeader>

        <CardContent className="p-0 pt-4 flex-grow space-y-2.5">
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
            <span>{job.location}</span>
            {job.jobType && <Badge variant="outline" className="ml-2 font-normal">{job.jobType}</Badge>}
          </div>
          {salaryDisplay && (
            <div className="flex items-center text-sm text-muted-foreground">
              <DollarSign className="w-4 h-4 mr-2 flex-shrink-0" />
              <span>{salaryDisplay}</span>
            </div>
          )}
        </CardContent>

        <CardFooter className="p-0 pt-4">
          <div className="flex flex-wrap gap-2">
            {job.tags.slice(0, 3).map(tag => (
              <Badge key={tag} variant="secondary" className="font-normal">{tag}</Badge>
            ))}
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}