// src/components/dashboard/admin/jobs/AllJobsTable.tsx
"use client";
import React from 'react';
import type { AdminJobRowData } from '@/types';
import { Table, TableBody, TableHeader, TableRow, TableHead, TableCaption } from "@/components/ui/table";
import { Card } from '@/components/ui/card';
import AllJobsTableRow from './AllJobsTableRow';
import AllJobsCard from './AllJobsCard';
interface AllJobsTableProps {
  initialJobs: AdminJobRowData[];
}
export default function AllJobsTable({ initialJobs }: AllJobsTableProps) {
  // Note: An empty state is handled in the page.tsx, so we assume initialJobs has items.
  return (
    <Card>
      {/* DESKTOP VIEW */}
      <div className="hidden md:block">
        <Table>
          <TableCaption>A list of all jobs on the platform.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-[250px]">Job Title</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date Posted</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {initialJobs.map((job) => (
              <AllJobsTableRow key={job.id} job={job} />
            ))}
          </TableBody>
        </Table>
      </div>
      {/* MOBILE + TABLET VIEW */}
      <div className="md:hidden p-4 space-y-3">
        {initialJobs.map((job) => (
          <AllJobsCard key={job.id} job={job} />
        ))}
      </div>
    </Card>
  );
}