// src/components/dashboard/admin/jobs/AllJobsTableRow.tsx

import React from 'react';
import type { AdminJobRowData } from '@/types';
import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import AllJobsTableActions from './AllJobsTableActions';
import { getStatusBadgeVariant, formatStatusText } from '../shared/utils';

interface AllJobsTableRowProps {
  job: AdminJobRowData;
}

export default function AllJobsTableRow({ job }: AllJobsTableRowProps) {
  return (
    <TableRow>
      <TableCell className="font-medium">{job.title}</TableCell>
      <TableCell>{job.companyName}</TableCell>
      <TableCell>
        <Badge variant={getStatusBadgeVariant(job.status)}>
          {formatStatusText(job.status)}
        </Badge>
      </TableCell>
      <TableCell>{job.createdAt}</TableCell>
      <TableCell className="text-right">
        <AllJobsTableActions job={job} />
      </TableCell>
    </TableRow>
  );
}