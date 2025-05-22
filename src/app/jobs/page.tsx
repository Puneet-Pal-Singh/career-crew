// src/app/jobs/page.tsx
import { getPublishedJobs } from '@/app/actions/jobQueryActions';
import type { FetchJobsParams, JobTypeOption } from '@/types';
import { Suspense } from 'react'; // Suspense remains important

import JobSearchAndFilters from '@/components/jobs/JobSearchAndFilters';
import JobList from '@/components/jobs/JobList';
import JobsPagination from '@/components/jobs/JobsPagination';
// import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, SearchSlashIcon, Briefcase as BriefcaseIconLucide } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Browse Jobs - CareerCrew',
  description: 'Find your next career opportunity from thousands of job listings.',
};

// Define the expected RESOLVED searchParams object structure
interface ResolvedSearchParams {
  query?: string;
  location?: string;
  jobType?: string;
  isRemote?: string;
  page?: string;
  limit?: string;
  [key: string]: string | string[] | undefined;
}

// Define the props for this page, where searchParams can be a Promise
interface JobsPageProps {
  // 'params' would also be Promise<{[key: string]: string | string[]}> if you had dynamic route segments like /jobs/[id]
  searchParams: Promise<ResolvedSearchParams>; // searchParams is now a Promise
}

export default async function JobsPage({ searchParams: searchParamsPromise }: JobsPageProps) {
  // Await the resolution of searchParams if it's a Promise
  // If Next.js sometimes passes it as a direct object (for backward compatibility during transition),
  // this await will still work correctly for an already resolved value.
  const resolvedSearchParams = await searchParamsPromise || {}; // Fallback to empty object if promise resolves to null/undefined

  const parsedPage = resolvedSearchParams.page ? parseInt(resolvedSearchParams.page, 10) : 1;
  const parsedLimit = resolvedSearchParams.limit ? parseInt(resolvedSearchParams.limit, 10) : 10;

  const paramsForAction: FetchJobsParams = {
    query: resolvedSearchParams.query,
    location: resolvedSearchParams.location,
    jobType: resolvedSearchParams.jobType ? resolvedSearchParams.jobType as JobTypeOption : undefined,
    isRemote: resolvedSearchParams.isRemote,
    page: isNaN(parsedPage) || parsedPage < 1 ? 1 : parsedPage,
    limit: isNaN(parsedLimit) || parsedLimit < 1 ? 10 : parsedLimit,
  };

  // Key for Suspense based on the resolved and processed params
  const jobDataKey = JSON.stringify(paramsForAction);

  return (
    <div className="container mx-auto py-8 px-4 min-h-screen">
      <header className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Find Your Next Opportunity
        </h1>
        <p className="mt-3 text-lg text-muted-foreground">
          Browse through thousands of job openings from top companies.
        </p>
      </header>

      {/* JobSearchAndFilters expects initialParams as FetchJobsParams (the processed version) */}
      {/* It internally uses useSearchParams() which is the client-side hook */}
      <JobSearchAndFilters initialParams={paramsForAction} />

      <Suspense fallback={<LoadingJobList />}>
        <JobResultsFetcher key={jobDataKey} params={paramsForAction} />
      </Suspense>
    </div>
  );
}

// Server Component to fetch and render job results
async function JobResultsFetcher({ params }: { params: FetchJobsParams }) {
  const result = await getPublishedJobs(params);

  // Error handling can be refined based on how getPublishedJobs signals errors
  // if (result.error) { return <ErrorState message={result.error} />; }

  if (result.jobs.length === 0) {
    const noFiltersApplied = !params.query && !params.location && !params.jobType && params.isRemote === undefined;
    if (noFiltersApplied && result.totalCount === 0) {
        return <EmptyStateNoJobsAtAll />;
    }
    return <EmptyStateNoMatchingJobs />;
  }

  return (
    <>
      <JobList jobs={result.jobs} />
      {result.totalPages > 1 && (
        <JobsPagination
          currentPage={result.currentPage}
          totalPages={result.totalPages}
        />
      )}
    </>
  );
}

// --- Placeholder Loading/Empty State Components ---
function LoadingJobList() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
      <Loader2 className="h-12 w-12 animate-spin mb-4" />
      <p className="text-lg">Loading job listings...</p>
    </div>
  );
}

function EmptyStateNoMatchingJobs() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <SearchSlashIcon className="h-16 w-16 text-muted-foreground mb-6" />
      <h3 className="text-2xl font-semibold text-foreground">No Jobs Found</h3>
      <p className="mt-2 text-muted-foreground max-w-md">
        We couldn&apos;t find any jobs matching your current filters. Try adjusting your search criteria.
      </p>
    </div>
  );
}

function EmptyStateNoJobsAtAll() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <BriefcaseIconLucide className="h-16 w-16 text-muted-foreground mb-6" />
      <h3 className="text-2xl font-semibold text-foreground">No Job Postings Yet</h3>
      <p className="mt-2 text-muted-foreground max-w-md">
        There are currently no job postings available. Please check back later.
      </p>
    </div>
  );
}