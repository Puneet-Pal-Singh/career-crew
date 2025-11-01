// src/components/dashboard/admin/applications/ApplicationsCard.tsx
'use client';

import React from 'react';
import type { AdminApplicationForJob } from '@/types';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getApplicationStatusBadgeVariant, formatStatusText } from '@/components/dashboard/admin/shared/utils'; 
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';

interface ApplicationsCardProps {
  application: AdminApplicationForJob;
}

export default function ApplicationsCard({ application }: ApplicationsCardProps) {
  // TODO: Add onClick handler to open the detail modal
  const handleViewClick = () => {
    alert(`TODO: Open modal for application ID: ${application.applicationId}`);
  };

  return (
    <Card className="p-4 space-y-3">
      <div className="flex justify-between items-start">
        <div>
          <p className="font-semibold text-base leading-tight">{application.seekerFullName}</p>
          <p className="text-sm text-muted-foreground mt-1">{application.seekerEmail}</p>
        </div>
        <Badge variant={getApplicationStatusBadgeVariant(application.status)}> {/* <-- Use the new function */}
            {formatStatusText(application.status)}
        </Badge>
      </div>
      <div className="flex justify-between items-center text-sm text-muted-foreground">
        <span>Applied: {application.dateApplied}</span>
        <Button variant="outline" size="sm" onClick={handleViewClick}>
          <Eye className="mr-2 h-4 w-4" /> View
        </Button>
      </div>
    </Card>
  );
}