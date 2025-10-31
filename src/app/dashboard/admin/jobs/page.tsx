// src/app/dashboard/admin/jobs/page.tsx

import { getAllJobs } from '@/app/actions/admin/jobs/getAllJobsAction';
import AllJobsTable from '@/components/dashboard/admin/jobs/AllJobsTable';// We will create this next
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Briefcase, AlertTriangle, Info } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Manage All Jobs - Admin Dashboard',
  description: 'View, edit, and manage all job postings on the platform.',
};

export const dynamic = 'force-dynamic';

export default async function ManageAllJobsPage() {
  const result = await getAllJobs();

  if (!result.success) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold flex items-center">
            <Briefcase className="mr-3 h-8 w-8 text-primary" />
            Manage All Jobs
          </h1>
        </div>
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Access Denied or Error</AlertTitle>
          <AlertDescription>
            {result.error || "Could not load jobs. You may not have admin privileges or an error occurred."}
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
          <Briefcase className="mr-3 h-8 w-8 text-primary" />
          Manage All Jobs
        </h1>
      </div>
      
      {/* REPLACE THE PLACEHOLDER WITH THE NEW COMPONENT */}
      {result.jobs && result.jobs.length > 0 ? (
        <AllJobsTable initialJobs={result.jobs} />
      ) : (
        <div className="text-center py-10 border rounded-lg bg-card">
            <Info className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-2 text-lg font-medium text-foreground">No Jobs Found</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              There are currently no jobs in the database.
            </p>
        </div>
      )}
    </div>
  );
}