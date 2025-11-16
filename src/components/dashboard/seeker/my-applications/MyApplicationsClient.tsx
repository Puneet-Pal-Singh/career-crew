// src/components/dashboard/seeker/my-applications/MyApplicationsClient.tsx
"use client";

import type { ApplicationViewData } from "@/types";
import { useMyApplications } from "@/hooks/useMyApplications";
import { MyApplicationsTable } from "./MyApplicationsTable";
import { MyApplicationsCards } from "./MyApplicationsCards";

interface MyApplicationsClientProps {
  initialApplications: ApplicationViewData[];
}

export default function MyApplicationsClient({ initialApplications }: MyApplicationsClientProps) {
  const {
    filteredApplications,
    totalApplications,
  } = useMyApplications(initialApplications);

  return (
    <div className="space-y-6">
      {/* Mobile Cards View */}
      <div className="lg:hidden">
        <MyApplicationsCards applications={filteredApplications} />
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block">
        <MyApplicationsTable applications={filteredApplications} />
      </div>

      {/* Results Summary Footer */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          Showing <span className="font-medium text-foreground">{filteredApplications.length}</span> of <span className="font-medium text-foreground">{totalApplications}</span> applications
        </span>
      </div>
    </div>
  );
}