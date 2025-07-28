// src/app/onboarding/complete-profile/page.tsx
import { getSupabaseServerClient } from "@/lib/supabase/serverClient";
import { redirect } from "next/navigation";
import OnboardingForm from "./OnboardingForm";
import type { Metadata } from 'next';
// Import the security utility
import { isValidInternalPath } from "@/lib/utils";

export const metadata: Metadata = {
  title: 'Complete Your Profile - CareerCrew',
};

// FIX: Update the props type to include the new 'after_sign_in' parameter.
type CompleteProfilePageProps = {
  params: Promise<Record<string, never>>; 
  searchParams: Promise<{
    intended_role?: string;
    after_sign_in?: string;
  }>;
};

export default async function CompleteProfilePage({ params, searchParams }: CompleteProfilePageProps) {
  await params;
  const resolvedSearchParams = await searchParams;
  
  const supabase = await getSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('full_name, has_completed_onboarding')
    .eq('id', user.id)
    .single();
    
  if (profileError) {
    console.error('Failed to fetch profile:', profileError);
    redirect('/login');
  }

  // Redirect to the final destination if onboarding is already done.
  if (profile?.has_completed_onboarding) {
    // Use the new robust validation function
    const afterSignIn = resolvedSearchParams.after_sign_in;
    const finalRedirect = isValidInternalPath(afterSignIn) ? afterSignIn : '/dashboard';
    redirect(finalRedirect);
  }

  const validRoles = ['EMPLOYER', 'JOB_SEEKER'] as const;
  const intendedRole = resolvedSearchParams.intended_role;
  const foundRole = validRoles.find(role => role === intendedRole);
  const finalRole = foundRole || 'JOB_SEEKER';

  // FIX: Extract the 'after_sign_in' parameter to pass to the form.
  const afterSignIn = resolvedSearchParams.after_sign_in || null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40 p-4">
      <div className="w-full max-w-lg">
        <OnboardingForm 
          fullName={profile?.full_name || ''} 
          role={finalRole}
          // Pass the redirect URL down to the client component.
          afterSignIn={afterSignIn}
        />
      </div>
    </div>
  );
}