// src/components/dashboard/employer/application-details/ApplicationDetailSkeleton.tsx
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export const ApplicationDetailSkeleton = () => (
  <div className="space-y-6 p-4">
    <div className="space-y-2">
      <Skeleton className="h-4 w-1/4" />
      <Skeleton className="h-5 w-3/4" />
    </div>
    <div className="space-y-2">
      <Skeleton className="h-4 w-1/4" />
      <Skeleton className="h-5 w-1/2" />
    </div>
    <div className="space-y-2">
      <Skeleton className="h-4 w-1/4" />
      <Skeleton className="h-8 w-[160px]" />
    </div>
    <div className="space-y-2">
      <Skeleton className="h-4 w-1/4" />
      <Skeleton className="h-5 w-full" />
    </div>
  </div>
);