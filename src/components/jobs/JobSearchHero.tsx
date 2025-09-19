// src/components/jobs/JobSearchHero.tsx
"use client";

import React, { useState, useCallback, useMemo } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
// import { Button } from '@/components/ui/button';
import { Search, MapPin } from 'lucide-react';
import { debounce } from '@/lib/utils';

export default function JobSearchHero() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Local state for inputs, initialized from URL
  const [keyword, setKeyword] = useState(searchParams.get('query') || '');
  const [location, setLocation] = useState(searchParams.get('location') || '');

  // Stable callback to update URL
  const updateSearchParams = useCallback((newParams: { [key: string]: string | undefined }) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    Object.entries(newParams).forEach(([key, value]) => {
      if (value) {
        current.set(key, value);
      } else {
        current.delete(key);
      }
    });
    // Don't reset page number here, let the main filter component handle it if needed
    // or reset it always on any search change. Let's reset it.
    current.set('page', '1');
    router.push(`${pathname}?${current.toString()}`, { scroll: false });
  }, [searchParams, pathname, router]);

  // Debounced version for typing
  const debouncedUpdate = useMemo(() => {
    return debounce((params: { [key: string]: string | undefined }) => updateSearchParams(params), 500);
  }, [updateSearchParams]);

  const handleKeywordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);
    debouncedUpdate({ query: e.target.value });
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocation(e.target.value);
    debouncedUpdate({ location: e.target.value });
  };

  return (
    <div className="text-center py-8 sm:py-12 lg:py-20 px-4 sm:px-6 lg:px-8 rounded-xl 
                 bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 
                 dark:from-blue-900/50 dark:via-purple-900/50 dark:to-pink-900/50 
                 border dark:border-gray-800">
      <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tighter text-gray-900 dark:text-gray-100 leading-tight">
        Find what&apos;s next
      </h1>
      <p className="mt-3 sm:mt-4 text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto px-2 leading-relaxed">
        Your next career move, right here. Discover thousands of opportunities from top companies.
      </p>
      
      {/* Mobile-first search container */}
      <div className="mt-6 sm:mt-8 mx-auto max-w-3xl">
        {/* Mobile: Stacked layout */}
        <div className="flex flex-col gap-3 sm:hidden p-3 bg-white dark:bg-card rounded-2xl shadow-lg border">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              value={keyword}
              onChange={handleKeywordChange}
              placeholder="Job title, keyword, or company"
              className="w-full rounded-xl border-none pl-12 h-12 text-base focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>
          <div className="relative">
            <MapPin className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              value={location}
              onChange={handleLocationChange}
              placeholder="City, state, or remote"
              className="w-full rounded-xl border-none pl-12 h-12 text-base focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>
        </div>
        
        {/* Desktop: Side-by-side layout */}
        <div className="hidden sm:grid grid-cols-1 md:grid-cols-2 gap-4 items-center p-2 bg-white dark:bg-card rounded-full shadow-lg border">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              value={keyword}
              onChange={handleKeywordChange}
              placeholder="Job title, keyword, or company"
              className="w-full rounded-full border-none pl-12 h-12 text-base md:text-md focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>
          <div className="relative">
            <MapPin className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              value={location}
              onChange={handleLocationChange}
              placeholder="City, state, or remote"
              className="w-full rounded-full border-none pl-12 h-12 text-base md:text-md focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>
        </div>
      </div>
    </div>
  );
}