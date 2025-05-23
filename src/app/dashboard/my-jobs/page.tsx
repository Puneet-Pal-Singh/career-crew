// src/app/dashboard/my-jobs/page.tsx
import { getEmployerJobs } from '@/app/actions/employer/getEmployerJobsAction';
import EmployerJobTable from '@/components/dashboard/employer/EmployerJobTable';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, Briefcase } from 'lucide-react';
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

  if (!result.success || !result.jobs) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold flex items-center">
            <Briefcase className="mr-3 h-8 w-8 text-primary" />
            My Job Postings
          </h1>
          <Button asChild>
            <Link href="/dashboard/post-job">Post New Job</Link>
          </Button>
        </div>
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {result.error || "Could not load your job postings. Please try again later."}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold flex items-center">
          <Briefcase className="mr-3 h-8 w-8 text-primary" />
          My Job Postings
        </h1>
        <Button asChild>
          <Link href="/dashboard/post-job">Post New Job</Link>
        </Button>
      </div>
      <EmployerJobTable jobs={result.jobs} />
    </div>
  );
}