// src/app/dashboard/page.tsx
"use client";

import React, { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserProfile } from '@/contexts/UserProfileContext';
import RoleSelection from '@/components/dashboard/RoleSelection';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button'; // For potential logout button
import Link from 'next/link'; // For navigation links

// --- Dashboard Views Placeholder Components ---
function JobSeekerDashboardView() {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold text-foreground mb-4">Seeker Dashboard</h2>
      <p className="text-muted-foreground mb-6">Welcome back! Here you can manage your job applications, saved jobs, and profile settings.</p>
      {/* TODO: Add links or components for applications, saved jobs, profile editing */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 border rounded-lg bg-card">
          <h3 className="font-medium text-lg mb-2">My Applications</h3>
          <p className="text-sm text-muted-foreground">View and track your submitted applications.</p>
          {/* <Button variant="link" className="p-0 h-auto mt-2">View Applications</Button> */}
        </div>
        <div className="p-4 border rounded-lg bg-card">
          <h3 className="font-medium text-lg mb-2">Saved Jobs</h3>
          <p className="text-sm text-muted-foreground">Access jobs you&apos;ve bookmarked for later.</p>
          {/* <Button variant="link" className="p-0 h-auto mt-2">View Saved Jobs</Button> */}
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

function AdminDashboardView() { // Placeholder
  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold text-foreground mb-4">Admin Dashboard</h2>
      <p className="text-muted-foreground">Site administration panel.</p>
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