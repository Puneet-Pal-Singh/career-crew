// src/components/dashboard/admin/applications/ApplicationsTableRow.tsx
'use client';

import React from 'react';
import type { AdminApplicationForJob } from '@/types';
import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { getApplicationStatusBadgeVariant, formatStatusText } from '@/components/dashboard/admin/shared/utils'; 
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';

interface ApplicationsTableRowProps {
  application: AdminApplicationForJob;
}

export default function ApplicationsTableRow({ application }: ApplicationsTableRowProps) {
  // TODO: Add onClick handler to open the detail modal
  const handleViewClick = () => {
    alert(`TODO: Open modal for application ID: ${application.applicationId}`);
  };

  return (
    <TableRow>
      <TableCell className="font-medium">{application.seekerFullName}</TableCell>
      <TableCell>{application.seekerEmail}</TableCell>
      <TableCell>
        <Badge variant={getApplicationStatusBadgeVariant(application.status)}>
            {formatStatusText(application.status)}
        </Badge>
      </TableCell>
      <TableCell>{application.dateApplied}</TableCell>
      <TableCell className="text-right">
        <Button variant="outline" size="sm" onClick={handleViewClick}>
          <Eye className="mr-2 h-4 w-4" /> View Details
        </Button>
      </TableCell>
    </TableRow>
  );
}