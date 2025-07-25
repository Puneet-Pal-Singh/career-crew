// src/app/dashboard/layout.tsx
import React from 'react';
import { getSupabaseServerClient } from '@/lib/supabase/serverClient';
import { redirect } from 'next/navigation';
// FIX: Import the new client layout wrapper
import DashboardLayoutClient from '@/components/dashboard/DashboardLayoutClient';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await getSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (error) {
    console.error('Failed to fetch user profile:', error);
    // Different handling based on error type
    if (error.code === 'PGRST116') {
      // No profile found - might need onboarding
      redirect('/onboarding');
    } else {
      // Other errors - show error page
      throw new Error('Failed to load user profile');
    }
  }

  // FIX: Render the client component, passing all server data and children as props.
  return (
    <DashboardLayoutClient user={user} profile={profile}>
      {children}
    </DashboardLayoutClient>
  );
}