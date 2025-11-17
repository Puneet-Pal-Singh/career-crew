// src/components/dashboard/seeker/my-applications/MyApplicationsClient.tsx
"use client";

import { useState, useMemo } from "react";
import type { ApplicationViewData } from "@/types";
import { MyApplicationsTable } from "./MyApplicationsTable";
import { MyApplicationsCards } from "./MyApplicationsCards";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface MyApplicationsClientProps {
  initialApplications: ApplicationViewData[];
}

type ActiveTab = 'ongoing' | 'archived';

// Define the shape of the object returned by useMemo for clarity and type safety
type CategorizedApplications = {
  ongoingApplications: ApplicationViewData[];
  archivedApplications: ApplicationViewData[];
};

const ARCHIVE_THRESHOLD_DAYS = 21;

export default function MyApplicationsClient({ initialApplications }: MyApplicationsClientProps) {
  const [activeTab, setActiveTab] = useState<ActiveTab>('ongoing');

  // FIX: Provide an explicit generic type to useMemo to break the circular inference.
  const { ongoingApplications, archivedApplications } = useMemo<CategorizedApplications>(() => {
    // Also, rename internal arrays for clarity.
    const ongoing: ApplicationViewData[] = [];
    const archived: ApplicationViewData[] = [];
    
    const thresholdDate = new Date();
    thresholdDate.setDate(thresholdDate.getDate() - ARCHIVE_THRESHOLD_DAYS);

    initialApplications.forEach((app: ApplicationViewData) => {
      const applicationDate = new Date(app.dateApplied);

      if (app.applicationStatus === 'REJECTED') {
        archived.push(app);
        return;
      }
      
      if ((app.applicationStatus === 'SUBMITTED' || app.applicationStatus === 'VIEWED') && applicationDate < thresholdDate) {
        archived.push(app);
        return;
      }
      
      ongoing.push(app);
    });

    return { ongoingApplications: ongoing, archivedApplications: archived };
  }, [initialApplications]);

  return (
    <Tabs 
        value={activeTab} 
        onValueChange={(value: string) => setActiveTab(value as ActiveTab)}
    >
      <TabsList className="grid w-full grid-cols-2 sm:w-[300px]">
        <TabsTrigger value="ongoing">Ongoing</TabsTrigger>
        <TabsTrigger value="archived">Archived</TabsTrigger>
      </TabsList>

      <div className="mt-6">
        <TabsContent value="ongoing">
          <ApplicationDisplay applications={ongoingApplications} />
        </TabsContent>
        <TabsContent value="archived">
          <ApplicationDisplay applications={archivedApplications} isArchivedView={true} />
        </TabsContent>
      </div>
    </Tabs>
  );
}

interface ApplicationDisplayProps {
    applications: ApplicationViewData[];
    isArchivedView?: boolean;
}

function ApplicationDisplay({ applications, isArchivedView = false }: ApplicationDisplayProps) {
  if (applications.length === 0) {
    return (
        <div className="text-center py-16 border-2 border-dashed rounded-lg">
            <h3 className="text-xl font-medium text-foreground mb-2">
                {isArchivedView ? 'No Archived Applications' : 'No Ongoing Applications'}
            </h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
                {isArchivedView ? 'Applications that are not selected or older than 3 weeks will appear here.' : 'Your active job applications will appear here.'}
            </p>
        </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Mobile Cards View */}
      <div className="lg:hidden">
        <MyApplicationsCards applications={applications}/>
      </div>
      {/* Desktop Table View */}
      <div className="hidden lg:block">
        <MyApplicationsTable applications={applications}/>
      </div>
    </div>
  );
}