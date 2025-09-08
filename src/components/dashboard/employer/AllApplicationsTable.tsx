// src/components/dashboard/employer/AllApplicationsTable.tsx
"use client";

import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import type { EmployerApplication } from '@/app/actions/employer/getAllApplicationsAction';

interface AllApplicationsTableProps {
  initialApplications: EmployerApplication[];
  initialTotalCount: number;
}

export default function AllApplicationsTable({ 
  initialApplications, 
  initialTotalCount 
}: AllApplicationsTableProps) {
  // In the future, state for pagination, search, etc., will go here.
  // const [applications, setApplications] = useState(initialApplications);
  // const [totalCount, setTotalCount] = useState(initialTotalCount);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Candidates</CardTitle>
        <CardDescription>
          Showing {initialApplications.length} of {initialTotalCount} total applications.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Applicant Name</TableHead>
                <TableHead>Applying For</TableHead>
                <TableHead>Date Applied</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {initialApplications.length > 0 ? (
                initialApplications.map((app) => (
                  <TableRow key={app.id}>
                    <TableCell className="font-medium">{app.applicantName}</TableCell>
                    <TableCell>{app.jobTitle}</TableCell>
                    <TableCell>{app.appliedAt}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {app.status.toLowerCase()}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {/* Placeholder for future actions */}
                      ...
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    No applications found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        {/* Placeholder for pagination controls */}
      </CardContent>
    </Card>
  );
}