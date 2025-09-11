// src/app/dashboard/applications/page.tsx
import React from 'react';
import { getAllApplicationsAction } from '@/app/actions/employer/applications/getAllApplicationsAction';
import { getEmployerJobOptionsAction } from '@/app/actions/employer/jobs/getEmployerJobOptionsAction';
import AllApplicationsTable from '@/components/dashboard/employer/AllApplicationsTable';
import type { ApplicationStatusOption } from '@/types';
import { Users } from 'lucide-react';

interface AllApplicationsPageProps {
  searchParams: Promise<{
    page?: string;
    jobId?: string;
    status?: string;
  }>;
}


export default async function AllApplicationsPage({ searchParams: searchParamsPromise }: AllApplicationsPageProps) {
  // Await the promise to get the search params object ---
  const searchParams = await searchParamsPromise;

  // Coderabbit Suggestion: More robust parsing
  const pageNum = Number(searchParams.page);
  const page = Number.isFinite(pageNum) && pageNum > 0 ? pageNum : 1;

  const jobIdNum = Number(searchParams.jobId);
  const jobId = Number.isFinite(jobIdNum) ? jobIdNum : null;

  const rawStatus = searchParams.status;
  const status = rawStatus && rawStatus !== 'all' ? rawStatus.toUpperCase() as ApplicationStatusOption : null;

  // Fetch all necessary data in parallel
  const [initialDataResult, jobOptionsResult] = await Promise.all([
    getAllApplicationsAction({ page, jobId, status }),
    getEmployerJobOptionsAction(),
  ]);

  // Handle potential errors from the actions
  const initialData = initialDataResult.success ? initialDataResult.data : { applications: [], totalCount: 0 };
  const jobOptions = jobOptionsResult.success ? jobOptionsResult.options : [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">All Applications</h1>
          <p className="text-muted-foreground mt-1">
            Review, filter, and manage all candidates who have applied to your jobs.
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Users className="h-4 w-4" />
          <span className="font-medium">{initialData.totalCount} total applications</span>
        </div>
      </div>

      <AllApplicationsTable 
        initialApplications={initialData.applications}
        initialTotalCount={initialData.totalCount}
        jobOptions={jobOptions}
      />
    </div>
  );
}