// src/app/dashboard/DashboardPageClient.tsx
"use client";

import React, { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserProfile } from '@/contexts/UserProfileContext';

// Import the individual, self-contained dashboard view components
import JobSeekerDashboardView from '@/components/dashboard/views/JobSeekerDashboardView';
import EmployerDashboardView from '@/components/dashboard/views/EmployerDashboardView';
import AdminDashboardView from '@/components/dashboard/views/AdminDashboardView';

// Import components for handling different states
import RoleSelection from '@/components/dashboard/RoleSelection';
import { Loader2 } from 'lucide-react';

/**
 * A simple, reusable loading component for the dashboard.
 */
function DashboardContentLoading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
      <Loader2 className="h-12 w-12 animate-spin text-primary" />
      <p className="mt-4 text-lg text-muted-foreground">Loading Your Dashboard...</p>
    </div>
  );
}

/**
 * This Client Component acts as the main router for the /dashboard page.
 * Its sole responsibility is to check the user's authentication and profile state,
 * and then render the appropriate component:
 * - A loading state
 * - A role selection screen
 * - The specific dashboard view for the user's role
 */
export default function DashboardPageClient() {
  const { user, isInitialized: authIsInitialized } = useAuth();
  const { userProfile, isLoadingProfile, profileError } = useUserProfile();

  // This effect is a good place for side-effects that depend on the final rendered state,
  // such as updating the document title.
  useEffect(() => {
    if (userProfile?.role) {
      const roleName = userProfile.role.replace('_', ' ');
      document.title = `${roleName.charAt(0).toUpperCase() + roleName.slice(1).toLowerCase()} Dashboard - CareerCrew`;
    } else if (!isLoadingProfile) {
      document.title = `Dashboard - CareerCrew`;
    }
  }, [userProfile, isLoadingProfile]);


  // --- Render Logic ---

  // 1. Show a loading spinner while auth state is initializing or the profile is being fetched.
  if (!authIsInitialized || (user && isLoadingProfile)) {
    return <DashboardContentLoading />;
  }

  // 2. Handle any errors that occurred while fetching the user profile.
  if (profileError) {
    return (
      <div className="text-center p-4">
        <h2 className="text-xl font-semibold text-destructive">Dashboard Error</h2>
        <p className="text-muted-foreground mt-2">Could not load your dashboard: {profileError.message}</p>
      </div>
    );
  }

  // 3. If the user is authenticated and their profile indicates they haven't made a
  //    persistent role choice yet, show the RoleSelection component.
  if (user && userProfile && !userProfile.has_made_role_choice) {
    return <RoleSelection />;
  }
  
  // 4. If a profile with a role exists, render the corresponding dashboard view.
  if (userProfile?.role) {
    switch (userProfile.role) {
      case 'JOB_SEEKER':
        return <JobSeekerDashboardView />;
      case 'EMPLOYER':
        return <EmployerDashboardView />;
      case 'ADMIN':
        return <AdminDashboardView />;
      default:
        // This is a fallback for an unexpected role value.
        console.warn("DashboardPageClient: User profile has an unrecognized role:", userProfile.role);
        return <RoleSelection />; 
    }
  }
  
  // 5. Handle fallback cases where the user is authenticated, but the profile is still null
  //    after loading (e.g., a database issue during signup trigger).
  if (user && !userProfile) {
    console.warn("DashboardPageClient: User authenticated, but no profile found. Defaulting to RoleSelection.");
    return <RoleSelection />;
  }

  // 6. Final fallback, should not be reached if middleware is working correctly.
  return <DashboardContentLoading />;
}