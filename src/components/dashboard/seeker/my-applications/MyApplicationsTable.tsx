// src/components/dashboard/seeker/my-applications/MyApplicationsTable.tsx
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Building2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { generateJobSlug } from "@/lib/utils";
import type { ApplicationViewData } from "@/types";
// Import the new centralized date function
import { formatDisplayDate } from '@/components/dashboard/shared/utils';
import { ApplicationStatusIndicator } from "./ApplicationStatusIndicator";

interface MyApplicationsTableProps {
  applications: ApplicationViewData[];
}

export function MyApplicationsTable({ applications}: MyApplicationsTableProps) {

  return (
    <Card>
      <div className="divide-y divide-border">
        {applications.map((app) => (
          <div key={app.applicationId} className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
            <div className="flex-shrink-0 mr-4">
              <Image 
                src={'/company-logos/default-company-logo.svg'} 
                alt={`${app.companyName} logo`}
                width={40}
                height={40}
                className="rounded-md border bg-white"
              />
            </div>

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
              <ApplicationStatusIndicator application={app}/>
              <p className="mt-1 text-xs text-muted-foreground">
                {/* Use the new centralized function */}
                Applied on {formatDisplayDate(app.dateApplied)}
              </p>
            </div>

            <div className="flex-shrink-0">
              <Button variant="outline" size="sm" asChild>
                <Link href={`/jobs/${generateJobSlug(app.jobId, app.jobTitle)}`}>
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