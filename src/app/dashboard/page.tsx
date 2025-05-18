// src/app/dashboard/page.tsx
"use client"; // This page now needs to be a client component to use hooks

import React, {useEffect} from 'react';
// import type { Metadata } from 'next'; // Metadata can still be exported from client components
import { useAuth } from '@/contexts/AuthContext';
import { useUserProfile } from '@/contexts/UserProfileContext';
import RoleSelection from '@/components/dashboard/RoleSelection';
import { Loader2 } from 'lucide-react';
// import { User } from '@supabase/supabase-js';

// Next.js 13+ App Router allows metadata export from client components
// export const metadata: Metadata = { 
//   title: 'Dashboard - CareerCrew Consulting',
// };
// However, for dynamic titles based on role, you'd set it in useEffect or a wrapper.
// For now, keeping it simple or relying on layout's metadata.

function DashboardContentLoading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <Loader2 className="h-12 w-12 animate-spin text-primary" />
      <p className="mt-4 text-lg text-muted-foreground">Loading your dashboard...</p>
    </div>
  );
}

function JobSeekerDashboardView() {
  // Placeholder for Job Seeker specific content
  return (
    <div>
      <h2 className="text-xl font-semibold text-foreground mb-3">Job Seeker Dashboard</h2>
      <p className="text-muted-foreground">Your applications, saved jobs, and profile settings will appear here.</p>
      {/* TODO: Build out Job Seeker specific components */}
    </div>
  );
}

function EmployerDashboardView() {
  // Placeholder for Employer specific content
  return (
    <div>
      <h2 className="text-xl font-semibold text-foreground mb-3">Employer Dashboard</h2>
      <p className="text-muted-foreground">Manage your job postings, view applicants, and company settings.</p>
      {/* TODO: Build out Employer specific components (e.g., link to Post a Job, My Jobs table) */}
    </div>
  );
}

function AdminDashboardView() {
  // Placeholder for Admin specific content
  return (
    <div>
      <h2 className="text-xl font-semibold text-foreground mb-3">Admin Dashboard</h2>
      <p className="text-muted-foreground">Approve jobs, manage users, view site analytics.</p>
      {/* TODO: Build out Admin specific components */}
    </div>
  );
}


export default function DashboardPage() {
  const { user, isInitialized: authIsInitialized } = useAuth();
  const { userProfile, isLoadingProfile, profileError } = useUserProfile();

  // Set document title dynamically (example)
  useEffect(() => {
    if (userProfile?.role) {
      document.title = `${userProfile.role.charAt(0).toUpperCase() + userProfile.role.slice(1).toLowerCase().replace('_', ' ')} Dashboard - CareerCrew`;
    } else if (authIsInitialized && user && !userProfile && !isLoadingProfile) {
      document.title = `Choose Role - CareerCrew`;
    } else {
      document.title = `Dashboard - CareerCrew`;
    }
  }, [userProfile, authIsInitialized, user, isLoadingProfile]);


  if (!authIsInitialized || isLoadingProfile) {
    return <DashboardContentLoading />;
  }

  if (profileError) {
    return (
      <div className="text-center text-destructive p-4">
        <p>Error loading your profile: {profileError.message}</p>
        <p>Please try refreshing the page or contact support.</p>
      </div>
    );
  }

  // If user is authenticated but profile is not yet created OR
  // if their role is the default 'JOB_SEEKER' and we want to give them a chance to switch to 'EMPLOYER' easily.
  // For simplicity, if they are JOB_SEEKER, show RoleSelection to allow switching to EMPLOYER.
  // If they are already EMPLOYER or ADMIN, show their respective views.
  // This logic can be refined based on how strictly you want to enforce role selection on first login.
  if (user && (!userProfile || userProfile.role === 'JOB_SEEKER')) {
    // More precise condition: if no profile, or if profile exists but is JOB_SEEKER (default, might want to change)
    // OR if you want to *always* show role selection if profile is missing, regardless of default.
    // For this MVP, if they are JOB_SEEKER (which is the default from trigger), show RoleSelection.
    // If they pick JOB_SEEKER again, that's fine, the state updates.
    // If their profile is somehow missing after auth, also show role selection.
    if (!userProfile || (userProfile && userProfile.role === 'JOB_SEEKER' && !sessionStorage.getItem(`roleSelected_${user.id}`))) {
        // Added sessionStorage check to show role selection only once per session for JOB_SEEKERs,
        // or until they pick EMPLOYER. This is a simple UX choice.
        // sessionStorage.setItem(`roleSelected_${user.id}`, 'true'); // Set this after they make a choice in RoleSelection
      return <RoleSelection />;
    }
  }
  
  // Render dashboard based on role once profile is loaded and role is set
  if (userProfile) {
    switch (userProfile.role) {
      case 'JOB_SEEKER':
        return <JobSeekerDashboardView />;
      case 'EMPLOYER':
        return <EmployerDashboardView />;
      case 'ADMIN':
        return <AdminDashboardView />;
      default:
        // Fallback or if role is somehow not one of the above (shouldn't happen with ENUM)
        return <p>Unknown role. Please contact support.</p>;
    }
  }

  // Fallback if user is somehow authenticated but profile logic leads here (e.g. after role selection failure)
  // Or if !user (which middleware should prevent, but good to have a fallback)
  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-4">Welcome to your Dashboard!</h1>
      <p className="text-muted-foreground">Loading your experience or select a role if prompted.</p>
    </div>
  );
}
