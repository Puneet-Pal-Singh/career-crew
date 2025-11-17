// src/components/dashboard/seeker/my-applications/MyApplicationsCards.tsx
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { Building2, Calendar } from "lucide-react";
import { generateJobSlug } from "@/lib/utils";
import type { ApplicationViewData } from "@/types";
// Import the new centralized date function
import { formatDisplayDate } from "@/components/dashboard/shared/utils";
import { ApplicationStatusIndicator } from "./ApplicationStatusIndicator";

interface MyApplicationsCardsProps {
  applications: ApplicationViewData[];
}

export function MyApplicationsCards({ applications}: MyApplicationsCardsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {applications.map((app) => (
        <Card key={app.applicationId}>
            <CardContent className="p-5">
                <div className="mb-4">
                    <Link
                    href={`/jobs/${generateJobSlug(app.jobId, app.jobTitle)}`}
                    className="text-base font-semibold text-foreground hover:text-primary transition-colors line-clamp-2 mb-1 block"
                    >
                    {app.jobTitle}
                    </Link>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Building2 className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">{app.companyName}</span>
                    </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="w-3.5 h-3.5" />
                        {/* Use the new centralized function */}
                        {formatDisplayDate(app.dateApplied)}
                    </div>
                    <ApplicationStatusIndicator application={app}/>
                </div>
            </CardContent>
        </Card>
      ))}
    </div>
  );
}