// src/components/dashboard/admin/jobs/AllJobsTableActions.tsx
"use client";

import React from 'react';
import type { AdminJobRowData } from '@/types';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Eye, Edit3, MoreHorizontal } from 'lucide-react';
import Link from 'next/link';
import { generateJobSlug } from '@/lib/utils'; // Assuming this utility function exists

interface AllJobsTableActionsProps {
  job: AdminJobRowData;
}

export default function AllJobsTableActions({ job }: AllJobsTableActionsProps) {
  // Admins can always view and edit any job.
  const viewLink = `/jobs/${generateJobSlug(job.id, job.title)}`;
  const editLink = `/dashboard/admin/jobs/${job.id}/edit`;

  return (
    <>
      {/* Desktop Actions */}
      <div className="hidden md:flex items-center justify-end space-x-2">
        <Button variant="outline" size="icon" asChild title="View Public Listing">
          <Link href={viewLink}><Eye className="h-4 w-4" /></Link>
        </Button>
        <Button variant="outline" size="icon" asChild title="Edit Job">
          <Link href={editLink}><Edit3 className="h-4 w-4" /></Link>
        </Button>
      </div>

      {/* Mobile Actions Dropdown */}
      <div className="md:hidden">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Job Actions</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href={viewLink}><Eye className="mr-2 h-4 w-4" /> View Job</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={editLink}><Edit3 className="mr-2 h-4 w-4" /> Edit Job</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  );
}