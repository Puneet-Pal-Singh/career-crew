// src/components/jobs/JobFilterSidebar.tsx
"use client";

import React, { useCallback } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, SlidersHorizontal, Zap } from 'lucide-react';
import { JOB_TYPE_OPTIONS } from '@/lib/constants'; // <-- Import the new constant

// 1. ADD `onClose` to the props interface
interface JobFilterSidebarProps {
  onClose?: () => void;
  // ACCEPT the dynamic locations prop
  locations: string[];
}

export default function JobFilterSidebar({ onClose, locations }: JobFilterSidebarProps) {
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

    // 2. CLOSE THE SHEET (if in mobile view)
    onClose?.(); 
  };

  // A new function to apply filters and close the sheet
  const applyFiltersAndClose = () => {
    // The filters are already applied on every change, so this button just closes the sheet.
    onClose?.();
  };

  return (
    // <aside className="w-full lg:w-64 xl:w-72 flex-shrink-0">
      <div className="p-4 space-y-6 bg-background h-full flex flex-col">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold flex items-center">
            <SlidersHorizontal className="mr-2 h-5 w-5" />
            Filters
          </h3>
          {(selectedJobTypes.length > 0 || selectedLocations.length > 0 || isRemoteSelected) && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="text-xs h-auto p-1">Clear</Button>
          )}
        </div>
        

        <div className="flex-grow overflow-y-auto pr-2">
          <div className="space-y-6">
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
              {/* 3. MAP over the dynamic locations prop */}
              {locations.map(location => (
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
                {JOB_TYPE_OPTIONS.map(option => (
                  <div key={option.value} className="flex items-center">
                    <Checkbox 
                      id={`type-${option.value}`}
                      checked={selectedJobTypes.includes(option.value)}
                      onCheckedChange={(checked) => updateSearchParam('jobType', option.value, !!checked)}
                    />
                    <Label htmlFor={`type-${option.value}`} className="ml-2 font-normal cursor-pointer text-sm">
                      {option.label}
                    </Label>
                  </div>
                ))}
              </CollapsibleContent>
            </Collapsible>
          </div>
        </div>

        {/* 3. ADD A FOOTER with an Apply button for mobile view */}
        <div className="pt-4 border-t lg:hidden">
          <Button onClick={applyFiltersAndClose} className="w-full">
            Apply Filters
          </Button>
        </div>
      </div>
    // </aside>
  );
}