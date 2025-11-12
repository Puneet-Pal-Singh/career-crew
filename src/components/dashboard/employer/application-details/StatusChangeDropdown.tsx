// src/components/dashboard/employer/application-details/StatusChangeDropdown.tsx
"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ChevronDown } from 'lucide-react';
import { APPLICATION_STATUS_OPTIONS, type ApplicationStatusOption } from '@/types';
// Import our new, dedicated formatting function from its new shared location
import { formatApplicationStatusDisplay } from '@/components/dashboard/shared/utils';
import { COMING_SOON_APPLICATION_STATUSES } from '@/lib/constants';

interface StatusChangeDropdownProps {
  currentStatus: ApplicationStatusOption;
  isPending: boolean;
  onStatusChange: (newStatus: ApplicationStatusOption) => void;
}

export const StatusChangeDropdown = ({ currentStatus, isPending, onStatusChange }: StatusChangeDropdownProps) => {
  return (
    <TooltipProvider>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" disabled={isPending} className="w-[160px] justify-between">
            {/* Use the dedicated formatting function for the button text */}
            {formatApplicationStatusDisplay(currentStatus)}
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuLabel>Change Status</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {APPLICATION_STATUS_OPTIONS.map(status => {
            const isComingSoon = COMING_SOON_APPLICATION_STATUSES.includes(status); 
            const isDisabled = isPending || currentStatus === status || isComingSoon;

            // Handle the "Coming Soon" statuses with a disabled item and a tooltip
            if (isComingSoon) {
              return (
                <Tooltip key={status} delayDuration={100}>
                  <TooltipTrigger asChild>
                    {/* The div is necessary for the tooltip to work correctly on a disabled item */}
                    <div>
                      <DropdownMenuItem disabled className="justify-between">
                        {formatApplicationStatusDisplay(status)}
                        <span className="text-xs text-muted-foreground ml-2">Soon</span>
                      </DropdownMenuItem>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="right"><p>Full ATS features are coming soon!</p></TooltipContent>
                </Tooltip>
              );
            }

            // Handle the active, clickable statuses
            return (
              <DropdownMenuItem 
                key={status} 
                disabled={isDisabled}
                onClick={() => onStatusChange(status)}
              >
                {formatApplicationStatusDisplay(status)}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </TooltipProvider>
  );
};