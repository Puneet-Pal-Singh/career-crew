// src/app/dashboard/my-jobs/page.tsx
import { getEmployerJobs } from '@/app/actions/employer/jobs/getEmployerJobsAction';
import EmployerJobTable from '@/components/dashboard/employer/EmployerJobTable';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'My Job Postings - CareerCrew',
  description: 'Manage your job postings on CareerCrew Consulting.',
};

// Opt into dynamic rendering as this page fetches data specific to the user
export const dynamic = 'force-dynamic'; 

export default async function MyJobsPage() {
  const result = await getEmployerJobs();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">My Job Postings</h1>
          <p className="text-muted-foreground mt-1">
            Manage, edit, and view the status of your job listings.
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/post-job">Post a New Job</Link>
        </Button>
      </div>

      {result.success === false || !result.jobs ? (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {result.error || "Could not load your job postings."}
          </AlertDescription>
        </Alert>
      ) : (
        <EmployerJobTable jobs={result.jobs} />
      )}
    </div>
  );
}