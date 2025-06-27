// src/components/dashboard/seeker/MyApplicationsTable.tsx
"use client";

import type { ApplicationViewData, ApplicationStatusOption } from '@/types';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/Badge";
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react'; // Icons

interface MyApplicationsTableProps {
  applications: ApplicationViewData[];
}

// Define the type for your actual badge variants if different from shadcn defaults
type BadgeVariant = "default" | "secondary" | "primary" | "success" | "warning" | "danger" | undefined;

// Helper to get variant for application status badge
const getApplicationStatusBadgeVariant = (status: ApplicationStatusOption): BadgeVariant => {
  switch (status) {
    case 'SUBMITTED':
      return 'secondary'; // Or 'primary'
    case 'VIEWED':
      return 'secondary';
    case 'INTERVIEWING':
      return 'warning'; // Or another distinct color
    case 'OFFERED':
      return 'success';
    case 'HIRED':
      return 'success'; // Strong success
    case 'REJECTED':
      return 'danger';
    default:
      return 'default'; // Fallback
  }
};

// Helper to format status text for display
const formatApplicationStatusText = (status: ApplicationStatusOption): string => {
    return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
};

export default function MyApplicationsTable({ applications }: MyApplicationsTableProps) {
  // This component assumes the parent page (MyApplicationsPage) handles the case where `applications` might be empty.
  // If applications is guaranteed to be non-empty here, the initial check in parent is sufficient.
  if (!applications || applications.length === 0) {
    // This should ideally not be reached if parent handles empty state, but as a fallback:
    return <p className="text-center text-muted-foreground py-8">You have no job applications.</p>;
  }

  return (
    <div className="border rounded-lg"> {/* Added border and rounded for table container */}
      <Table>
        <TableCaption>A list of your submitted job applications.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[40%] min-w-[200px]">Job Title</TableHead>
            <TableHead className="w-[30%] min-w-[150px]">Company</TableHead>
            <TableHead className="min-w-[120px]">Date Applied</TableHead>
            <TableHead className="min-w-[150px]">Status</TableHead>
            <TableHead className="text-right min-w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {applications.map((app) => (
            <TableRow key={app.applicationId}>
              <TableCell className="font-medium">
                <Link href={`/jobs/${app.jobId}`} className="hover:underline text-primary">
                  {app.jobTitle}
                </Link>
              </TableCell>
              <TableCell>{app.companyName}</TableCell>
              <TableCell>{app.dateApplied}</TableCell>
              <TableCell>
                <Badge variant={getApplicationStatusBadgeVariant(app.applicationStatus)}>
                  {formatApplicationStatusText(app.applicationStatus)}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <Button variant="outline" size="icon" asChild title="View Original Job Posting">
                  <Link href={`/jobs/${app.jobId}`} target="_blank">
                    <Eye className="h-4 w-4" />
                  </Link>
                </Button>
                {/* Future actions for an application could go here:
                    - Withdraw Application (if status allows)
                    - View Application Details (if more details were stored)
                */}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}