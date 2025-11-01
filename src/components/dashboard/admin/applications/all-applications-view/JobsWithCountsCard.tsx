// src/components/dashboard/admin/applications/all-applications-view/JobsWithCountsCard.tsx
'use client';

import React from 'react';
import type { AdminJobWithApplicationCount } from '@/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Eye } from 'lucide-react';
import Link from 'next/link';

interface JobsWithCountsCardProps {
  job: AdminJobWithApplicationCount;
}

export default function JobsWithCountsCard({ job }: JobsWithCountsCardProps) {
  return (
    <Card className="p-4 space-y-3">
      <div>
        <p className="font-semibold text-base leading-tight">{job.jobTitle}</p>
        <p className="text-sm text-muted-foreground mt-1">{job.companyName}</p>
      </div>
      <div className="flex justify-between items-center">
        <div className="flex items-center text-sm text-muted-foreground">
          <Users className="mr-2 h-4 w-4" />
          <span>{job.applicationCount} {job.applicationCount === 1 ? 'Application' : 'Applications'}</span>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link href={`/dashboard/admin/applications/${job.jobId}`}>
            <Eye className="mr-2 h-4 w-4" /> View
          </Link>
        </Button>
      </div>
    </Card>
  );
}