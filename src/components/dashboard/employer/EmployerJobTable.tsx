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
import { Eye, Edit3, Archive, PlusCircle, Briefcase } from 'lucide-react'; // Icons

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

  return (
    <Table>
      <TableCaption>A list of your job postings.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[300px]">Job Title</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Date Posted</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {jobs.map((job) => (
          <TableRow key={job.id}>
            <TableCell className="font-medium">{job.title}</TableCell>
            <TableCell>
              <Badge variant={getStatusBadgeVariant(job.status)}>
                {job.status.replace('_', ' ').toUpperCase()}
              </Badge>
            </TableCell>
            <TableCell>{job.createdAt}</TableCell>
            <TableCell className="text-right space-x-2">
              <Button variant="outline" size="sm" asChild title="View Job (Public View - Placeholder)">
                <Link href={`/jobs/${job.id}`} target="_blank"> {/* Assuming public job view page */}
                  <Eye className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="sm" asChild title="Edit Job (Placeholder)">
                {/* <Link href={`/dashboard/edit-job/${job.id}`}> */}
                <span className="cursor-not-allowed"> {/* Placeholder for edit */}
                  <Edit3 className="h-4 w-4" />
                </span>
                {/* </Link> */}
              </Button>
              <Button variant="outline" size="sm" title="Archive Job (Placeholder)" className="cursor-not-allowed">
                <Archive className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}