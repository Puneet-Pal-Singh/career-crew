// src/components/dashboard/seeker/my-applications/MyApplicationsCards.tsx
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { Building2, Calendar } from "lucide-react";
import { generateJobSlug } from "@/lib/utils";
import type { ApplicationViewData } from "@/types";
import { formatSeekerApplicationStatus } from "@/components/dashboard/shared/utils";

interface MyApplicationsCardsProps {
  applications: ApplicationViewData[];
  isArchivedView?: boolean;
}

export function MyApplicationsCards({ applications, isArchivedView = false }: MyApplicationsCardsProps) {
    const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

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
                        {formatDate(app.dateApplied)}
                    </div>
                    {/* --- CORRECTED STATUS LOGIC --- */}
                    {isArchivedView ? (
                        <Badge variant="outline">Archived</Badge>
                    ) : (
                       <Badge variant="outline">{formatSeekerApplicationStatus(app.applicationStatus)}</Badge>
                    )}
                </div>
            </CardContent>
        </Card>
      ))}
    </div>
  );
}