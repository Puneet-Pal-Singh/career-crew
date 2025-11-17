// src/hooks/useMyApplications.ts
"use client";

// This hook is now extremely simple. It primarily exists to match the
// architectural pattern, but could be removed entirely if no further
// client-side logic is anticipated for this feature.
import type { ApplicationViewData } from '@/types';

export function useMyApplications(initialApplications: ApplicationViewData[]) {
  // All filtering and search state has been removed.
  // The hook simply returns the data passed to it.
  const applications = initialApplications || [];

  return {
    // We return it as 'filteredApplications' to keep the component prop names consistent
    // in case we add a different kind of client-side logic later (e.g., sorting).
    filteredApplications: applications,
    totalApplications: applications.length,
  };
}