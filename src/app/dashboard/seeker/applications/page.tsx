// src/app/dashboard/seeker/applications/page.tsx
import { getMyApplications } from '@/app/actions/seeker/applications/getMyApplicationsAction'; // Correct path
import MyApplicationsTable from '@/components/dashboard/seeker/MyApplicationsTable'; // To be created
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { FileText, AlertTriangle, Info, PlusCircle } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'My Applications - CareerCrew Dashboard',
  description: 'Track your job applications and their statuses.',
};

// This page should be dynamic as it fetches user-specific data.
export const dynamic = 'force-dynamic'; 

export default async function MyApplicationsPage() {
  // Assuming the user is already authenticated due to middleware protecting /dashboard routes
  const result = await getMyApplications();

  if (!result.success) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold flex items-center">
            <FileText className="mr-3 h-8 w-8 text-primary" />
            My Job Applications
          </h1>
        </div>
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error Loading Applications</AlertTitle>
          <AlertDescription>
            {result.error || "Could not load your applications at this time. Please try again later."}
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
          My Job Applications
        </h1>
        <Button variant="outline" asChild>
            <Link href="/jobs">Browse More Jobs</Link>
        </Button>
      </div>
      {result.applications && result.applications.length > 0 ? (
        <MyApplicationsTable applications={result.applications} />
      ) : (
        <div className="text-center py-10 border rounded-lg bg-card">
            <Info className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-2 text-lg font-medium text-foreground">No Applications Yet</h3>
            <p className="mt-1 text-sm text-muted-foreground">
            You haven&apos;t applied for any jobs yet. Start exploring opportunities!
            </p>
            <Button asChild className="mt-6">
                <Link href="/jobs">
                    <PlusCircle className="mr-2 h-4 w-4"/> Find Jobs
                </Link>
            </Button>
        </div>
      )}
    </div>
  );
}