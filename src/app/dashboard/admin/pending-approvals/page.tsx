// src/app/dashboard/admin/pending-approvals/page.tsx
import { getPendingApprovalJobs } from '@/app/actions/admin/pending-approvals/getPendingApprovalJobsAction';
import PendingJobsTable from '@/components/dashboard/admin/pending-approvals/PendingJobsTable';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Briefcase, AlertTriangle, Info } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Pending Job Approvals - Admin Dashboard',
  description: 'Review and manage job postings awaiting approval.',
};

// Opt into dynamic rendering as this page fetches data specific to admin actions
// and should reflect the latest state.
export const dynamic = 'force-dynamic'; 

export default async function PendingApprovalsPage() {
  const result = await getPendingApprovalJobs();

  if (!result.success) {
    // This could be due to not being an admin, or a database error
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold flex items-center">
            <Briefcase className="mr-3 h-8 w-8 text-primary" />
            Pending Job Approvals
          </h1>
        </div>
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Access Denied or Error</AlertTitle>
          <AlertDescription>
            {result.error || "Could not load pending jobs. You may not have admin privileges or an error occurred."}
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
          Pending Job Approvals
        </h1>
        {/* Maybe a refresh button or other admin controls here later */}
      </div>
      {result.jobs && result.jobs.length > 0 ? (
        <PendingJobsTable initialJobs={result.jobs} />
      ) : (
        <div className="text-center py-10 border rounded-lg bg-card">
            <Info className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-2 text-lg font-medium text-foreground">No Pending Approvals</h3>
            <p className="mt-1 text-sm text-muted-foreground">
            There are currently no job postings awaiting review.
            </p>
        </div>
      )}
    </div>
  );
}