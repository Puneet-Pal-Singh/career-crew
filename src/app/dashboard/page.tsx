// src/app/dashboard/page.tsx
import { getSupabaseServerClient } from '@/lib/supabase/serverClient';
import { redirect } from 'next/navigation';
import type { Metadata } from 'next';

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

  if (error) {
    // This error means the user is authenticated, but their profile data is missing.
    // The safest action is to perform a server-side sign-out to clear the invalid session.
    console.error(`CRITICAL: No profile found for logged-in user ${user.id}. Signing out. Error: ${error.message}`);
    
    // 1. Invalidate the user's session on the server.
    await supabase.auth.signOut();
    
    // 2. Redirect to the login page with an error message.
    return redirect('/login?error=account_issue');
  }

  // This check remains as a safeguard.
  if (!userProfile.has_completed_onboarding) {
    return redirect('/onboarding/complete-profile');
  }

  // Render the correct view based on the profile role.
  switch (userProfile.role) {
    case 'JOB_SEEKER':
      return <JobSeekerDashboardView profile={userProfile} />;
    case 'EMPLOYER':
      return <EmployerDashboardView profile={userProfile} />;
    case 'ADMIN':
      return <AdminDashboardView profile={userProfile} />;
    default:
      // If the role is somehow invalid, also sign the user out safely.
      console.error(`CRITICAL: Invalid role detected for user ${user.id}. Signing out.`);
      await supabase.auth.signOut();
      return redirect('/login?error=invalid_role');
  }
}