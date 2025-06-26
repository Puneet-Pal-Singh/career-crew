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
  const { data: profile } = await supabase
    .from('profiles')
    .select('role, has_made_role_choice')
    .eq('id', user.id)
    .single();

  let dashboardView: React.ReactNode = null;

  // Decide which server component to render based on the role
  if (profile?.has_made_role_choice) {
    switch (profile.role) {
      case 'JOB_SEEKER':
        // We are NOT calling a function. We are providing the component itself.
        // Next.js will render this on the server before passing it to the client.
        dashboardView = <JobSeekerDashboardView />;
        break;
      case 'EMPLOYER':
        // Note: For this to work fully, EmployerDashboardView will also need
        // to be converted to an async Server Component in the future.
        dashboardView = <EmployerDashboardView />;
        break;
      case 'ADMIN':
        dashboardView = <AdminDashboardView />;
        break;
    }
  }

  // Pass the server-fetched profile data and the pre-selected dashboard view
  // to the client component.
  return (
    <DashboardPageClient
      serverProfile={profile}
    >
      {dashboardView}
    </DashboardPageClient>
  );
}