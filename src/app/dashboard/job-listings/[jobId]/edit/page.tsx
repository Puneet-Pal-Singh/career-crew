// src/app/dashboard/job-listings/[jobId]/edit/page.tsx
import JobEditorForm from '@/components/dashboard/employer/JobEditorForm';
import { getEmployerJobByIdForEdit } from '@/app/actions/employer/getEmployerJobByIdForEditAction';
import type { Metadata } from 'next';
// import { notFound } from 'next/navigation'; // Keep for actual not found scenarios
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, Edit3 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

// Define the props type according to Next.js 15: params is a Promise
interface EditJobPageProps {
  params: Promise<{ jobId: string }>; 
  // searchParams?: Promise<{ [key: string]: string | string[] | undefined }>; // If you were to use searchParams
}

export async function generateMetadata({ params: paramsPromise }: EditJobPageProps): Promise<Metadata> {
  const params = await paramsPromise; // Await the params promise
  const result = await getEmployerJobByIdForEdit(params.jobId);
  if (result.success && result.job) {
    return {
      title: `Edit: ${result.job.title} - CareerCrew Dashboard`,
    };
  }
  return {
    title: 'Edit Job - CareerCrew Dashboard',
  };
}

export default async function EditJobPage({ params: paramsPromise }: EditJobPageProps) {
  const params = await paramsPromise; // Await the params promise
  const { jobId } = params;
  
  const result = await getEmployerJobByIdForEdit(jobId);

  if (!result.success || !result.job) {
    return (
        <div className="container mx-auto py-8 px-4">
             <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Error Loading Job</AlertTitle>
                <AlertDescription>
                    {result.error || "The job could not be found or you don't have permission to edit it."}
                </AlertDescription>
            </Alert>
            <Button variant="outline" asChild className="mt-6">
                <Link href="/dashboard/job-listings">Back to My Job Listings</Link>
            </Button>
        </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text6-3xl font-bold flex items-center">
          <Edit3 className="mr-3 h-8 w-8 text-primary" />
          Edit Job: <span className="ml-2 font-normal">{result.job.title}</span>
        </h1>
      </div>
      <JobEditorForm 
        mode="edit" 
        jobId={jobId} 
        initialData={result.job} 
      />
    </div>
  );
}