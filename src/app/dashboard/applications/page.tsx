// src/app/dashboard/applications/page.tsx
import React from 'react';
import { getAllApplicationsAction } from '@/app/actions/employer/applications/getAllApplicationsAction';
import AllApplicationsTable from '@/components/dashboard/employer/AllApplicationsTable';

export default async function AllApplicationsPage() {
  const { applications, totalCount } = await getAllApplicationsAction();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">All Applications</h1>
        <p className="text-muted-foreground mt-1">
          Review and manage all candidates who have applied to your jobs.
        </p>
      </div>
      <AllApplicationsTable 
        initialApplications={applications}
        initialTotalCount={totalCount}
      />
    </div>
  );
}