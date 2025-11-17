// src/components/dashboard/seeker/my-applications/ApplicationStatusIndicator.tsx
"use client";

import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { getSeekerApplicationStatusType, getSeekerStatusAttributes } from '@/components/dashboard/shared/utils';
import type { ApplicationViewData } from "@/types";
import { cn } from "@/lib/utils";

interface ApplicationStatusIndicatorProps {
  application: ApplicationViewData;
}

export function ApplicationStatusIndicator({ application}: ApplicationStatusIndicatorProps) {
  // 1. Determine the status type from our business logic
  const statusType = getSeekerApplicationStatusType(application);
  
  // 2. Get all display attributes from our single source of truth
  const statusAttributes = getSeekerStatusAttributes(statusType);

  // 3. Handle the placeholder for the company name
  const description = statusAttributes.hoverDescription.replace(
    '{{companyName}}', 
    application.companyName
  );

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <div className="flex items-center gap-2 cursor-pointer">
          {/* The animated dot */}
          <span className={cn("h-2 w-2 rounded-full animate-pulse", statusAttributes.dotClassName)} />
          {/* The status text */}
          <span className={`font-medium ${statusAttributes.className}`}>
            {statusAttributes.text}
          </span>
        </div>
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="flex flex-col space-y-2">
          <h4 className="text-sm font-semibold">{statusAttributes.hoverTitle}</h4>
          <p className="text-sm text-muted-foreground">
            {description}
          </p>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}