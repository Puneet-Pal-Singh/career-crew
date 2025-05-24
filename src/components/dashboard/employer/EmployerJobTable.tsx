// src/components/dashboard/employer/EmployerJobTable.tsx
"use client";

import type { EmployerJobDisplayData, JobStatus } from '@/types';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/Badge"; // Assuming you have a Badge component
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Eye, Edit3, Archive, PlusCircle, Briefcase} from 'lucide-react'; // Added more icons

interface EmployerJobTableProps {
  jobs: EmployerJobDisplayData[];
}

type BadgeVariant = "default" | "secondary" | "primary" | "success" | "warning" | "danger" | undefined;

// Helper to get variant for status badge
const getStatusBadgeVariant = (status: JobStatus): BadgeVariant => {
  switch (status) {
    case 'APPROVED':
      return 'success'; // Use 'success' for approved (typically green)
    case 'PENDING_APPROVAL':
    case 'DRAFT':
      return 'warning'; // Use 'warning' for pending/draft (typically yellow/orange)
    case 'REJECTED':
      return 'danger';  // Use 'danger' for rejected (typically red)
    case 'ARCHIVED':
    case 'FILLED':
      return 'secondary'; // Use 'secondary' for archived/filled (typically gray)
    default:
      return 'default'; // Fallback to default
  }
};

// Helper to format status text for display
const formatStatusText = (status: JobStatus): string => {
    return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
};

export default function EmployerJobTable({ jobs }: EmployerJobTableProps) {
  if (!jobs || jobs.length === 0) {
    return (
      <div className="text-center py-10">
        <Briefcase className="mx-auto h-12 w-12 text-muted-foreground" />
        <h3 className="mt-2 text-lg font-medium text-foreground">No jobs posted yet.</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Ready to find your next great hire?
        </p>
        <div className="mt-6">
          <Button asChild>
            <Link href="/dashboard/post-job">
              <PlusCircle className="mr-2 h-4 w-4" /> Post Your First Job
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  // Define which statuses allow editing.
  // Typically, you can edit drafts, pending, and maybe even approved jobs (which might revert to pending).
  // Rejected jobs might also be editable for resubmission.
  const editableStatuses: JobStatus[] = ['DRAFT', 'PENDING_APPROVAL', 'APPROVED', 'REJECTED'];
  
  // Define which statuses allow archiving.
  // Usually live (approved) or user-managed (draft, pending) jobs.
  const archivableStatuses: JobStatus[] = ['DRAFT', 'PENDING_APPROVAL', 'APPROVED'];

  return (
    <Table>
      <TableCaption>A list of your current and past job postings.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="min-w-[250px] w-[40%]">Job Title</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Date Posted</TableHead>
          <TableHead className="text-right min-w-[150px]">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {jobs.map((job) => {
          const canBeViewedPublicly = job.status === 'APPROVED';
          const canBeEdited = editableStatuses.includes(job.status);
          const canBeArchived = archivableStatuses.includes(job.status); // Placeholder for archive logic

          // Determine if the archive button should be functionally disabled for "Coming Soon"
          const isArchiveFeatureImplemented = false; // Set to true when implemented
          const isArchiveButtonDisabled = !canBeArchived || !isArchiveFeatureImplemented;

          return (
            <TableRow key={job.id}>
              <TableCell className="font-medium">{job.title}</TableCell>
              <TableCell>
                <Badge variant={getStatusBadgeVariant(job.status)}>
                  {formatStatusText(job.status)}
                </Badge>
              </TableCell>
              <TableCell>{job.createdAt}</TableCell>
              <TableCell className="text-right space-x-1 sm:space-x-2">
                {/* View Button */}
                <Button 
                  variant="outline" 
                  size="icon"
                  asChild={canBeViewedPublicly}
                  disabled={!canBeViewedPublicly}
                  title={canBeViewedPublicly ? "View Public Listing" : "Not live for public view"}
                >
                  {canBeViewedPublicly ? (
                    <Link href={`/jobs/${job.id}`} target="_blank" aria-label="View public job listing">
                      <Eye className="h-4 w-4" />
                    </Link>
                  ) : (
                    <span className="p-2 inline-flex items-center justify-center cursor-not-allowed" aria-label="Public view not available">
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    </span>
                  )}
                </Button>

                {/* Edit Button */}
                <Button 
                  variant="outline" 
                  size="icon"
                  asChild={canBeEdited}
                  disabled={!canBeEdited}
                  title={canBeEdited ? "Edit Job" : "Cannot edit job in this status"}
                >
                  {canBeEdited ? (
                    <Link href={`/dashboard/my-jobs/${job.id}/edit`} aria-label="Edit job">
                      <Edit3 className="h-4 w-4" />
                    </Link>
                  ) : (
                     <span className="p-2 inline-flex items-center justify-center cursor-not-allowed" aria-label="Edit not available">
                        <Edit3 className="h-4 w-4 text-muted-foreground" />
                    </span>
                  )}
                </Button>

                {/* Archive Button (Placeholder for now) */}
                 <Button 
                    variant="outline" 
                    size="icon"
                    title={isArchiveFeatureImplemented && canBeArchived ? "Archive Job" : (canBeArchived ? "Archive Job (Feature Coming Soon)" : "Cannot archive job in this status")}
                    disabled={isArchiveButtonDisabled} // This is key for browser default behavior
                    // Tailwind's `disabled:` variant prefix will automatically apply styles like opacity and cursor-not-allowed
                    // e.g., in your button.tsx: "disabled:opacity-50 disabled:cursor-not-allowed"
                    // If not, you can add them explicitly:
                    className={isArchiveButtonDisabled ? "opacity-50 cursor-not-allowed" : ""}
                    aria-label="Archive job"
                    // onClick={() => handleArchive(job.id)} // Implement when ready
                >
                  <Archive className="h-4 w-4" /> {/* Keep the Archive icon on the button itself */}
                </Button>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}