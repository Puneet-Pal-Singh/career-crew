// src/app/dashboard/admin/applications/[jobId]/page.tsx

import { getApplicationsForJob } from '@/app/actions/admin/applications/getApplicationsForJobAction';
import ApplicationsTable from '@/components/dashboard/admin/applications/job-applications-view/ApplicationsTable';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { FileText, AlertTriangle, Info, ArrowLeft } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

// This function is needed for dynamic metadata based on the job title
export async function generateMetadata({ params }: { params: { jobId: string } }): Promise<Metadata> {
  const numericJobId = parseInt(params.jobId, 10);
  if (isNaN(numericJobId)) {
    return { title: 'Invalid Job - Admin Dashboard' };
  }
  const result = await getApplicationsForJob(numericJobId);
  const title = result.success ? `Applications for ${result.jobTitle}` : 'Error';
  return { title: `${title} - Admin Dashboard` };
}

export const dynamic = 'force-dynamic';

export default async function JobApplicationsPage({ params }: { params: { jobId: string } }) {
  const numericJobId = parseInt(params.jobId, 10);

  if (isNaN(numericJobId)) {
    // Handle the case where jobId is not a number
    return <div className="container mx-auto py-8 px-4">Invalid Job ID.</div>;
  }
  
  const result = await getApplicationsForJob(numericJobId);

  if (!result.success) {
    return (
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold mb-6">Application Details</h1>
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error Loading Applications</AlertTitle>
          <AlertDescription>{result.error}</AlertDescription>
        </Alert>
        <Button variant="outline" asChild className="mt-6">
          <Link href="/dashboard/admin/applications"><ArrowLeft className="mr-2 h-4 w-4" /> Back to All Jobs</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <Button variant="outline" asChild className="mb-4">
          <Link href="/dashboard/admin/applications"><ArrowLeft className="mr-2 h-4 w-4" /> Back to All Jobs</Link>
        </Button>
        <h1 className="text-3xl font-bold flex items-center">
          <FileText className="mr-3 h-8 w-8 text-primary" />
          Applications for &quot;{result.jobTitle}&quot;;
        </h1>
      </div>
      
      {result.applications && result.applications.length > 0 ? (
        <ApplicationsTable applications={result.applications} />
      ) : (
        <div className="text-center py-10 border rounded-lg bg-card">
            <Info className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-2 text-lg font-medium text-foreground">No Applications Yet</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              This job posting has not received any applications.
            </p>
        </div>
      )}
    </div>
  );
}