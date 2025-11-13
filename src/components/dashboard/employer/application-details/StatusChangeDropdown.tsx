"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ChevronDown, Edit2 } from 'lucide-react';
import { APPLICATION_STATUS_OPTIONS, type ApplicationStatusOption } from '@/types';
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
      <Tooltip delayDuration={100}>
        <TooltipTrigger asChild>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              {/* THE FIX: Apply the 'group' class here to enable group-hover */}
              <Button 
                variant="outline" 
                disabled={isPending} 
                // THE FIX: Replace fixed width with min-width and padding
                className="min-w-[160px] w-auto justify-between group px-3"
              >
                {/* This icon will now appear correctly on hover */}
                <Edit2 className="h-3 w-3 mr-2 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                
                {/* The text is in a span to control its layout */}
                <span className="flex-1 text-left">
                  {formatApplicationStatusDisplay(currentStatus)}
                </span>
                
                <ChevronDown className="ml-2 h-4 w-4 flex-shrink-0" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuLabel>Change Status</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {APPLICATION_STATUS_OPTIONS.map(status => {
                const isComingSoon = COMING_SOON_APPLICATION_STATUSES.includes(status);
                const isDisabled = isPending || currentStatus === status || isComingSoon;

                if (isComingSoon) {
                  return (
                    <Tooltip key={status} delayDuration={100}>
                      <TooltipTrigger asChild>
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
        </TooltipTrigger>
        <TooltipContent><p>Change Application Status</p></TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};