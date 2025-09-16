import JobEditorForm from '@/components/dashboard/employer/JobEditorForm';
import JobPostSidebar from '@/components/dashboard/employer/JobPostSidebar'; // Import the new sidebar
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Post a New Job - CareerCrew',
  description: 'Create and publish a new job listing on CareerCrew.',
};

export default function CreateJobPage() {
  return (
    // We use a grid that is 1 column on mobile and splits into a 10-unit grid on large screens.
    // The main content takes 7 units and the sidebar takes 3, with a gap between them.
    // <div className="grid grid-cols-1 lg:grid-cols-10 lg:gap-12 py-8">
     <div className="grid grid-cols-1 lg:grid-cols-10 lg:gap-12 py-2">
      
      {/* Main Content Area (7/10 width on large screens) */}
      <div className="lg:col-span-7">
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Create New Job Posting</h1>
          <p className="text-muted-foreground mt-1">
            Attract top talent by posting your job on the job board.
          </p>
        </div>
        <JobEditorForm mode="create" />
      </div>

      {/* Sidebar Area (3/10 width on large screens) */}
      <div className="lg:col-span-3">
        {/* The sidebar will be hidden on mobile and appear on larger screens */}
        <div className="hidden lg:block">
          <JobPostSidebar />
        </div>
      </div>
    </div>
  );
}