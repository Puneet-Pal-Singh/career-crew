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
import { Badge } from "@/components/ui/Badge";
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Eye, Edit3, Archive, PlusCircle, Briefcase} from 'lucide-react';
// --- NEW: Import the slug generation utility ---
import { generateJobSlug } from '@/lib/utils';

interface EmployerJobTableProps {
  jobs: EmployerJobDisplayData[];
}

type BadgeVariant = "default" | "destructive" | "outline" | "secondary" | undefined | null;

const getStatusBadgeVariant = (status: JobStatus): BadgeVariant => {
  switch (status) {
    case 'APPROVED': return 'default';
    case 'PENDING_APPROVAL': case 'DRAFT': return 'secondary';
    case 'REJECTED': return 'destructive';
    case 'ARCHIVED': case 'FILLED': return 'outline';
    default: return 'default';
  }
};

const formatStatusText = (status: JobStatus): string => {
    return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
};

export default function EmployerJobTable({ jobs }: EmployerJobTableProps) {
  if (!jobs || jobs.length === 0) {
    return (
      <div className="text-center py-10 border rounded-lg">
        <Briefcase className="mx-auto h-12 w-12 text-muted-foreground" />
        <h3 className="mt-2 text-lg font-medium text-foreground">No jobs posted yet.</h3>
        <p className="mt-1 text-sm text-muted-foreground">Ready to find your next great hire?</p>
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

  const editableStatuses: JobStatus[] = ['DRAFT', 'PENDING_APPROVAL', 'APPROVED', 'REJECTED'];
  const archivableStatuses: JobStatus[] = ['DRAFT', 'PENDING_APPROVAL', 'APPROVED'];

  return (
    // FIX: This wrapper div makes the table horizontally scrollable on small screens.
    <div className="border rounded-lg w-full overflow-x-auto">
      <Table>
        <TableCaption>A list of your current and past job postings.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="min-w-[250px]">Job Title</TableHead>
            <TableHead className="min-w-[150px]">Status</TableHead>
            <TableHead className="min-w-[120px]">Date Posted</TableHead>
            <TableHead className="text-right min-w-[150px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {jobs.map((job) => {
            const canBeViewedPublicly = job.status === 'APPROVED';
            const canBeEdited = editableStatuses.includes(job.status);
            const canBeArchived = archivableStatuses.includes(job.status);
            const isArchiveFeatureImplemented = false;
            const isArchiveButtonDisabled = !canBeArchived || !isArchiveFeatureImplemented;

            return (
              <TableRow key={job.id}>
                <TableCell className="font-medium whitespace-nowrap">{job.title}</TableCell>
                <TableCell>
                  <Badge variant={getStatusBadgeVariant(job.status)}>
                    {formatStatusText(job.status)}
                  </Badge>
                </TableCell>
                <TableCell className="whitespace-nowrap">{job.createdAt}</TableCell>
                <TableCell className="text-right space-x-1 sm:space-x-2">
                  <Button 
                    variant="outline" 
                    size="icon"
                    asChild={canBeViewedPublicly}
                    disabled={!canBeViewedPublicly}
                    title={canBeViewedPublicly ? "View Public Listing" : "Not live for public view"}
                  >
                    {canBeViewedPublicly ? (
                      <Link href={`/jobs/${generateJobSlug(job.id, job.title)}`} target="_blank"><Eye className="h-4 w-4" /></Link>
                    ) : (
                      <span className="p-2 inline-flex"><Eye className="h-4 w-4 text-muted-foreground" /></span>
                    )}
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon"
                    asChild={canBeEdited}
                    disabled={!canBeEdited}
                    title={canBeEdited ? "Edit Job" : "Cannot edit job in this status"}
                  >
                    {canBeEdited ? (
                      <Link href={`/dashboard/my-jobs/${job.id}/edit`}><Edit3 className="h-4 w-4" /></Link>
                    ) : (
                       <span className="p-2 inline-flex"><Edit3 className="h-4 w-4 text-muted-foreground" /></span>
                    )}
                  </Button>
                  <Button 
                      variant="outline" 
                      size="icon"
                      title={isArchiveFeatureImplemented && canBeArchived ? "Archive Job" : "Archive (Coming Soon)"}
                      disabled={isArchiveButtonDisabled}
                      className={isArchiveButtonDisabled ? "opacity-50 cursor-not-allowed" : ""}
                  >
                    <Archive className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}