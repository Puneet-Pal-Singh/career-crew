// src/components/dashboard/seeker/my-applications/MyApplicationsTable.tsx
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Building2, Calendar, Archive, XCircle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { generateJobSlug } from "@/lib/utils";
import type { ApplicationViewData } from "@/types";
import { formatSeekerApplicationStatus } from '@/components/dashboard/shared/utils';

interface MyApplicationsTableProps {
  applications: ApplicationViewData[];
  isArchivedView?: boolean;
}

export function MyApplicationsTable({ applications, isArchivedView = false }: MyApplicationsTableProps) {
  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  // REFINED LOGIC: This helper now returns the definitive status for the Archived tab.
  const getArchivedStatus = (app: ApplicationViewData) => {
    if (app.applicationStatus === 'REJECTED') {
      return {
        text: 'Not Accepted', // <-- The correct, direct terminology
        icon: <XCircle className="w-4 h-4 text-red-600 dark:text-red-500" />,
        className: 'text-red-600 dark:text-red-500'
      };
    }
    // The "Expired" logic remains correct for time-based archiving.
    return {
      text: 'Expired',
      icon: <Archive className="w-4 h-4 text-amber-600" />,
      className: 'text-amber-600'
    };
  };

  return (
    <Card>
      <div className="divide-y divide-border">
        {applications.map((app) => {
          const archivedStatus = isArchivedView ? getArchivedStatus(app) : null;
          return (
            <div key={app.applicationId} className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
              {/* Logo */}
              <div className="flex-shrink-0 mr-4">
                <Image 
                  src={'/company-logos/default-company-logo.svg'} 
                  alt={`${app.companyName} logo`}
                  width={40}
                  height={40}
                  className="rounded-md border bg-white"
                />
              </div>
              {/* Job info */}
              <div className="flex-grow">
                <Link
                  href={`/jobs/${generateJobSlug(app.jobId, app.jobTitle)}`}
                  className="font-semibold text-foreground hover:text-primary transition-colors"
                >
                  {app.jobTitle}
                </Link>
                <div className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                  <Building2 className="w-4 h-4" />
                  {app.companyName}
                </div>
              </div>

              <div className="flex-shrink-0 w-48 text-sm text-left px-4">
                <div className="flex items-center gap-2">
                  {isArchivedView && archivedStatus ? (
                    <>
                      {archivedStatus.icon}
                      <span className={`font-medium ${archivedStatus.className}`}>{archivedStatus.text}</span>
                    </>
                  ) : (
                    <>
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">{formatSeekerApplicationStatus(app.applicationStatus)}</span>
                    </>
                  )}
                </div>
                <p className="mt-1 text-xs text-muted-foreground">Applied on {formatDate(app.dateApplied)}</p>
              </div>

              <div className="flex-shrink-0">
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/jobs/${generateJobSlug(app.jobId, app.jobTitle)}`}>
                    View Job
                  </Link>
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}


