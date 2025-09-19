// src/app/actions/query/getUniqueJobLocationsAction.ts
"use server";

import { getSupabaseServerClient } from '@/lib/supabase/serverClient';
// 1. IMPORT the correct cache function from Next.js
import { unstable_cache as cache } from 'next/cache';

export const getUniqueJobLocationsAction = cache(
  async (): Promise<string[]> => {
    console.log("Fetching unique job locations from database...");
    try {
      const supabase = await getSupabaseServerClient();
      
      const { data, error } = await supabase
        .from('jobs')
        .select('location')
        .eq('status', 'APPROVED')
        // 2. ADD sorting at the database level
        .order('location', { ascending: true });

      if (error) {
        console.error("Error fetching job locations:", error);
        return [];
      }
      
      // The data is now pre-sorted. We just need to make it unique.
      const locations = data.map(item => item.location);
      return [...new Set(locations)];

    } catch (err) {
      console.error("Unexpected error in getUniqueJobLocationsAction:", err);
      return [];
    }
  },
  ['unique_job_locations'], // 3. ADD a cache key
  {
    revalidate: 3600, // Re-run this query at most once per hour
    tags: ['jobs-locations'], // Add a tag for on-demand revalidation in the future
  }
);