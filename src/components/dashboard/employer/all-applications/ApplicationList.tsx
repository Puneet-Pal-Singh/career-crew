// src/components/dashboard/employer/all-applications/ApplicationList.tsx
"use client";

import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from '@/components/ui/button';
import { type EmployerApplication } from '@/app/actions/employer/applications/getAllApplicationsAction';
import { 
  formatApplicationStatusDisplay, 
  getApplicationStatusBadgeVariant, // Keep the old one
  getApplicationStatusColorClasses // Import the new one
} from '@/components/dashboard/shared/utils';
import { Eye, Calendar } from 'lucide-react';

interface ApplicationListProps {
  applications: EmployerApplication[];
  onViewDetails: (applicationId: string) => void;
}

export const ApplicationList = ({ applications, onViewDetails }: ApplicationListProps) => {
  if (applications.length === 0) {
    return (
      <>
        <div className="hidden md:block">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="py-4 pl-6">Applicant</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Date Applied</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="pr-6 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                  No applications found for the selected filters.
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
        <div className="md:hidden text-center py-12 text-muted-foreground">
          No applications found for the selected filters.
        </div>
      </>
    );
  }

  return (
    <>
      {/* Desktop Table */}
      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 border-b">
              <TableHead className="py-4 pl-6">Applicant</TableHead>
              <TableHead>Position</TableHead>
              <TableHead><div className="flex items-center gap-2"><Calendar className="h-4 w-4" />Date Applied</div></TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="pr-6 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {applications.map((app) => {
              const variant = getApplicationStatusBadgeVariant(app.status);
              const colorClassName = getApplicationStatusColorClasses(app.status);
              const displayText = formatApplicationStatusDisplay(app.status);
              return (
                <TableRow key={app.id} onClick={() => onViewDetails(app.id)} className="cursor-pointer transition-colors hover:bg-muted/50">
                  <TableCell className="py-4 pl-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center font-semibold text-sm">
                        {app.applicantName.charAt(0).toUpperCase()}
                      </div>
                      <div className="font-semibold">{app.applicantName}</div>
                    </div>
                  </TableCell>
                  <TableCell>{app.jobTitle}</TableCell>
                  <TableCell>{app.appliedAt}</TableCell>
                  <TableCell>
                    <Badge variant={variant} className={`font-medium ${colorClassName}`}>
                      {displayText}
                    </Badge>
                  </TableCell>
                  <TableCell className="pr-6 text-right">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => { e.stopPropagation(); onViewDetails(app.id); }}>
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4 p-4">
        {applications.map((app) => {
          const variant = getApplicationStatusBadgeVariant(app.status);
          const colorClassName = getApplicationStatusColorClasses(app.status);
          const displayText = formatApplicationStatusDisplay(app.status);
          return (
            <div key={app.id} className="border rounded-lg p-4 space-y-3 cursor-pointer" onClick={() => onViewDetails(app.id)}>
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-semibold">
                    {app.applicantName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold">{app.applicantName}</p>
                    <p className="text-sm text-muted-foreground">{app.jobTitle}</p>
                  </div>
                </div>
                <Badge variant={variant} className={`font-medium ${colorClassName}`}>
                  {displayText}
                </Badge>
              </div>
              <div className="text-xs text-muted-foreground pt-2 border-t flex items-center gap-1.5"><Calendar className="h-3 w-3" />Applied on: {app.appliedAt}</div>
            </div>
          );
        })}
      </div>
    </>
  );
};