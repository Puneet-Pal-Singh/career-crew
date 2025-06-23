// src/components/jobs/JobFilterSidebar.tsx
"use client";

import React, { useCallback } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, SlidersHorizontal, Zap } from 'lucide-react';
import { jobTypeOptions } from '@/lib/formSchemas';

const locationOptions = ["New York, NY", "San Francisco, CA", "London", "Berlin", "Delhi"]; // Static for MVP

export default function JobFilterSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Get current filter values from URL for checkbox state
  const selectedJobTypes = searchParams.getAll('jobType');
  const selectedLocations = searchParams.getAll('location');
  const isRemoteSelected = searchParams.get('isRemote') === 'true';

  // Memoized callback to update URL search params
  const updateSearchParam = useCallback((filterName: string, value: string, isChecked: boolean) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    const allValues = current.getAll(filterName);

    if (isChecked) {
      // Add the value if it's not already there
      if (!allValues.includes(value)) {
        current.append(filterName, value);
      }
    } else {
      // Remove the value by filtering and re-setting the param
      const newValues = allValues.filter(v => v !== value);
      current.delete(filterName);
      if (newValues.length > 0) {
        newValues.forEach(v => current.append(filterName, v));
      }
    }

    current.set('page', '1'); // Reset page on any filter change
    router.push(`${pathname}?${current.toString()}`, { scroll: false });
  }, [searchParams, pathname, router]);


  const handleRemoteChange = (checked: boolean | 'indeterminate') => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    if (checked) {
      current.set('isRemote', 'true');
    } else {
      current.delete('isRemote');
    }
    current.set('page', '1');
    router.push(`${pathname}?${current.toString()}`, { scroll: false });
  };
  
  const clearFilters = () => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    current.delete('jobType');
    current.delete('location');
    current.delete('isRemote');
    router.push(`${pathname}?${current.toString()}`, { scroll: false });
  };

  return (
    <aside className="w-full lg:w-64 xl:w-72 flex-shrink-0">
      <div className="sticky top-24 p-4 space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold flex items-center">
            <SlidersHorizontal className="mr-2 h-5 w-5" />
            Filters
          </h3>
          {(selectedJobTypes.length > 0 || selectedLocations.length > 0 || isRemoteSelected) && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="text-xs h-auto p-1">Clear</Button>
          )}
        </div>
        
        <div className="flex items-center space-x-2 border-b pb-4">
            <Checkbox
              id="is-remote-filter"
              checked={isRemoteSelected}
              onCheckedChange={handleRemoteChange}
            />
            <Label htmlFor="is-remote-filter" className="font-semibold cursor-pointer flex items-center">
                <Zap className="mr-2 h-4 w-4 text-primary" /> Remote Only
            </Label>
        </div>

        <Collapsible defaultOpen={true}>
          <CollapsibleTrigger className="flex justify-between items-center w-full font-semibold text-md py-2 text-left">
            LOCATION <ChevronDown className="h-4 w-4 transition-transform [&[data-state=open]]:rotate-180" />
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-3 pt-2">
            {locationOptions.map(location => (
              <div key={location} className="flex items-center">
                <Checkbox 
                  id={`loc-${location}`}
                  checked={selectedLocations.includes(location)}
                  onCheckedChange={(checked) => updateSearchParam('location', location, !!checked)}
                />
                <Label htmlFor={`loc-${location}`} className="ml-2 font-normal cursor-pointer text-sm">
                  {location}
                </Label>
              </div>
            ))}
          </CollapsibleContent>
        </Collapsible>

        <Collapsible defaultOpen={true}>
          <CollapsibleTrigger className="flex justify-between items-center w-full font-semibold text-md py-2 text-left">
            JOB TYPE <ChevronDown className="h-4 w-4 transition-transform [&[data-state=open]]:rotate-180" />
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-3 pt-2">
            {jobTypeOptions.map(type => (
              <div key={type} className="flex items-center">
                <Checkbox 
                  id={`type-${type}`}
                  checked={selectedJobTypes.includes(type)}
                  onCheckedChange={(checked) => updateSearchParam('jobType', type, !!checked)}
                />
                <Label htmlFor={`type-${type}`} className="ml-2 font-normal cursor-pointer text-sm">
                  {type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </Label>
              </div>
            ))}
          </CollapsibleContent>
        </Collapsible>
      </div>
    </aside>
  );
}