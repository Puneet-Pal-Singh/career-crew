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

  const openModal = (appId: string) => setSelectedApplicationId(appId);

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Candidates</CardTitle>
          <CardDescription>
            Showing {applications.length} of {initialTotalCount} total applications.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* --- RESPONSIVE FIX --- */}
          <div className="border rounded-md">
            <Table>
              {/* The Table Header is VISUALLY HIDDEN on mobile, but still present for screen readers */}
              <TableHeader>
                <TableRow>
                  <TableHead className="hidden md:table-cell">Applicant</TableHead>
                  <TableHead className="hidden md:table-cell">Applying For</TableHead>
                  <TableHead className="hidden md:table-cell">Date Applied</TableHead>
                  <TableHead className="hidden md:table-cell">Status</TableHead>
                  <TableHead className="hidden md:table-cell text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              {/* The Table Body's display property is changed on mobile */}
              <TableBody>
                {applications.length > 0 ? (
                  applications.map((app) => (
                    // The TableRow is changed into a grid container on mobile
                    <TableRow 
                      key={app.id} 
                      onClick={() => openModal(app.id)} 
                      className="grid grid-cols-2 md:table-row gap-x-4 gap-y-2 p-4 md:p-0 cursor-pointer hover:bg-muted/50"
                    >
                      {/* Each TableCell is a grid item, spanning columns as needed */}
                      <TableCell className="md:font-medium p-0 md:p-4 col-span-2">
                        {/* Use a label for mobile view */}
                        <span className="md:hidden font-medium text-muted-foreground mr-2">Applicant:</span>
                        {app.applicantName}
                      </TableCell>
                      
                      <TableCell className="p-0 md:p-4 col-span-2">
                        <span className="md:hidden font-medium text-muted-foreground mr-2">Applying for:</span>
                        {app.jobTitle}
                      </TableCell>

                      <TableCell className="p-0 md:p-4 col-span-1 text-left">
                        <span className="md:hidden font-medium text-muted-foreground mr-2">Date:</span>
                        {app.appliedAt}
                      </TableCell>

                      <TableCell className="p-0 md:p-4 col-span-1 md:text-left text-right">
                        <span className="md:hidden font-medium text-muted-foreground mr-2">Status:</span>
                        <Badge variant="outline" className="capitalize">{app.status.toLowerCase()}</Badge>
                      </TableCell>

                      <TableCell className="p-0 md:p-4 col-span-2 md:text-right">
                         <Button 
                           variant="outline" 
                           className="w-full md:w-auto md:h-auto md:p-2"
                           size="sm"
                           onClick={(e) => { e.stopPropagation(); openModal(app.id); }}>
                           <Eye className="h-4 w-4 md:mr-0 mr-2" />
                           <span className="md:sr-only">View Details</span>
                         </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow><TableCell colSpan={5} className="h-24 text-center">No applications found.</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          {/* --- END RESPONSIVE FIX --- */}
        </CardContent>
      </Card>

      <ApplicationDetailModal
        applicationId={selectedApplicationId}
        isOpen={!!selectedApplicationId}
        onClose={() => setSelectedApplicationId(null)}
        onStatusChange={handleStatusChange}
      />
    </>
  );
}