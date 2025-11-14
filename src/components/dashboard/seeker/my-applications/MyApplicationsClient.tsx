// src/components/dashboard/seeker/my-applications/MyApplicationsClient.tsx
"use client";

import type { ApplicationViewData } from "@/types";
import { useMyApplications } from "@/hooks/useMyApplications";
import { MyApplicationsTable } from "./MyApplicationsTable";
import { MyApplicationsCards } from "./MyApplicationsCards";
import { NoApplicationsFound } from "./NoApplicationsFound";

interface MyApplicationsClientProps {
  initialApplications: ApplicationViewData[];
}

export default function MyApplicationsClient({ initialApplications }: MyApplicationsClientProps) {
  const {
    filteredApplications,
    totalApplications,
  } = useMyApplications(initialApplications);

  const hasResults = filteredApplications.length > 0;

  return (
    // The outer div and space-y-6 can be moved to the page component
    // for better layout control.
    <div>
      {/* --- ApplicationFilters REMOVED --- */}

      {hasResults ? (
        <>
          {/* Mobile Cards View */}
          <div className="lg:hidden">
            <MyApplicationsCards applications={filteredApplications} />
          </div>

          {/* Desktop Table View */}
          <div className="hidden lg:block">
            <MyApplicationsTable applications={filteredApplications} />
          </div>

          {/* Results Summary Footer */}
          <div className="mt-6 flex items-center justify-start text-sm text-muted-foreground">
            <span>
              Showing <span className="font-medium text-foreground">{totalApplications}</span> of <span className="font-medium text-foreground">{totalApplications}</span> applications
            </span>
          </div>
        </>
      ) : (
        // Note: The parent page already handles the "No Applications Yet" case.
        // This component only shows if there are applications but filters find none.
        // Since we removed filters, this is less likely to be seen, but good to have.
        <NoApplicationsFound />
      )}
    </div>
  );
}