// src/components/jobs/JobCard.tsx
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Briefcase, DollarSign, ExternalLink } from 'lucide-react';
import type { JobCardData } from '@/types'; // Ensure this path is correct
import { Badge } from '@/components/ui/Badge'; // Import your Badge component

interface JobCardProps {
  job: JobCardData;
}

export default function JobCard({ job }: JobCardProps) {
  const companyLogo = job.companyLogoUrl || '/company-logos/default-company-logo.svg'; 
  // Ensure '/public/company-logos/default-company-logo.svg' exists or adjust placeholder

  return (
    <Link 
      href={`/jobs/${job.id}`} 
      className="block group bg-surface-light dark:bg-surface-dark p-5 sm:p-6 rounded-xl shadow-lg hover:shadow-xl border border-border-light dark:border-border-dark hover:border-primary/40 dark:hover:border-primary-dark/40 transition-all duration-300 ease-in-out transform hover:-translate-y-1.5 flex flex-col h-full"
    >
      <div className="flex items-start space-x-4 mb-4">
        <div className="flex-shrink-0 mt-1">
          <Image 
            src={companyLogo} 
            alt={`${job.companyName} logo`} 
            width={44}
            height={44} 
            className="rounded-md object-contain border border-border-light dark:border-border-dark"
          />
        </div>
        <div className="flex-grow">
          <h3 className="text-md md:text-lg font-semibold text-content-light dark:text-content-dark group-hover:text-primary dark:group-hover:text-primary-dark transition-colors leading-tight">
            {job.title}
          </h3>
          <p className="text-sm text-subtle-light dark:text-subtle-dark mt-0.5">{job.companyName}</p>
        </div>
      </div>

      <div className="space-y-2 text-sm mb-4 flex-grow">
        <div className="flex items-center text-subtle-light dark:text-subtle-dark">
          <MapPin size={15} className="mr-2 flex-shrink-0 opacity-70" />
          <span>{job.location}{job.isRemote && job.location.toLowerCase() !== 'remote' ? ' (Remote Available)' : job.isRemote ? '' : ''}</span>
        </div>
        {job.salary && ( // Use your 'salary' field
          <div className="flex items-center text-subtle-light dark:text-subtle-dark">
            <DollarSign size={15} className="mr-2 flex-shrink-0 opacity-70" />
            <span>{job.salary}</span>
          </div>
        )}
        {job.type && ( // Conditionally render job type
            <div className="flex items-center text-subtle-light dark:text-subtle-dark">
            <Briefcase size={15} className="mr-2 flex-shrink-0 opacity-70" />
            <span>{job.type}</span>
            </div>
        )}
      </div>

      {job.tags && job.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {job.tags.map((tag: string) => ( // Explicitly type 'tag' as string
            // Use your Badge component. Choose a variant, e.g., 'outline' or 'default'
            // Your 'default' badge variant: "bg-surface-dark/50 dark:bg-surface-light/10 text-subtle-dark dark:text-subtle-light"
            // 'outline' might be better for tags if it's just text with a border.
            // Let's use a more distinct variant for tags if available, or a subtle default.
            // Your 'primary' variant: "bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary" looks good for tags.
            <Badge key={tag} variant="outline">{tag}</Badge>
          ))}
        </div>
      )}
      
      <div className="flex justify-between items-center text-xs text-subtle-light dark:text-subtle-dark mt-auto pt-3 border-t border-border-light/60 dark:border-border-dark/60">
        <span>{job.postedDate}</span> {/* Your postedDate is already a string like "Posted 2 days ago" */}
        <div className="flex items-center text-primary dark:text-primary-dark font-medium group-hover:underline">
          View Details
          <ExternalLink size={14} className="ml-1.5 opacity-80 group-hover:opacity-100" />
        </div>
      </div>
    </Link>
  );
}