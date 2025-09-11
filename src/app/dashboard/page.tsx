// src/app/dashboard/page.tsx
import React from 'react';
import { getSupabaseServerClient } from '@/lib/supabase/serverClient';
import { redirect } from 'next/navigation';
import type { Metadata } from 'next';
import JobSeekerDashboardView from '@/components/dashboard/views/JobSeekerDashboardView';
import EmployerDashboardView from '@/components/dashboard/views/EmployerDashboardView';
import AdminDashboardView from '@/components/dashboard/views/AdminDashboardView';
import { getEmployerDashboardStatsAction } from '@/app/actions/employer/stats/getEmployerDashboardStatsAction';
import { getJobPerformanceAction } from '@/app/actions/employer/stats/getJobPerformanceAction';
import { getEmployerRecentApplicationsAction } from '@/app/actions/employer/applications/getEmployerRecentApplicationsAction';

export const metadata: Metadata = {
  title: 'Dashboard - CareerCrew',
  description: 'Manage your profile, job postings, and applications.',
};

export default async function DashboardPage() {
  const supabase = await getSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return redirect('/login');
  }

  const { data: userProfile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (error) {
    console.error(`CRITICAL: No profile found for logged-in user ${user.id}. Signing out. Error: ${error.message}`);
    await supabase.auth.signOut();
    return redirect('/login?error=account_issue');
  }

  if (!userProfile.has_completed_onboarding) {
    return redirect('/onboarding/complete-profile');
  }

  switch (userProfile.role) {
    case 'JOB_SEEKER': {
      return <JobSeekerDashboardView profile={userProfile} />;
    }
    
    case 'EMPLOYER': {
      // Fetch all required data for the employer dashboard in parallel
      const [statsResult, jobPerformanceResult, recentApplicationsResult] = await Promise.all([
        getEmployerDashboardStatsAction(),
        getJobPerformanceAction(),
        getEmployerRecentApplicationsAction(),
      ]);
    

      // Handle potential errors from actions
      const stats = statsResult.success ? statsResult.stats : { activeJobs: 0, pendingJobs: 0, archivedJobs: 0, totalJobs: 0 };
      const jobPerformance = jobPerformanceResult.success ? jobPerformanceResult.jobs : [];
      const recentApplications = recentApplicationsResult.success ? recentApplicationsResult.data : [];
      
      return (
        <EmployerDashboardView 
          profile={userProfile} 
          stats={stats}
          jobPerformance={jobPerformance}
          recentApplications={recentApplications}
        />
      );
    }

    case 'ADMIN': {
      return <AdminDashboardView profile={userProfile} />;
    }

    default: {
      console.error(`CRITICAL: Invalid role detected for user ${user.id}. Signing out.`);
      await supabase.auth.signOut();
      return redirect('/login?error=invalid_role');
    }
  }
}