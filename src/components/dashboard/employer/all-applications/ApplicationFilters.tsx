// src/components/dashboard/employer/all-applications/ApplicationFilters.tsx
"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { type JobOption } from '@/app/actions/employer/jobs/getEmployerJobOptionsAction';
import { APPLICATION_STATUS_OPTIONS } from '@/types';
import { formatApplicationStatusDisplay } from '@/components/dashboard/shared/utils';
import { Filter } from 'lucide-react';
import { COMING_SOON_APPLICATION_STATUSES } from '@/lib/constants';

interface ApplicationFiltersProps {
  jobOptions: JobOption[];
  jobFilter: string;
  statusFilter: string;
  onJobFilterChange: (value: string) => void;
  onStatusFilterChange: (value: string) => void;
  onApplyFilters: () => void;
  isPending: boolean;
}

export const ApplicationFilters = ({
  jobOptions,
  jobFilter,
  statusFilter,
  onJobFilterChange,
  onStatusFilterChange,
  onApplyFilters,
  isPending
}: ApplicationFiltersProps) => {
  return (
    <Card className="shadow-sm">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-muted-foreground" />
          <CardTitle className="text-lg">Filters</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Filter by Job</label>
            <Select value={jobFilter} onValueChange={onJobFilterChange} disabled={isPending}>
              <SelectTrigger className="w-full"><SelectValue placeholder="All Jobs" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Jobs</SelectItem>
                {jobOptions.map(option => <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Filter by Status</label>
            <Select value={statusFilter} onValueChange={onStatusFilterChange} disabled={isPending}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                {/* Filter */}
                <SelectItem value="all">All Statuses</SelectItem>
                {APPLICATION_STATUS_OPTIONS.map(status => {
                  const isComingSoon = COMING_SOON_APPLICATION_STATUSES.includes(status);
                  return (
                    <SelectItem key={status} value={status} disabled={isComingSoon}>
                      <div className="flex justify-between items-center w-full">
                        {formatApplicationStatusDisplay(status)}
                        {isComingSoon && <span className="text-xs text-muted-foreground ml-2">Soon</span>}
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex justify-end mt-4">
          <Button onClick={onApplyFilters} disabled={isPending}>
            Apply Filters
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};