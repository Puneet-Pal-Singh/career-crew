// // src/app/dashboard/layout.tsx
// import React from "react";
// import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
// import DashboardHeader from "@/components/dashboard/DashboardHeader";

// /**
//  * This is the root layout for all pages inside the `/dashboard` route group.
//  * It establishes the persistent two-column structure with a sidebar and main content area.
//  * The DashboardHeader is rendered within the main content column.
//  */
// export default function DashboardLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
//       {/* --- Column 1: The Sidebar --- */}
//       {/* This is hidden on mobile (md:block) and is a fixed column on desktop */}
//       <div className="hidden border-r bg-muted/40 md:block">
//         <DashboardSidebar />
//       </div>

//       {/* --- Column 2: The Main Content Area --- */}
//       <div className="flex flex-col">
//         {/* The Dashboard-specific Header is rendered here, at the top of the main column */}
//         <DashboardHeader />
        
//         {/* The actual page content is rendered below the header */}
//         <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 overflow-auto">
//           {children}
//         </main>
//       </div>
//     </div>
//   );
// }


// src/app/dashboard/layout.tsx
import React from 'react';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import { getSupabaseServerClient } from '@/lib/supabase/serverClient';
import { redirect } from 'next/navigation';
// import type { User } from '@supabase/supabase-js';
import type { UserProfile } from '@/types';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await getSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-muted/40 md:block">
        <DashboardSidebar role={profile?.role} />
      </div>
      <div className="flex flex-col">
        {/* FIX: Pass the fetched user and profile objects as props */}
        <DashboardHeader user={user} profile={profile as UserProfile | null} />
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}