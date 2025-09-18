// src/app/jobs/page.tsx
import { getPublishedJobs } from '@/app/actions/query/getPublishedJobsAction';
import { getUniqueJobLocationsAction } from '@/app/actions/query/getUniqueJobLocationsAction';
import type { FetchJobsParams, PaginatedJobsResult, JobTypeOption } from '@/types';
import { Suspense } from 'react';
import type { Metadata } from 'next';

// New Component Imports for the refined UI
import JobFilterSidebar from '@/components/jobs/JobFilterSidebar';
import JobSearchHero from '@/components/jobs/JobSearchHero';
import JobListItem from '@/components/jobs/JobListItem'; // The new row-based card
import JobsPagination from '@/components/jobs/JobsPagination';

// UI and Icon Imports
import { Loader2, SearchSlashIcon, Briefcase as BriefcaseIconLucide } from 'lucide-react';
// 1. IMPORT the new mobile sheet component
import MobileFilterSheet from '@/components/jobs/MobileFilterSheet';

export const metadata: Metadata = {
  title: 'Browse Jobs - CareerCrew',
  description: 'Find your next career opportunity from thousands of job listings.',
};

//  standard way to type an object with arbitrary string keys in TypeScript.
interface ResolvedSearchParams {
  [key: string]: string | string[] | undefined;
}

// Define the props for this page, where searchParams is a Promise (Next.js 15)
interface JobsPageProps {
  searchParams: Promise<ResolvedSearchParams>;
}

export default async function JobsPage({ searchParams: searchParamsPromise }: JobsPageProps) {
  const resolvedSearchParams = await searchParamsPromise || {};

  // FETCH the unique locations on the server
  const uniqueLocations = await getUniqueJobLocationsAction();

  // Parse searchParams, handling potential arrays from multi-select filters
  const paramsForAction: FetchJobsParams = {
    query: typeof resolvedSearchParams.query === 'string' ? resolvedSearchParams.query : undefined,
    location: resolvedSearchParams.location, // Pass as string or string[]
    jobType: resolvedSearchParams.jobType as JobTypeOption | JobTypeOption[] | undefined, // Pass as string or string[]
    isRemote: typeof resolvedSearchParams.isRemote === 'string' ? resolvedSearchParams.isRemote : undefined,
    page: resolvedSearchParams.page ? parseInt(String(resolvedSearchParams.page), 10) : 1,
    limit: 10,
  };
  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen">
      <main className="container mx-auto py-8 px-4">
        {/* The new prominent search hero component */}
        <JobSearchHero /> 
        
        <div className="mt-10 grid grid-cols-1 lg:grid-cols-4 gap-x-8 gap-y-6">
          <div className="lg:col-span-1">
            <div className="hidden lg:block">
              {/* 3. PASS the locations as a prop */}
              <JobFilterSidebar locations={uniqueLocations} />
            </div>
            <div className="block lg:hidden">
              {/* 3. PASS the locations as a prop */}
              <MobileFilterSheet locations={uniqueLocations} />
            </div>
          </div>

          {/* Column 2: Job Listings & Pagination */}
          <div className="lg:col-span-3">
            <Suspense key={JSON.stringify(paramsForAction)} fallback={<LoadingJobList />}>
              <JobResultsFetcher params={paramsForAction} />
            </Suspense>
          </div>
        </div>
      </main>
    </div>
  );
}

// --- Helper Components for Data Fetching & State Display ---

// This Server Component fetches and renders the results based on params
async function JobResultsFetcher({ params }: { params: FetchJobsParams }) {
  const result: PaginatedJobsResult = await getPublishedJobs(params);

  // If there are no jobs at all on the entire platform
  const noFiltersApplied = !params.query && !params.location && !params.jobType && params.isRemote === undefined;
  if (result.totalCount === 0 && noFiltersApplied) {
    return <EmptyStateNoJobsAtAll />;
  }

  // If there are jobs on the platform, but none match the current filters
  if (result.jobs.length === 0) {
    return <EmptyStateNoMatchingJobs />;
  }

  // If jobs are found, render the list and pagination
  return (
    <div className="space-y-4">
      <div className="text-sm text-muted-foreground border-b pb-4">
        Showing <strong>{result.jobs.length}</strong> of <strong>{result.totalCount}</strong> results
      </div>
      {/* List of JobListItem components */}
      {result.jobs.map(job => (
        <JobListItem key={job.id} job={job} />
      ))}
      {/* Pagination */}
      {result.totalPages > 1 && (
        <div className="pt-6">
          <JobsPagination
            currentPage={result.currentPage}
            totalPages={result.totalPages}
          />
        </div>
      )}
    </div>
  );
}

// Loading state component
function LoadingJobList() {
  // You could enhance this with skeleton loaders that mimic the JobListItem structure
  return (
    <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
      <Loader2 className="h-8 w-8 animate-spin mb-4" />
      <p className="text-lg">Searching for jobs...</p>
    </div>
  );
}

// Empty state for when no jobs match the current filters
function EmptyStateNoMatchingJobs() {
  return (
    <div className="border rounded-lg p-12 text-center bg-card">
      <SearchSlashIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
      <h3 className="text-xl font-semibold text-foreground">No Jobs Match Your Filters</h3>
      <p className="mt-2 text-muted-foreground">
        Try removing or changing some filters to see more results.
      </p>
    </div>
  );
}

// Empty state for when there are no jobs on the platform at all
function EmptyStateNoJobsAtAll() {
  return (
    <div className="border rounded-lg p-12 text-center bg-card">
      <BriefcaseIconLucide className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
      <h3 className="text-xl font-semibold text-foreground">No Job Postings Yet</h3>
      <p className="mt-2 text-muted-foreground">
        There are currently no job postings available. Please check back later!
      </p>
    </div>
  );
}