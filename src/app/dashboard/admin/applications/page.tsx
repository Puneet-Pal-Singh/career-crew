// src/app/dashboard/admin/applications/page.tsx

import { getJobsWithApplicationCounts } from '@/app/actions/admin/applications/getJobsWithApplicationCountsAction';
import JobsWithCountsTable from '@/components/dashboard/admin/applications/all-applications-view/JobsWithCountsTable';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { FileText, AlertTriangle, Info } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'All Applications - Admin Dashboard',
  description: 'View all jobs and their application counts.',
};

export const dynamic = 'force-dynamic';

export default async function AllApplicationsPage() {
  const result = await getJobsWithApplicationCounts();

  if (!result.success) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold flex items-center">
            <FileText className="mr-3 h-8 w-8 text-primary" />
            All Applications
          </h1>
        </div>
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Access Denied or Error</AlertTitle>
          <AlertDescription>
            {result.error || "Could not load application data. You may not have admin privileges or an error occurred."}
          </AlertDescription>
        </Alert>
         <Button variant="outline" asChild className="mt-6">
            <Link href="/dashboard">Back to Dashboard</Link>
          </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold flex items-center">
          <FileText className="mr-3 h-8 w-8 text-primary" />
          All Applications
        </h1>
      </div>
      
      {result.jobs && result.jobs.length > 0 ? (
        <JobsWithCountsTable initialJobs={result.jobs} />
      ) : (
        <div className="text-center py-10 border rounded-lg bg-card">
            <Info className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-2 text-lg font-medium text-foreground">No Applications Found</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              There are currently no jobs with submitted applications.
            </p>
        </div>
      )}
    </div>
  );
}