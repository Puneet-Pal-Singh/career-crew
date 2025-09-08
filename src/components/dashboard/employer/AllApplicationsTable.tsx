// src/components/dashboard/employer/AllApplicationsTable.tsx
"use client";

import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import type { EmployerApplication } from '@/app/actions/employer/applications/getAllApplicationsAction';
import ApplicationDetailModal from './ApplicationDetailModal'; // Import the modal
import { Eye } from 'lucide-react';
import type { ApplicationStatusOption } from '@/types';

interface AllApplicationsTableProps {
  initialApplications: EmployerApplication[];
  initialTotalCount: number;
}

export default function AllApplicationsTable({ 
  initialApplications, 
  initialTotalCount 
}: AllApplicationsTableProps) {
  // State to manage which application is selected to be viewed in the modal
  const [applications, setApplications] = useState(initialApplications);
  const [selectedApplicationId, setSelectedApplicationId] = useState<string | null>(null);

  const handleStatusChange = (applicationId: string, newStatus: ApplicationStatusOption) => {
    setApplications(currentApps => 
      currentApps.map(app => 
        app.id === applicationId ? { ...app, status: newStatus } : app
      )
    );
  };

  return (
    <>
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
                {applications.length > 0 ? (
                  applications.map((app) => ( // Use the state variable here
                    <TableRow key={app.id} onClick={() => setSelectedApplicationId(app.id)} className="cursor-pointer hover:bg-muted/50">
                      <TableCell className="font-medium">{app.applicantName}</TableCell>
                      <TableCell>{app.jobTitle}</TableCell>
                      <TableCell>{app.appliedAt}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {app.status.toLowerCase()}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="outline" 
                          size="icon"
                          onClick={() => setSelectedApplicationId(app.id)}
                        >
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">View Application</span>
                        </Button>
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

      {/* The Modal is rendered here and controlled by the state */}
      <ApplicationDetailModal
        applicationId={selectedApplicationId}
        isOpen={!!selectedApplicationId}
        onClose={() => setSelectedApplicationId(null)}
        onStatusChange={handleStatusChange}
      />
    </>
  );
}