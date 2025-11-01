// src/components/dashboard/admin/applications/job-applications-view/ApplicationsTable.tsx
'use client';

import React, { useState } from 'react';
import type { AdminApplicationForJob } from '@/types';
import { Table, TableBody, TableHeader, TableRow, TableHead, TableCaption } from "@/components/ui/table";
import { Card } from '@/components/ui/card';
import ApplicationsTableRow from './ApplicationsTableRow';
import ApplicationsCard from './ApplicationsCard';
import ApplicationDetailModal from './ApplicationDetailModal'; 

interface ApplicationsTableProps {
  applications: AdminApplicationForJob[];
}

export default function ApplicationsTable({ applications }: ApplicationsTableProps) {
  // 3. Add state to manage the selected application for the modal
  const [selectedApplicationId, setSelectedApplicationId] = useState<string | null>(null);

  const handleViewDetails = (applicationId: string) => {
    setSelectedApplicationId(applicationId);
  };

  const handleCloseModal = () => {
    setSelectedApplicationId(null);
  };
  return (
    <>
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
                  <ApplicationsTableRow 
                    key={app.applicationId} 
                    application={app}
                    onViewDetails={handleViewDetails} // <-- 4. Pass down the handler
                  />
                ))}
              </TableBody>
          </Table>
        </div>

        {/* MOBILE + TABLET VIEW */}
        <div className="md:hidden p-4 space-y-3">
          {applications.map((app) => (
            <ApplicationsCard 
              key={app.applicationId} 
              application={app}
              onViewDetails={handleViewDetails} // <-- 4. Pass down the handler
            />
          ))}
        </div>
      </Card>

     {/* 5. Render the modal and control it with our state */}
      <ApplicationDetailModal
        isOpen={!!selectedApplicationId}
        applicationId={selectedApplicationId}
        onClose={handleCloseModal}
      />
    </>
  );
}