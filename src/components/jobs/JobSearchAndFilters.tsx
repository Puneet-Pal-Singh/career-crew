"use client";

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Search, XCircle, MapPin, Briefcase as BriefcaseIcon, Zap } from 'lucide-react';
import { JOB_TYPE_OPTIONS } from '@/lib/constants';
import type { FetchJobsParams, JobTypeOption } from '@/types';
import { debounce } from '@/lib/utils';

interface JobSearchAndFiltersProps {
  initialParams: FetchJobsParams;
}

const ALL_TYPES_FILTER_VALUE = "_ALL_TYPES_";

export default function JobSearchAndFilters({ initialParams }: JobSearchAndFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const getInitialJobType = () => {
    const type = initialParams.jobType;
    if (Array.isArray(type)) return type[0] as JobTypeOption | '' || '';
    return type || '';
  };
  
  const [searchTerm, setSearchTerm] = useState(initialParams.query || '');
  const [location, setLocation] = useState(initialParams.location ? String(initialParams.location) : '');
  const [jobType, setJobType] = useState<JobTypeOption | ''>(getInitialJobType());
  const [isRemote, setIsRemote] = useState(initialParams.isRemote === 'true');

  const updateSearchParams = useCallback((newParams: Partial<FetchJobsParams>) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    Object.entries(newParams).forEach(([key, value]) => {
      if (value !== undefined && value !== null && String(value).trim() !== '') {
        current.set(key, String(value));
      } else {
        current.delete(key);
      }
    });
    current.set('page', '1');
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
  
  const handleJobTypeChange = (selectedValue: string) => {
    const newJobTypeState = selectedValue === ALL_TYPES_FILTER_VALUE ? '' : selectedValue as JobTypeOption;
    setJobType(newJobTypeState);
    updateSearchParams({ jobType: newJobTypeState === '' ? undefined : newJobTypeState });
  };

  const handleIsRemoteChange = (checked: boolean | 'indeterminate') => {
    if (typeof checked !== 'boolean') return;
    setIsRemote(checked);
    updateSearchParams({ isRemote: checked ? 'true' : undefined }); 
  };

  const clearFilters = () => {
    setSearchTerm('');
    setLocation('');
    setJobType('');
    setIsRemote(false);
    updateSearchParams({ query: undefined, location: undefined, jobType: undefined, isRemote: undefined });
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
        {/* The rest of the JSX remains unchanged... */}
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
              value={jobType === '' ? ALL_TYPES_FILTER_VALUE : jobType}
              onValueChange={handleJobTypeChange}
            >
              <SelectTrigger id="job-type-select" className="pl-10">
                 <BriefcaseIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL_TYPES_FILTER_VALUE}>All Types</SelectItem>
                {JOB_TYPE_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
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