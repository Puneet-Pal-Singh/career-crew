// src/app/dashboard/layout.tsx
import React from 'react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // For now, a very simple layout. We'll add a sidebar later.
  // This layout will be protected by middleware.
  return (
    <div className="flex min-h-screen">
      {/* Placeholder for a potential sidebar later */}
      {/* <aside className="w-64 bg-surface-light dark:bg-surface-dark p-4">
        Dashboard Sidebar
      </aside> */}
      <main className="flex-1 p-4 md:p-6 lg:p-8">
        {children}
      </main>
    </div>
  );
}