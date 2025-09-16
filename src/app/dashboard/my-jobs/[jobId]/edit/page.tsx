// src/app/dashboard/my-jobs/[jobId]/edit/page.tsx
import JobEditorForm from '@/components/dashboard/employer/JobEditorForm';
import { getEmployerJobByIdForEdit } from '@/app/actions/employer/jobs/getEmployerJobByIdForEditAction';
import type { Metadata } from 'next';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, Edit3, Info } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import JobPostSidebar from '@/components/dashboard/employer/JobPostSidebar'; // Import the sidebar

interface EditJobPageProps {
  params: Promise<{ jobId: string }>;
}

export async function generateMetadata({ params: paramsPromise }: EditJobPageProps): Promise<Metadata> {
  const params = await paramsPromise;
  const result = await getEmployerJobByIdForEdit(params.jobId);
  if (result.success && result.job) {
    return {
      title: `Edit: ${result.job.title} - CareerCrew`, // Simplified title
    };
  }
  return {
    title: 'Edit Job - CareerCrew',
  };
}

export default async function EditJobPage({ params: paramsPromise }: EditJobPageProps) {
  const params = await paramsPromise;
  const { jobId } = params;
  
  const result = await getEmployerJobByIdForEdit(jobId);

  // --- Error State (No layout changes needed here) ---
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
                <Link href="/dashboard/my-jobs">Back to My Job Listings</Link>
            </Button>
        </div>
    );
  }

  // --- Main Page Content with New Layout ---
  return (
    <div className="grid grid-cols-1 lg:grid-cols-10 lg:gap-12 py-2">
      
      {/* Main Content Area */}
      <div className="lg:col-span-7">

        {/* --- NEW: EDIT MODE BANNER --- */}
        <Alert variant="default" className="mb-8 bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800">
            <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <AlertTitle className="text-blue-800 dark:text-blue-300">You are in Edit Mode</AlertTitle>
            <AlertDescription className="text-blue-700 dark:text-blue-400">
              Any changes you save will directly update the live job posting.
            </AlertDescription>
        </Alert>
        
        {/* Page Title */}
        <div className="mb-4">
          <h1 className="text-3xl font-bold tracking-tight flex items-center">
            <Edit3 className="mr-3 h-8 w-8 text-primary" />
            Edit Job Posting
          </h1>
        </div>

        {/* The Form */}
        <JobEditorForm 
          mode="edit" 
          jobId={jobId} 
          initialData={result.job} 
        />
      </div>

      {/* Sidebar Area */}
      <div className="lg:col-span-3">
        <div className="hidden lg:block">
          <JobPostSidebar />
        </div>
      </div>
    </div>
  );
}