// src/app/onboarding/complete-profile/page.tsx

import { getSupabaseServerClient } from "@/lib/supabase/serverClient";
import { redirect } from "next/navigation";
import OnboardingForm from "./OnboardingForm";

export default async function CompleteProfilePage() {
  const supabase = await getSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Fetch the current profile to pre-fill the form
  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, role')
    .eq('id', user.id)
    .single();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-lg">
        <OnboardingForm 
          fullName={profile?.full_name || ''} 
          role={profile?.role || 'JOB_SEEKER'} // Pass the role to the form
        />
      </div>
    </div>
  );
}