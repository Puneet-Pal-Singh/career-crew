// src/lib/data/jobs.ts
import type { JobCardData } from '@/types';

export async function getRecentJobsData(): Promise<JobCardData[]> {
  try {
    // Ensure NEXT_PUBLIC_APP_URL is set, especially for server-side fetching if it's an internal API route
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const res = await fetch(`${appUrl}/api/jobs/recent`, {
      // cache: 'no-store', // Or appropriate caching strategy
      next: { revalidate: 300 }, // Revalidate every 5 minutes
    });
    if (!res.ok) {
      console.error("Failed to fetch recent jobs:", res.status, await res.text());
      return [];
    }
    return res.json();
  } catch (error) {
    console.error("Error in getRecentJobsData:", error);
    return [];
  }
}
