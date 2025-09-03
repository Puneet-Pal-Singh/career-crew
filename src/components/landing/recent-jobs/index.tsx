// src/components/landing/recent-jobs/index.tsx
import { getRecentJobs } from '@/app/actions/query/getRecentJobsAction';
import JobCard from '@/components/jobs/JobCard';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default async function RecentJobsSection() {
  // This Server Component fetches its own data directly.
  const jobs = await getRecentJobs();

  return (
    <section className="py-16 sm:py-24 bg-white dark:bg-transparent">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Recent Job Opportunities
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
            Discover the latest job openings from top companies across various industries
          </p>
        </div>

        {jobs && jobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map(job => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 border rounded-lg bg-muted/20">
            <p className="text-muted-foreground">No recent jobs found. Please check back soon!</p>
          </div>
        )}

        <div className="mt-16 text-center">
          <Button asChild size="lg">
            <Link href="/jobs">View All Jobs</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}