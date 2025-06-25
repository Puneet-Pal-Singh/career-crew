// src/components/dashboard/DashboardPageLayout.tsx
import React from 'react';

interface DashboardPageLayoutProps {
  title: string;
  description: string;
  mainContent: React.ReactNode;
  sideContent?: React.ReactNode; // Optional right-side panel
}

export default function DashboardPageLayout({ title, description, mainContent, sideContent }: DashboardPageLayoutProps) {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        <p className="text-muted-foreground mt-1">{description}</p>
      </header>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-8">
          {mainContent}
        </div>
        
        {/* Side Panel */}
        {sideContent && (
          <div className="lg:col-span-1 space-y-8">
            {sideContent}
          </div>
        )}
      </div>
    </div>
  );
}