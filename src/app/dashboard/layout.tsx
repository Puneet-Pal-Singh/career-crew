// src/app/dashboard/layout.tsx
import React from 'react';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import { getSupabaseServerClient } from '@/lib/supabase/serverClient';
import { redirect } from 'next/navigation';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await getSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();

  return (
    // The main grid container for the entire dashboard
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      
      {/* Sidebar Column: We apply the right-border to this parent div */}
      <div className="hidden border-r bg-background md:block">
        <DashboardSidebar role={profile?.role} />
      </div>

      {/* Main Content Column */}
      <div className="flex flex-col">
        {/* Header: We apply the bottom-border to the header itself */}
        <DashboardHeader user={user} profile={profile} />
        
        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}