// src/components/dashboard/seeker/my-applications/MyApplicationsCards.tsx
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
// import Link from "next/link";
import { Calendar } from "lucide-react";
import { cn } from "@/lib/utils"; // Import cn for conditional classes
import type { ApplicationViewData } from "@/types";
import { formatSeekerApplicationStatus } from "@/components/dashboard/shared/utils";

interface MyApplicationsCardsProps {
  applications: ApplicationViewData[];
  isArchivedView?: boolean;
}

export function MyApplicationsCards({ applications, isArchivedView = false }: MyApplicationsCardsProps) {
    const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

    // REFINED LOGIC: This helper returns the correct text and style for the badge.
    const getArchivedStatus = (app: ApplicationViewData) => {
        if (app.applicationStatus === 'REJECTED') {
            return {
                text: 'Not Accepted',
                className: 'text-red-600 border-red-600/50'
            };
        }
        return {
            text: 'Expired',
            className: 'text-amber-600 border-amber-600/50'
        };
    };

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {applications.map((app) => {
        const archivedStatus = isArchivedView ? getArchivedStatus(app) : null;
        return (
            <Card key={app.applicationId}>
                <CardContent className="p-5">
                    <div className="mb-4">
                        {/* ... Link and Company Name JSX ... */}
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Calendar className="w-3.5 h-3.5" />
                            {formatDate(app.dateApplied)}
                        </div>
                        {/* --- FINAL, CORRECTED STATUS LOGIC --- */}
                        {isArchivedView && archivedStatus ? (
                            <Badge variant="outline" className={cn('font-medium', archivedStatus.className)}>
                                {archivedStatus.text}
                            </Badge>
                        ) : (
                           <Badge variant="outline">{formatSeekerApplicationStatus(app.applicationStatus)}</Badge>
                        )}
                    </div>
                </CardContent>
            </Card>
        )
      })}
    </div>
  );
}