// src/app/dashboard/layout.tsx
import React from "react";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";

/**
 * This is the root layout for all pages inside the `/dashboard` route group.
 * It establishes the persistent two-column structure with a sidebar and main content area.
 * The DashboardHeader is rendered within the main content column.
 */
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      {/* --- Column 1: The Sidebar --- */}
      {/* This is hidden on mobile (md:block) and is a fixed column on desktop */}
      <div className="hidden border-r bg-muted/40 md:block">
        <DashboardSidebar />
      </div>

      {/* --- Column 2: The Main Content Area --- */}
      <div className="flex flex-col">
        {/* The Dashboard-specific Header is rendered here, at the top of the main column */}
        <DashboardHeader />
        
        {/* The actual page content is rendered below the header */}
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}