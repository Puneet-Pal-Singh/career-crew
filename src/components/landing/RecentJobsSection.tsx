// src/components/landing/RecentJobsSection.tsx
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import JobCard from '@/components/jobs/JobCard';
import type { JobCardData } from '@/types'; // Assuming global type

interface RecentJobsSectionProps {
  jobs: JobCardData[];
}

export default function RecentJobsSection({ jobs }: RecentJobsSectionProps) {
  // TODO: Add "Wow Factor" - e.g., unique background, animated job cards on scroll
  return (
    <section id="recent-jobs" className="py-20 md:py-32 bg-gradient-to-b from-surface-light to-background-light dark:from-surface-dark dark:to-background-dark">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 md:mb-20">
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-content-light dark:text-content-dark">
            Recent Job Openings
          </h2>
          <p className="mt-6 text-lg text-subtle-light dark:text-subtle-dark max-w-xl lg:max-w-2xl mx-auto leading-relaxed">
            Explore the latest opportunities posted on our platform by leading companies.
          </p>
        </div>
        {jobs && jobs.length > 0 ? (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        ) : (
          <p className="text-center text-subtle-light dark:text-subtle-dark py-10">
            No recent jobs found at the moment. Please check back soon!
          </p>
        )}
        {jobs && jobs.length > 0 && (
          <div className="mt-16 text-center">
            <Link
              href="/jobs"
              className="group rounded-lg bg-primary dark:bg-primary-dark px-10 py-4 text-base md:text-lg font-semibold text-white dark:text-gray-900 shadow-xl hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-all duration-150 transform hover:scale-105 inline-flex items-center gap-2"
            >
              View All Jobs <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}