// src/components/dashboard/admin/applications/JobsWithCountsTableRow.tsx
'use client';

import React from 'react';
import type { AdminJobWithApplicationCount } from '@/types';
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';
import Link from 'next/link';

interface JobsWithCountsTableRowProps {
  job: AdminJobWithApplicationCount;
}

export default function JobsWithCountsTableRow({ job }: JobsWithCountsTableRowProps) {
  return (
    <TableRow>
      <TableCell className="font-medium">{job.jobTitle}</TableCell>
      <TableCell>{job.companyName}</TableCell>
      <TableCell className="text-center">{job.applicationCount}</TableCell>
      <TableCell className="text-right">
        <Button variant="outline" asChild>
          <Link href={`/dashboard/admin/applications/${job.jobId}`}>
            <Eye className="mr-2 h-4 w-4" /> View Applications
          </Link>
        </Button>
      </TableCell>
    </TableRow>
  );
}