// src/components/jobs/JobSearchAndFilters.tsx
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Search, XCircle, MapPin, Briefcase as BriefcaseIcon, Zap } from 'lucide-react';
import { jobTypeOptions } from '@/lib/formSchemas';
import type { FetchJobsParams, JobTypeOption } from '@/types';
import { debounce } from '@/lib/utils'; // Assuming debounce utility
import { useMemo } from 'react'; // Add useMemo

interface JobSearchAndFiltersProps {
  initialParams: FetchJobsParams;
}

const ALL_TYPES_FILTER_VALUE = "_ALL_TYPES_"; // Unique value for "All Types" option

export default function JobSearchAndFilters({ initialParams }: JobSearchAndFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Local state: '' for jobType means "All Types" internally
  const [searchTerm, setSearchTerm] = useState(initialParams.query || '');
  const [location, setLocation] = useState(initialParams.location || '');
  const [jobType, setJobType] = useState<JobTypeOption | ''>(initialParams.jobType || '');
  const [isRemote, setIsRemote] = useState(initialParams.isRemote === 'true');

  const updateSearchParams = useCallback((newParams: Partial<FetchJobsParams>) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    Object.entries(newParams).forEach(([key, value]) => {
      if (value !== undefined && value !== null && String(value).trim() !== '') {
        current.set(key, String(value));
      } else {
        current.delete(key); // Remove if value is empty/undefined/null
      }
    });
    current.set('page', '1'); // Reset page on filter change
    const queryStr = current.toString();
    router.push(`${pathname}${queryStr ? `?${queryStr}` : ''}`, { scroll: false });
  }, [searchParams, pathname, router]);

   const debouncedUpdateSearch = useMemo(() => {
    return debounce((params: Partial<FetchJobsParams>) => updateSearchParams(params), 500);
  }, [updateSearchParams]);
  
  const handleSearchTermChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchTerm = e.target.value;
    setSearchTerm(newSearchTerm);
    debouncedUpdateSearch({ query: newSearchTerm });
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newLocation = e.target.value;
    setLocation(newLocation);
    debouncedUpdateSearch({ location: newLocation });
  };
  
  // `value` from SelectItem will now be ALL_TYPES_FILTER_VALUE or a JobTypeOption
  const handleJobTypeChange = (selectedValue: string) => {
    const newJobTypeState = selectedValue === ALL_TYPES_FILTER_VALUE ? '' : selectedValue as JobTypeOption;
    setJobType(newJobTypeState); // Update local state ('' for all)
    // For URL params, if it's "All Types", send 'undefined' to remove the jobType filter
    updateSearchParams({ jobType: newJobTypeState === '' ? undefined : newJobTypeState });
  };

  const handleIsRemoteChange = (checked: boolean) => {
    setIsRemote(checked);
    // Send 'true' if checked, 'undefined' if unchecked (to remove param)
    updateSearchParams({ isRemote: checked ? 'true' : undefined }); 
  };

  const clearFilters = () => {
    setSearchTerm('');
    setLocation('');
    setJobType(''); // Reset local state to "All Types"
    setIsRemote(false);
    const params = new URLSearchParams();
    params.set('page', '1');
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };
  
  useEffect(() => {
    setSearchTerm(searchParams.get('query') || '');
    setLocation(searchParams.get('location') || '');
    setJobType((searchParams.get('jobType') as JobTypeOption) || '');
    setIsRemote(searchParams.get('isRemote') === 'true');
  }, [searchParams]);

  return (
    <div className="mb-10 p-6 bg-card border rounded-lg shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
        <div className="lg:col-span-2">
          <Label htmlFor="search-term" className="text-sm font-medium">Keywords</Label>
          <div className="relative mt-1">
            <Input id="search-term" type="text" value={searchTerm} onChange={handleSearchTermChange} placeholder="Job title, company, or skill" className="pl-10"/>
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          </div>
        </div>
        <div>
          <Label htmlFor="location" className="text-sm font-medium">Location</Label>
           <div className="relative mt-1">
            <Input id="location" type="text" value={location} onChange={handleLocationChange} placeholder="City, state, or zip code" className="pl-10"/>
            <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          </div>
        </div>
        <div>
          <Label htmlFor="job-type-select" className="text-sm font-medium">Job Type</Label>
          <div className="relative mt-1">
            <Select 
              value={jobType === '' ? ALL_TYPES_FILTER_VALUE : jobType} // Map internal '' state to select's "All Types" value
              onValueChange={handleJobTypeChange}
            >
              <SelectTrigger id="job-type-select" className="pl-10">
                 <BriefcaseIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL_TYPES_FILTER_VALUE}>All Types</SelectItem> {/* Use unique non-empty value */}
                {jobTypeOptions.map(type => (
                  <SelectItem key={type} value={type}>
                    {type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex flex-col md:flex-row md:items-end md:justify-between md:col-span-2 lg:col-span-4 gap-4 pt-4 md:pt-0">
            <div className="flex items-center space-x-2 self-start md:self-end">
                <Checkbox id="is-remote" checked={isRemote} onCheckedChange={handleIsRemoteChange}/>
                <Label htmlFor="is-remote" className="font-normal cursor-pointer flex items-center">
                    <Zap className="mr-2 h-4 w-4 text-primary" /> Remote Only
                </Label>
            </div>
            <Button variant="ghost" onClick={clearFilters} className="text-sm self-start md:self-end hover:bg-muted">
                <XCircle className="mr-2 h-4 w-4" /> Clear All Filters
            </Button>
        </div>
      </div>
    </div>
  );
}