// src/app/dashboard/post-job/page.tsx
import JobEditorForm from '@/components/dashboard/employer/JobEditorForm'; // Import the renamed/refactored component
import type { Metadata } from 'next';
// import { Briefcase } from 'lucide-react'; // Optional: if you want an icon in the page title area

export const metadata: Metadata = {
  title: 'Post a New Job - CareerCrew',
  description: 'Create and publish a new job listing on CareerCrew Consulting.',
};

// This page should be protected by middleware for authenticated users (employers)
export default function CreateJobPage() { // Renamed component function for clarity
  return (
    <div className="container mx-auto py-8 px-4">
      {/* 
        Optionally, add a page title or breadcrumbs here if your dashboard layout doesn't provide it.
        Example:
        <div className="mb-8">
          <h1 className="text-3xl font-bold flex items-center">
            <Briefcase className="mr-3 h-8 w-8 text-primary" />
            Create New Job Posting
          </h1>
        </div>
      */}
      <JobEditorForm mode="create" /> {/* Pass mode="create", no jobId or initialData needed */}
    </div>
  );
}