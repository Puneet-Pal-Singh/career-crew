// src/components/jobs/JobCard.tsx
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Briefcase, DollarSign, ArrowRight } from 'lucide-react';
import type { JobCardData } from '@/types';
import { Badge } from '@/components/ui/Badge';

interface JobCardProps {
  job: JobCardData;
}

export default function JobCard({ job }: JobCardProps) {
  return (
    <Link href={`/jobs/${job.id}`} className="block group h-full">
      <div className="flex flex-col h-full bg-surface-light dark:bg-surface-dark p-6 rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 border border-transparent group-hover:border-primary/30 dark:group-hover:border-primary/50">
        <div className="flex items-start gap-4 mb-4">
          {job.companyLogoUrl ? (
            <Image
              src={job.companyLogoUrl}
              alt={`${job.companyName} logo`}
              width={48}
              height={48}
              className="rounded-md object-contain flex-shrink-0"
            />
          ) : (
            <div className="w-12 h-12 bg-primary/10 dark:bg-primary/20 rounded-md flex items-center justify-center text-primary flex-shrink-0">
              <Briefcase size={24} />
            </div>
          )}
          <div className="flex-1">
            <h3 className="text-lg font-semibold font-display text-content-light dark:text-content-dark group-hover:text-primary transition-colors">
              {job.title}
            </h3>
            <p className="text-sm text-subtle-light dark:text-subtle-dark mt-1">{job.companyName}</p>
          </div>
        </div>

        <div className="space-y-2 text-sm text-subtle-light dark:text-subtle-dark mb-4">
          <div className="flex items-center gap-2">
            <MapPin size={16} className="text-primary flex-shrink-0" />
            <span>{job.location}</span>
          </div>
          {job.isRemote && (
             <Badge variant="secondary" className="ml-auto text-xs">
              {job.location.toLowerCase() === 'remote' ? 'Fully Remote' : 'Remote Option'}
            </Badge>
          )}
          {job.salary && (
            <div className="flex items-center gap-2">
              <DollarSign size={16} className="text-primary flex-shrink-0" />
              <span>{job.salary}</span>
            </div>
          )}
          {job.type && (
            <div className="flex items-center gap-2">
               <Briefcase size={16} className="text-primary flex-shrink-0" />
               <span>{job.type}</span>
            </div>
          )}
        </div>
        
        <div className="mt-auto pt-4 border-t border-surface-light/50 dark:border-surface-dark/20 flex justify-between items-center">
          <p className="text-xs text-subtle-light dark:text-subtle-dark">{job.postedDate}</p>
          <div className="text-xs font-medium text-primary group-hover:underline flex items-center gap-1">
            View Details <ArrowRight size={14} />
          </div>
        </div>
      </div>
    </Link>
  );
}