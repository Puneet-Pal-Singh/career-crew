// src/components/dashboard/seeker/my-applications/MyApplicationsCards.tsx
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { Building2, Calendar } from "lucide-react";
import { generateJobSlug } from "@/lib/utils";
import type { ApplicationViewData } from "@/types";
import { Button } from "@/components/ui/button";

interface MyApplicationsCardsProps {
  applications: ApplicationViewData[];
}

export function MyApplicationsCards({ applications }: MyApplicationsCardsProps) {
  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  return (
    <div className="grid gap-4">
      {applications.map((app) => (
        <Card key={app.applicationId} className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-start gap-4 mb-4">
                {/* NEW: Company Logo Avatar */}
                <Avatar>
                    <AvatarImage src={app.companyLogoUrl || ''} alt={`${app.companyName} logo`} />
                    <AvatarFallback>{app.companyName.charAt(0)}</AvatarFallback>
                </Avatar>
                
                {/* Job Title and Company Name Block */}
                <div className="flex-1">
                    <Link
                        href={`/jobs/${generateJobSlug(app.jobId, app.jobTitle)}`}
                        className="font-semibold text-foreground hover:text-primary transition-colors line-clamp-2"
                    >
                        {app.jobTitle}
                    </Link>
                    <div className="text-sm text-muted-foreground flex items-center gap-1.5 mt-1">
                        <Building2 className="w-3.5 h-3.5" />
                        <span className="truncate">{app.companyName}</span>
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Calendar className="w-3.5 h-3.5" />
                Applied on {formatDate(app.dateApplied)}
              </div>
              <Button variant="secondary" size="sm" asChild>
                <Link href={`/jobs/${generateJobSlug(app.jobId, app.jobTitle)}`}>
                  View Job
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}