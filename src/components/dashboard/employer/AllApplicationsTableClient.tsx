// src/components/dashboard/employer/AllApplicationsTableClient.tsx
"use client";

import React, { useState, useEffect, useTransition } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { getAllApplicationsAction, type EmployerApplication } from '@/app/actions/employer/applications/getAllApplicationsAction';
import { type JobOption } from '@/app/actions/employer/jobs/getEmployerJobOptionsAction';
import type { ApplicationStatusOption } from '@/types';

// Import our new, SOLID-compliant components
import ApplicationDetailModal from './ApplicationDetailModal';
import { ApplicationFilters } from './all-applications/ApplicationFilters';
import { ApplicationList } from './all-applications/ApplicationList';
import { ApplicationPagination } from './all-applications/ApplicationPagination';

interface AllApplicationsTableClientProps {
  initialApplications: EmployerApplication[];
  initialTotalCount: number;
  jobOptions: JobOption[];
}

export default function AllApplicationsTableClient({ 
  initialApplications, 
  initialTotalCount,
  jobOptions
}: AllApplicationsTableClientProps) {
  // State management is now the primary responsibility of this component
  const [applications, setApplications] = useState(initialApplications);
  const [totalCount, setTotalCount] = useState(initialTotalCount);
  const [selectedApplicationId, setSelectedApplicationId] = useState<string | null>(null);
  const [isDataLoading, startDataTransition] = useTransition();

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [jobFilter, setJobFilter] = useState(searchParams.get('jobId') || 'all');
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || 'all');

  const currentPage = Number(searchParams.get('page')) || 1;
  const pageSize = 10;
  const totalPages = Math.ceil(totalCount / pageSize);

  // The useEffect for client-side data fetching remains
  useEffect(() => {
    const page = Number(searchParams.get('page')) || 1;
    const jobId = Number(searchParams.get('jobId')) || null;
    const status = searchParams.get('status') as ApplicationStatusOption | null;
      
    startDataTransition(async () => {
      const result = await getAllApplicationsAction({ page, jobId, status });
      if (result.success) {
        setApplications(result.data.applications);
        setTotalCount(result.data.totalCount);
      } else {
        console.error(result.error);
        setApplications([]);
        setTotalCount(0);
      }
    });
  }, [searchParams]);
  
  // All event handlers live here
  const handleApplyFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    if (jobFilter !== 'all') params.set('jobId', jobFilter);
    else params.delete('jobId');

    if (statusFilter !== 'all') params.set('status', statusFilter);
    else params.delete('status');

    params.set('page', '1');
    router.push(`${pathname}?${params.toString()}`);
  };

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(newPage));
    router.push(`${pathname}?${params.toString()}`);
  }

  const handleStatusChangeInModal = (applicationId: string, newStatus: ApplicationStatusOption) => {
    setApplications(currentApps => 
      currentApps.map(app => 
        app.id === applicationId ? { ...app, status: newStatus } : app
      )
    );
  };
  
  return (
    <div className="space-y-6">
      {/* Render the dumb filter component */}
      <ApplicationFilters
        jobOptions={jobOptions}
        jobFilter={jobFilter}
        statusFilter={statusFilter}
        onJobFilterChange={setJobFilter}
        onStatusFilterChange={setStatusFilter}
        onApplyFilters={handleApplyFilters}
        isPending={isDataLoading}
      />
      
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl">Candidates</CardTitle>
          <CardDescription>Showing {applications.length} of {totalCount} total applications.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className={`transition-opacity duration-200 ${isDataLoading ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
            {/* Render the dumb list component */}
            <ApplicationList
              applications={applications}
              onViewDetails={setSelectedApplicationId}
            />
          </div>
          {/* Render the dumb pagination component */}
          <ApplicationPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            isPending={isDataLoading}
          />
        </CardContent>
      </Card>

      {/* Render the modal */}
      <ApplicationDetailModal
        applicationId={selectedApplicationId}
        isOpen={!!selectedApplicationId}
        onClose={() => setSelectedApplicationId(null)}
        onStatusChange={handleStatusChangeInModal}
      />
    </div>
  );
}