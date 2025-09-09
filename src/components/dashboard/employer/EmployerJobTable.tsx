// src/components/dashboard/employer/EmployerJobTable.tsx
"use client";

import type { EmployerJobDisplayData, JobStatus } from '@/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Eye, Edit3, Archive, PlusCircle, Briefcase, MoreHorizontal } from 'lucide-react';
import { generateJobSlug } from '@/lib/utils';
import { Card } from '@/components/ui/card'; // <-- FIX 1: Corrected the import path for Card

interface EmployerJobTableProps {
  jobs: EmployerJobDisplayData[];
}

const getStatusBadgeVariant = (status: JobStatus): "default" | "destructive" | "outline" | "secondary" | null | undefined => {
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
      <div className="text-center py-10 border rounded-lg bg-card">
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
  // const archivableStatuses: JobStatus[] = ['DRAFT', 'PENDING_APPROVAL', 'APPROVED']; // This can be added back when archive is implemented

  return (
    <Card>
      {/* DESKTOP VIEW */}
      <div className="hidden md:block border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-[250px]">Job Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date Posted</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {jobs.map((job) => {
              const canBeViewedPublicly = job.status === 'APPROVED';
              const canBeEdited = editableStatuses.includes(job.status);
              // --- FIX 2: Removed unused 'canBeArchived' variable ---

              return (
                <TableRow key={job.id}>
                  <TableCell className="font-medium">{job.title}</TableCell>
                  <TableCell><Badge variant={getStatusBadgeVariant(job.status)}>{formatStatusText(job.status)}</Badge></TableCell>
                  <TableCell>{job.createdAt}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="outline" size="icon" asChild={canBeViewedPublicly} disabled={!canBeViewedPublicly} title="View Public Listing">
                      {canBeViewedPublicly ? <Link href={`/jobs/${generateJobSlug(job.id, job.title)}`} target="_blank"><Eye className="h-4 w-4" /></Link> : <Eye className="h-4 w-4 text-muted" />}
                    </Button>
                    <Button variant="outline" size="icon" asChild={canBeEdited} disabled={!canBeEdited} title="Edit Job">
                      {canBeEdited ? <Link href={`/dashboard/my-jobs/${job.id}/edit`}><Edit3 className="h-4 w-4" /></Link> : <Edit3 className="h-4 w-4 text-muted" />}
                    </Button>
                    <Button variant="outline" size="icon" disabled title="Archive (Coming Soon)">
                      <Archive className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* MOBILE VIEW */}
      <div className="md:hidden space-y-3">
        {jobs.map((job) => {
          const canBeViewedPublicly = job.status === 'APPROVED';
          const canBeEdited = editableStatuses.includes(job.status);
          
          return (
            <div key={job.id} className="border rounded-lg p-4 bg-card">
              <div className="flex justify-between items-start gap-4">
                {/* Left side: Title, Date */}
                <div className="flex-grow">
                  <p className="font-semibold text-base leading-tight">{job.title}</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Posted on: {job.createdAt}
                  </p>
                </div>
                {/* Right side: Badge and Actions Dropdown */}
                <div className="flex-shrink-0 flex flex-col items-end gap-2">
                  <Badge variant={getStatusBadgeVariant(job.status)} className="text-xs">
                    {formatStatusText(job.status)}
                  </Badge>
                  
                  {/* Use a dropdown for actions to save space */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Job Actions</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild disabled={!canBeViewedPublicly}>
                        {canBeViewedPublicly ? 
                          <Link href={`/jobs/${generateJobSlug(job.id, job.title)}`} target="_blank">
                            <Eye className="mr-2 h-4 w-4" /> View Listing
                          </Link> : 
                          <span><Eye className="mr-2 h-4 w-4" /> View Listing</span>
                        }
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild disabled={!canBeEdited}>
                        {canBeEdited ? 
                          <Link href={`/dashboard/my-jobs/${job.id}/edit`}>
                            <Edit3 className="mr-2 h-4 w-4" /> Edit Job
                          </Link> :
                          <span><Edit3 className="mr-2 h-4 w-4" /> Edit Job</span>
                        }
                      </DropdownMenuItem>
                      <DropdownMenuItem disabled>
                        <Archive className="mr-2 h-4 w-4" /> Archive (Soon)
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}