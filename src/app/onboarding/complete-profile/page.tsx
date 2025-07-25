// src/app/onboarding/complete-profile/page.tsx
import { getSupabaseServerClient } from "@/lib/supabase/serverClient";
import { redirect } from "next/navigation";
import OnboardingForm from "./OnboardingForm";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Complete Your Profile - CareerCrew',
};

export default async function CompleteProfilePage({ searchParams }: { searchParams: { intended_role?: string } }) {
  const supabase = await getSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: profile } = await supabase.from('profiles').select('full_name, has_completed_onboarding').eq('id', user.id).single();
  if (profile?.has_completed_onboarding) redirect('/dashboard');

  const finalRole = searchParams.intended_role === 'EMPLOYER' ? 'EMPLOYER' : 'JOB_SEEKER';

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40 p-4">
      <div className="w-full max-w-lg">
        <OnboardingForm 
          fullName={profile?.full_name || ''} 
          role={finalRole}
        />
      </div>
    </div>
  );
}