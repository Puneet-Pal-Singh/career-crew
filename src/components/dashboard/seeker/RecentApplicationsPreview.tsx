// src/components/dashboard/seeker/RecentApplicationsPreview.tsx

import type { RecentApplication, ApplicationStatusOption } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from "@/components/ui/Badge";
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface RecentApplicationsPreviewProps {
  applications: RecentApplication[];
}

// Copied from MyApplicationsTable - we can centralize these helpers later if needed
type BadgeVariant = "default" | "secondary" | "primary" | "success" | "warning" | "danger" | undefined;

const getApplicationStatusBadgeVariant = (status: ApplicationStatusOption): BadgeVariant => {
  switch (status) {
    case 'SUBMITTED': return 'default';
    case 'VIEWED': return 'secondary';
    case 'INTERVIEWING': return 'warning';
    case 'OFFERED': return 'success';
    case 'HIRED': return 'success';
    case 'REJECTED': return 'danger';
    default: return 'default';
  }
};

const formatApplicationStatusText = (status: ApplicationStatusOption): string => {
    return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
};

export default function RecentApplicationsPreview({ applications }: RecentApplicationsPreviewProps) {
  if (!applications || applications.length === 0) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>My Applications</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-center text-muted-foreground py-8">
                    You haven&apos;t applied to any jobs yet.
                </p>
            </CardContent>
             <CardFooter>
                <Button asChild className="w-full">
                    <Link href="/jobs">Find Your Next Job</Link>
                </Button>
            </CardFooter>
        </Card>
    )
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Applications</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ul className="divide-y">
          {applications.map((app) => (
            <li key={app.applicationId} className="px-6 py-4 flex justify-between items-center hover:bg-muted/50 transition-colors">
              <div>
                <Link href={`/jobs/${app.jobId}`} className="font-semibold text-primary hover:underline">
                    {app.jobTitle}
                </Link>
                <p className="text-sm text-muted-foreground">{app.companyName}</p>
              </div>
              <Badge variant={getApplicationStatusBadgeVariant(app.applicationStatus)}>
                {formatApplicationStatusText(app.applicationStatus)}
              </Badge>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter className="py-4">
        <Button variant="outline" className="w-full" asChild>
          <Link href="/dashboard/seeker/applications">
            View All Applications <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}