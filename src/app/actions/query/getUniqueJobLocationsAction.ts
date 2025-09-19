// src/app/actions/query/getUniqueJobLocationsAction.ts
"use server";

// 1. IMPORT our new, cache-safe client
import { getSupabaseServerClientCacheable } from '@/lib/supabase/serverClientCacheable'; 
import { unstable_cache as cache } from 'next/cache';

export const getUniqueJobLocationsAction = cache(
  async (): Promise<string[]> => {
    console.log("Fetching unique job locations from database (cacheable)...");
    try {
      // 2. USE the new client that does not depend on cookies
      const supabase = getSupabaseServerClientCacheable();
      
      const { data, error } = await supabase
        .from('jobs')
        .select('location')
        .eq('status', 'APPROVED')
        .order('location', { ascending: true });

      if (error) {
        console.error("Error fetching job locations:", error);
        return [];
      }
      
      const locations = data.map(item => item.location);
      return [...new Set(locations)];

    } catch (err) {
      console.error("Unexpected error in getUniqueJobLocationsAction:", err);
      return [];
    }
  },
  ['unique_job_locations'],
  {
    revalidate: 3600,
    tags: ['jobs-locations'],
  }
);