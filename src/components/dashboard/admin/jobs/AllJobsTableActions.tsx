// src/components/dashboard/admin/jobs/AllJobsTableActions.tsx
"use client";

import React from 'react';
import type { AdminJobRowData } from '@/types';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Eye, Edit3, MoreHorizontal } from 'lucide-react';
import Link from 'next/link';
import { generateJobSlug } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"; // 1. Import Tooltip components

interface AllJobsTableActionsProps {
  job: AdminJobRowData;
}

export default function AllJobsTableActions({ job }: AllJobsTableActionsProps) {
  const viewLink = `/jobs/${generateJobSlug(job.id, job.title)}`;
  // const editLink = `/dashboard/admin/jobs/${job.id}/edit`;
  // The Edit button is now disabled
  const editActionTitle = "Edit functionality is coming soon.";

  return (
    <TooltipProvider>
      {/* Desktop Actions */}
      <div className="hidden md:flex items-center justify-end space-x-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="icon" asChild title="View Public Listing">
              <Link href={viewLink}><Eye className="h-4 w-4" /></Link>
            </Button>
          </TooltipTrigger>
          <TooltipContent><p>View Job Listing</p></TooltipContent>
        </Tooltip>
        
        {/* 2. Wrap the disabled button in a Tooltip for a helpful message */}
        <Tooltip>
          <TooltipTrigger asChild>
            {/* The <span> is necessary for the tooltip to work on a disabled button */}
            <span tabIndex={0}>
              <Button variant="outline" size="icon" disabled>
                <Edit3 className="h-4 w-4" />
              </Button>
            </span>
          </TooltipTrigger>
          <TooltipContent><p>{editActionTitle}</p></TooltipContent>
        </Tooltip>
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
            
            {/* 3. Add the disabled prop to the dropdown menu item */}
            <DropdownMenuItem disabled>
              <Edit3 className="mr-2 h-4 w-4" />
              <span>Edit Job (Soon)</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </TooltipProvider>
  );
}