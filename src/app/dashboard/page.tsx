// src/app/dashboard/page.tsx
import React from 'react';
import { getSupabaseServerClient } from '@/lib/supabase/serverClient';
import { redirect } from 'next/navigation';
import type { Metadata } from 'next';
import DashboardPageClient from '@/components/dashboard/DashboardPageClient';
import JobSeekerDashboardView from '@/components/dashboard/views/JobSeekerDashboardView';
import EmployerDashboardView from '@/components/dashboard/views/EmployerDashboardView';
import AdminDashboardView from '@/components/dashboard/views/AdminDashboardView';

export const metadata: Metadata = {
  title: 'Dashboard - CareerCrew',
  description: 'Manage your profile, job postings, and applications on CareerCrew.',
};

// This page MUST be async to fetch data on the server
export default async function DashboardPage() {
  const supabase = await getSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    // Middleware should handle this, but it's a good safeguard.
    redirect('/login');
  }

  // Fetch the user's profile ONCE, on the server.
  const { data: userProfile, error: profileError } = await supabase
    .from('profiles')
    .select('*') // Select all columns to match the UserProfile type
    .eq('id', user.id)
    .single();

  if (profileError) {
    console.error("Dashboard Page Error: Could not fetch user profile.", profileError.message);
  }

  let dashboardView: React.ReactNode = null;

  // Decide which server component to render based on the role
  if (userProfile?.has_made_role_choice && userProfile.role) {
    switch (userProfile.role) {
      case 'JOB_SEEKER':
        // --- FIX: Pass the fetched `userProfile` as a prop ---
        dashboardView = <JobSeekerDashboardView user={user} profile={userProfile} />;
        break;
      case 'EMPLOYER':
        // This will need a similar update when we enhance the employer view
        dashboardView = <EmployerDashboardView />;
        break;
      case 'ADMIN':
        // This will need a similar update when we enhance the admin view
        dashboardView = <AdminDashboardView />;
        break;
    }
  }
  // Pass the server-fetched profile data and the pre-selected dashboard view
  // to the client component.
  return (
    <DashboardPageClient 
      serverProfile={{
        has_made_role_choice: userProfile?.has_made_role_choice ?? false,
        role: userProfile?.role ?? null
      }}
    >
      {dashboardView}
    </DashboardPageClient>
  );
}