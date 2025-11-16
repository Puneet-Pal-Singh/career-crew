// src/components/dashboard/seeker/my-applications/MyApplicationsTable.tsx
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Eye, Building2, Calendar, Archive } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { generateJobSlug } from "@/lib/utils";
import type { ApplicationViewData } from "@/types";
import { formatSeekerApplicationStatus } from '@/components/dashboard/shared/utils';

// We now accept an `isArchivedView` prop to control the status display
interface MyApplicationsTableProps {
  applications: ApplicationViewData[];
  isArchivedView?: boolean;
}

export function MyApplicationsTable({ applications, isArchivedView = false }: MyApplicationsTableProps) {
  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    // We use a Card as the main container, but no more <table> element.
    <Card>
      <div className="divide-y divide-border">
        {applications.map((app) => (
          <div key={app.applicationId} className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
            {/* Left side: Logo */}
            <div className="flex-shrink-0 mr-4">
              {/* NOTE: We'll need to add companyLogoUrl to our getMyApplicationsAction later */}
              <Image 
                src={'/company-logos/default-company-logo.svg'} 
                alt={`${app.companyName} logo`}
                width={40}
                height={40}
                className="rounded-md border bg-white"
              />
            </div>

            {/* Middle section: Job Info & Status */}
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

            {/* Status & Date Info */}
            <div className="flex-shrink-0 w-48 text-sm text-muted-foreground text-left px-4">
              <div className="flex items-center gap-2">
                 {isArchivedView ? (
                   <>
                    <Archive className="w-4 h-4 text-amber-600" />
                    <span className="font-medium text-amber-600">Archived</span>
                   </>
                 ) : (
                   <>
                    <Calendar className="w-4 h-4" />
                    <span>{formatSeekerApplicationStatus(app.applicationStatus)}</span>
                   </>
                 )}
              </div>
              <p className="mt-1 text-xs">Applied on {formatDate(app.dateApplied)}</p>
            </div>


            {/* Right side: Action Button */}
            <div className="flex-shrink-0">
              <Button variant="outline" size="sm" asChild>
                <Link
                  href={`/jobs/${generateJobSlug(app.jobId, app.jobTitle)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  <Eye className="w-4 h-4" />
                  View Job
                </Link>
              </Button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}