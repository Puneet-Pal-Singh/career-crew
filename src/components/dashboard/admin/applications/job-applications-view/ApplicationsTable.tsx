// src/components/dashboard/admin/applications/ApplicationsTable.tsx
'use client';

import React from 'react';
import type { AdminApplicationForJob } from '@/types';
import { Table, TableBody, TableHeader, TableRow, TableHead, TableCaption } from "@/components/ui/table";
import { Card } from '@/components/ui/card';
import ApplicationsTableRow from './ApplicationsTableRow';
import ApplicationsCard from './ApplicationsCard';

interface ApplicationsTableProps {
  applications: AdminApplicationForJob[];
}

export default function ApplicationsTable({ applications }: ApplicationsTableProps) {
  return (
    <Card>
      {/* DESKTOP VIEW */}
      <div className="hidden md:block">
        <Table>
          <TableCaption>A list of all applications for this job.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Applicant Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date Applied</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {applications.map((app) => (
              <ApplicationsTableRow key={app.applicationId} application={app} />
            ))}
          </TableBody>
        </Table>
      </div>

      {/* MOBILE + TABLET VIEW */}
      <div className="md:hidden p-4 space-y-3">
        {applications.map((app) => (
          <ApplicationsCard key={app.applicationId} application={app} />
        ))}
      </div>
    </Card>
  );
}