// src/components/dashboard/seeker/my-applications/MyApplicationsTable.tsx
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"; // Import Avatar
import { Eye, Building2 } from "lucide-react";
import Link from "next/link";
import { generateJobSlug } from "@/lib/utils";
import type { ApplicationViewData } from "@/types";

interface MyApplicationsTableProps {
  applications: ApplicationViewData[];
}

export function MyApplicationsTable({ applications }: MyApplicationsTableProps) {
  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50%]">Job & Company</TableHead>
            <TableHead>Applied Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {applications.map((app) => (
            <TableRow key={app.applicationId} className="hover:bg-muted/30 transition-colors">
              <TableCell className="font-medium">
                <div className="flex items-center gap-4">
                  {/* NEW: Company Logo Avatar */}
                  <Avatar className="hidden h-12 w-12 sm:flex">
                    <AvatarImage src={app.companyLogoUrl || ''} alt={`${app.companyName} logo`} />
                    <AvatarFallback className="font-semibold">
                      {app.companyName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  
                  {/* Job Title and Company Name Block */}
                  <div>
                    <Link
                      href={`/jobs/${generateJobSlug(app.jobId, app.jobTitle)}`}
                      className="font-semibold text-base text-foreground hover:text-primary transition-colors"
                    >
                      {app.jobTitle}
                    </Link>
                    <div className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                      <Building2 className="w-4 h-4" />
                      {app.companyName}
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-muted-foreground align-middle">
                {formatDate(app.dateApplied)}
              </TableCell>
              <TableCell className="text-right align-middle">
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
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}