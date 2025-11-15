// src/app/dashboard/seeker/applications/page.tsx
import { getMyApplications } from '@/app/actions/seeker/applications/getMyApplicationsAction'; // Correct path
import MyApplicationsClient from '@/components/dashboard/seeker/my-applications/MyApplicationsClient';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { FileText } from 'lucide-react';

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
           <h1 className="text-2xl sm:text-3xl font-bold">
             Applications
           </h1>
         </div>
         <Alert variant="destructive">
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
          <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold">
           Applications
          </h1>
          <Button variant="outline" asChild className="hidden sm:flex">
              <Link href="/jobs">Browse More Jobs</Link>
          </Button>
        </div>
      {result.applications && result.applications.length > 0 ? (
        <MyApplicationsClient initialApplications={result.applications} /> 
      ) : (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-muted/30 dark:bg-muted/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-muted-foreground/50" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">No Applications Yet</h3>
            <p className="text-sm text-muted-foreground/80 mb-6">
              You haven&apos;t applied for any jobs yet. Start exploring opportunities!
            </p>
            <Button asChild>
              <Link href="/jobs">
                Find Jobs
              </Link>
            </Button>
          </div>
      )}
    </div>
  );
}