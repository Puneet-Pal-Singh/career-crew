// src/app/actions/query/getUniqueJobLocationsAction.ts
"use server";

import { getSupabaseServerClient } from '@/lib/supabase/serverClient';
import { cache } from 'react';

/**
 * Fetches a unique, sorted list of all job locations for 'APPROVED' jobs.
 * This is cached to prevent redundant database calls.
 */
export const getUniqueJobLocationsAction = cache(async (): Promise<string[]> => {
  console.log("Fetching unique job locations from database...");
  try {
    const supabase = await getSupabaseServerClient();
    
    // Select only the 'location' column from approved jobs
    const { data, error } = await supabase
      .from('jobs')
      .select('location')
      .eq('status', 'APPROVED');

    if (error) {
      console.error("Error fetching job locations:", error);
      return [];
    }
    
    // The data is an array of objects: [{ location: 'New York' }, { location: 'London' }, ...]
    // We need to transform it into a unique, sorted array of strings.
    const locations = data.map(item => item.location);
    const uniqueLocations = [...new Set(locations)];
    
    return uniqueLocations.sort();

  } catch (err) {
    console.error("Unexpected error in getUniqueJobLocationsAction:", err);
    return [];
  }
});