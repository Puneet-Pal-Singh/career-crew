// src/app/dashboard/page.tsx
import { getSupabaseServerClient } from '@/lib/supabase/serverClient';
import { redirect } from 'next/navigation';
import type { Metadata } from 'next';
// import type { User } from '@supabase/supabase-js';

// Import your dashboard views directly
import JobSeekerDashboardView from '@/components/dashboard/views/JobSeekerDashboardView';
import EmployerDashboardView from '@/components/dashboard/views/EmployerDashboardView';
import AdminDashboardView from '@/components/dashboard/views/AdminDashboardView';

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
    .select('*') // Using '*' ensures all required props are fetched
    .eq('id', user.id)
    .single();

  // If there's an error fetching the profile, or onboarding is incomplete, redirect.
  // This is a robust safeguard against race conditions or data issues.
  if (error || !userProfile || !userProfile.has_completed_onboarding) {
    return redirect('/onboarding/complete-profile');
  }

  // Render the correct view based on the fetched profile role.
  switch (userProfile.role) {
    case 'JOB_SEEKER':
      // The unused variable error is now gone because `user` and `userProfile` are passed as props.
      return <JobSeekerDashboardView user={user} profile={userProfile} />;
    
    case 'EMPLOYER':
      return <EmployerDashboardView user={user} profile={userProfile} />;
      
    case 'ADMIN':
      return <AdminDashboardView user={user} profile={userProfile} />;
      
    default:
      // If role is invalid, log out the user for safety.
      return redirect('/api/auth/logout'); // Assumes you have a logout route handler
  }
}