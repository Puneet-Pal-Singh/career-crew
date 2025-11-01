// src/components/dashboard/admin/applications/JobsWithCountsTable.tsx
'use client';

import React from 'react';
import type { AdminJobWithApplicationCount } from '@/types';
import { Table, TableBody, TableHeader, TableRow, TableHead, TableCaption } from "@/components/ui/table";
import { Card } from '@/components/ui/card';
import JobsWithCountsTableRow from './JobsWithCountsTableRow';
import JobsWithCountsCard from './JobsWithCountsCard';

interface JobsWithCountsTableProps {
  initialJobs: AdminJobWithApplicationCount[];
}

export default function JobsWithCountsTable({ initialJobs }: JobsWithCountsTableProps) {
  return (
    <Card>
      {/* DESKTOP VIEW */}
      <div className="hidden md:block">
        <Table>
          <TableCaption>A list of all jobs with application counts.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-[250px]">Job Title</TableHead>
              <TableHead>Company</TableHead>
              <TableHead className="text-center">Applications</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {initialJobs.map((job) => (
              <JobsWithCountsTableRow key={job.jobId} job={job} />
            ))}
          </TableBody>
        </Table>
      </div>

      {/* MOBILE + TABLET VIEW */}
      <div className="md:hidden p-4 space-y-3">
        {initialJobs.map((job) => (
          <JobsWithCountsCard key={job.jobId} job={job} />
        ))}
      </div>
    </Card>
  );
}