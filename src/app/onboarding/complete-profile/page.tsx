// src/app/onboarding/complete-profile/page.tsx
import { getSupabaseServerClient } from "@/lib/supabase/serverClient";
import { redirect } from "next/navigation";
import OnboardingForm from "./OnboardingForm";
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Complete Your Profile - CareerCrew' };

type CompleteProfilePageProps = {
  searchParams: Promise<{ intended_role?: string; redirectTo?: string; }>;
};

export default async function CompleteProfilePage({ searchParams }: CompleteProfilePageProps) {
  const resolvedSearchParams = await searchParams;
  const supabase = await getSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return redirect('/login');

  // ✅ THE FIX: This logic correctly determines the role for BOTH flows.
  let finalRole: 'EMPLOYER' | 'JOB_SEEKER';
  
  const intendedRoleFromUrl = resolvedSearchParams.intended_role;
  const roleFromJwt = user.app_metadata?.role;

  // Prioritize the URL "ticket" for Google users.
  if (intendedRoleFromUrl === 'EMPLOYER') {
    finalRole = 'EMPLOYER';
  } 
  // Fall back to the JWT for Email/Password users.
  else if (roleFromJwt === 'EMPLOYER') {
    finalRole = 'EMPLOYER';
  } 
  // Default to Job Seeker in all other cases.
  else {
    finalRole = 'JOB_SEEKER';
  }
  
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('full_name, has_completed_onboarding')
    .eq('id', user.id)
    .single();

  if (profileError) {
    console.error('Profile fetch error:', profileError);
    // Handle appropriately - maybe redirect to error page or create profile
    return redirect('/login');
  }

  if (profile?.has_completed_onboarding) {
    return redirect('/dashboard');
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40 p-4">
      <div className="w-full max-w-lg">
        <OnboardingForm
          fullName={profile?.full_name || user.email || ''}
          role={finalRole}
          afterSignIn={resolvedSearchParams.redirectTo || null}
        />
      </div>
    </div>
  );
}