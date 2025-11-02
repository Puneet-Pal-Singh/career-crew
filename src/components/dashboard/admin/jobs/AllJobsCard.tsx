// src/components/dashboard/admin/jobs/AllJobsCard.tsx

import React from 'react';
import type { AdminJobRowData } from '@/types';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import AllJobsTableActions from './AllJobsTableActions';
import { getStatusBadgeVariant, formatStatusText } from '../shared/utils';

interface AllJobsCardProps {
  job: AdminJobRowData;
}

export default function AllJobsCard({ job }: AllJobsCardProps) {
  return (
    <Card className="p-4">
      <div className="flex justify-between items-start gap-4">
        <div className="flex-grow">
          <p className="font-semibold text-base leading-tight">{job.title}</p>
          <p className="text-sm text-muted-foreground mt-1">{job.companyName}</p>
          <p className="text-sm text-muted-foreground mt-2">Posted: {job.createdAt}</p>
        </div>
        <div className="flex-shrink-0 flex flex-col items-end gap-2">
          <Badge variant={getStatusBadgeVariant(job.status)} className="text-xs">
            {formatStatusText(job.status)}
          </Badge>
          <AllJobsTableActions job={job} />
        </div>
      </div>
    </Card>
  );
}