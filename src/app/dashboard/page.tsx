// src/app/dashboard/page.tsx
"use client";

import React, { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserProfile } from '@/contexts/UserProfileContext';
import RoleSelection from '@/components/dashboard/RoleSelection';
import { Loader2, FileText, Bookmark } from 'lucide-react';
import { Button } from '@/components/ui/button'; // For potential logout button
import Link from 'next/link'; // For navigation links
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from '@/components/ui/card';

// --- Dashboard Views Placeholder Components ---
function JobSeekerDashboardView() {
  return (
    <div className="p-4 sm:p-6"> {/* Added padding */}
      <h2 className="text-2xl font-semibold text-foreground mb-6">Seeker Dashboard</h2> {/* Increased bottom margin */}
      <p className="text-muted-foreground mb-8"> {/* Increased bottom margin */}
        Welcome back! Here you can manage your job applications, saved jobs, and profile settings.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6"> {/* Increased gap */}
        {/* My Applications Card */}
        <Link href="/dashboard/seeker/applications" className="block hover:no-underline">
          <Card className="hover:shadow-lg transition-shadow duration-200 h-full flex flex-col"> {/* Added h-full for consistent card height */}
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xl font-medium">My Applications</CardTitle>
              <FileText className="h-6 w-6 text-muted-foreground" />
            </CardHeader>
            <CardContent className="flex-grow"> {/* flex-grow for content */}
              <p className="text-sm text-muted-foreground">
                View and track all your submitted job applications and their current status.
              </p>
            </CardContent>
            <CardFooter>
                <Button variant="outline" className="w-full sm:w-auto">View Applications</Button>
            </CardFooter>
          </Card>
        </Link>

        {/* Saved Jobs Card (Still a placeholder for functionality) */}
        <div className="block"> {/* Make it a div for now since it's not a link yet */}
         <Card className="opacity-70 cursor-not-allowed h-full flex flex-col"> {/* Style as disabled/coming soon */}
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xl font-medium">Saved Jobs</CardTitle>
              <Bookmark className="h-6 w-6 text-muted-foreground" />
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-sm text-muted-foreground">
                Access jobs you&apos;ve bookmarked. (Feature coming soon!)
              </p>
            </CardContent>
             <CardFooter>
                <Button variant="outline" disabled className="w-full sm:w-auto">View Saved Jobs</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}

function EmployerDashboardView() {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold text-foreground mb-4">Employer Dashboard</h2>
      <p className="text-muted-foreground mb-6">Manage your company&apos;s job postings, review applications, and update company details.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 border rounded-lg bg-card">
          <h3 className="font-medium text-lg mb-2">Manage Job Postings</h3>
          <p className="text-sm text-muted-foreground">View, edit, or archive your current job listings.</p>
          <Button variant="outline" asChild className="mt-3">
            <Link href="/dashboard/my-jobs">View My Job Listings</Link>
          </Button>
        </div>
        <div className="p-4 border rounded-lg bg-card">
          <h3 className="font-medium text-lg mb-2">Post a New Job</h3>
          <p className="text-sm text-muted-foreground">Create and publish a new job opening to attract talent.</p>
          <Button asChild className="mt-3">
            <Link href="/dashboard/post-job">Post New Job</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

function AdminDashboardView() { 
  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold text-foreground mb-4">Admin Dashboard</h2>
      <p className="text-muted-foreground mb-6">Manage site settings, user roles, and job postings.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 border rounded-lg bg-card">
          <h3 className="font-medium text-lg mb-2">Pending Job Approvals</h3>
          <p className="text-sm text-muted-foreground">Review and approve or reject new job submissions.</p>
          <Button variant="outline" asChild className="mt-3">
            <Link href="/dashboard/admin/pending-approvals">View Pending Jobs</Link>
          </Button>
        </div>
        {/* Add more admin links/widgets here later */}
      </div>
    </div>
  );
}

function DashboardContentLoading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
      <Loader2 className="h-12 w-12 animate-spin text-primary" />
      <p className="mt-4 text-lg text-muted-foreground">Loading your dashboard...</p>
    </div>
  );
}

export default function DashboardPage() {
  const { user, isInitialized: authIsInitialized } = useAuth();
  const { userProfile, isLoadingProfile, profileError } = useUserProfile();

  useEffect(() => {
    if (userProfile?.role) {
      const roleName = userProfile.role.replace('_', ' ');
      document.title = `${roleName.charAt(0).toUpperCase() + roleName.slice(1).toLowerCase()} Dashboard - CareerCrew`;
    } else if (authIsInitialized && user && !userProfile && !isLoadingProfile) {
      document.title = `Choose Your Role - CareerCrew`;
    } else if (!isLoadingProfile) { // If not loading and no user/profile yet
      document.title = `Dashboard - CareerCrew`;
    }
  }, [userProfile, authIsInitialized, user, isLoadingProfile]);

  if (!authIsInitialized || (user && isLoadingProfile)) {
    // Show loading if:
    // 1. Auth state is not yet initialized.
    // 2. Auth is initialized, a user exists, BUT their profile is currently being loaded.
    return <DashboardContentLoading />;
  }

  if (profileError) {
    return (
      <div className="container mx-auto py-8 px-4 text-center">
        <h1 className="text-2xl font-bold text-destructive mb-4">Dashboard Error</h1>
        <p className="text-destructive-foreground">Could not load your dashboard: {profileError.message}</p>
        <p className="mt-2 text-muted-foreground">Please try refreshing. If the problem persists, contact support.</p>
      </div>
    );
  }

  // If user is authenticated, profile is loaded, but they haven't made an explicit role choice yet
  if (user && userProfile && !userProfile.has_made_role_choice) {
    // The DB trigger defaults new users to 'JOB_SEEKER' and has_made_role_choice to 'false'.
    // This screen allows them to confirm or change their primary role once.
    return <RoleSelection />;
  }
  
  // If profile is loaded and a role choice has been made
  if (userProfile?.role) {
    switch (userProfile.role) {
      case 'JOB_SEEKER':
        return <JobSeekerDashboardView />;
      case 'EMPLOYER':
        return <EmployerDashboardView />;
      case 'ADMIN':
        return <AdminDashboardView />; // You'll need to manually set a user to ADMIN in DB
      default:
        // Should not happen if roles are well-defined and has_made_role_choice works
        console.warn("DashboardPage: User profile has an unrecognized role after choice:", userProfile.role);
        return <RoleSelection />; // Fallback to allow re-selection if role state is invalid
    }
  }
  
  // Fallback for unexpected states:
  // e.g. user authenticated, profile finished loading (not isLoadingProfile), no profileError,
  // but userProfile is still null or userProfile.role is null/undefined.
  // This implies an issue with profile creation or fetching that wasn't an outright error.
  if (user && !userProfile && !isLoadingProfile && !profileError) {
    console.warn("DashboardPage: User authenticated, profile loading finished, but no profile data. Showing RoleSelection.");
    return <RoleSelection />;
  }

  // If no user session (middleware should prevent this, but good to have a graceful UI)
  return (
    <div className="container mx-auto py-8 px-4 text-center">
      <p className="text-muted-foreground">Loading dashboard or please log in.</p>
      {/* Could add a login button here if appropriate */}
    </div>
  );
}