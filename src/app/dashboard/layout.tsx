// src/app/dashboard/layout.tsx
import React from 'react';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import { redirect } from 'next/navigation';
import { getSession, type Session } from '@/lib/auth'; // Import Session type
import type { UserRole } from '@prisma/client'; // Import UserRole enum

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session: Session | null = await getSession();

  if (!session?.user?.userId) { // More robust check
    redirect('/login?callbackUrl=/dashboard');
  }
  
  // session.user.role is already correctly typed as UserRole from getSession()
  const userRole: UserRole = session.user.role;

  return (
    <div className="flex min-h-screen bg-background-light dark:bg-background-dark">
      {/* Pass the userRole directly; it's already the correct Prisma enum type */}
      <DashboardSidebar userRole={userRole} /> 
      <main className="flex-1 p-6 sm:p-8 md:p-10 overflow-y-auto">
        {/* Optional DashboardHeader can be added here */}
        {/* <DashboardHeader userName={session.user.name || 'User'} /> */}
        <div className="mt-0"> {/* Removed mt-4 assuming no DashboardHeader for now */}
          {children}
        </div>
      </main>
    </div>
  );
}