// src/app/dashboard/applications/page.tsx
import React from 'react';
import { getAllApplicationsAction } from '@/app/actions/employer/applications/getAllApplicationsAction';
import { getEmployerJobOptionsAction } from '@/app/actions/employer/jobs/getEmployerJobOptionsAction';
import AllApplicationsTable from '@/components/dashboard/employer/AllApplicationsTable';
import type { ApplicationStatusOption } from '@/types';
import { Users } from 'lucide-react';

// --- FIX START: Update the interface for Next.js 15 ---
interface AllApplicationsPageProps {
  searchParams: Promise<{
    page?: string;
    jobId?: string;
    status?: string;
  }>;
}
// --- FIX END ---

export default async function AllApplicationsPage({ searchParams: searchParamsPromise }: AllApplicationsPageProps) {
  // --- FIX START: Await the promise to get the search params object ---
  const searchParams = await searchParamsPromise;
  // --- FIX END ---
  
  const page = Number(searchParams.page) || 1;
  const jobId = Number(searchParams.jobId) || null;
  const status = searchParams.status as ApplicationStatusOption || null;

  // Fetch all necessary data in parallel
  const [initialData, jobOptions] = await Promise.all([
    getAllApplicationsAction({ page, jobId, status }),
    getEmployerJobOptionsAction(),
  ]);

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