// src/app/onboarding/complete-profile/page.tsx
import { getSupabaseServerClient } from "@/lib/supabase/serverClient";
import { redirect } from "next/navigation";
import OnboardingForm from "./OnboardingForm";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Complete Your Profile - CareerCrew',
};

// Updated props type for Next.js 15 - both params and searchParams are now promises
type CompleteProfilePageProps = {
  params: Promise<Record<string, never>>; 
  searchParams: Promise<{
    intended_role?: string;
  }>;
};

export default async function CompleteProfilePage({ params, searchParams }: CompleteProfilePageProps) {
  // Await both params and searchParams (even though params isn't used here)
  await params; // This ensures the promise is resolved even if not used
  const resolvedSearchParams = await searchParams;
  
  const supabase = await getSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: profile } = await supabase.from('profiles').select('full_name, has_completed_onboarding').eq('id', user.id).single();
  if (profile?.has_completed_onboarding) redirect('/dashboard');

  const finalRole = resolvedSearchParams.intended_role === 'EMPLOYER' ? 'EMPLOYER' : 'JOB_SEEKER';

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