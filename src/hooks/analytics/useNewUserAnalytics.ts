// src/hooks/analytics/useNewUserAnalytics.ts
"use client";

import { useEffect, useRef } from 'react';
import type { User } from '@supabase/supabase-js';
import posthog from 'posthog-js';

/**
 * A custom hook to track new user sign-up events in PostHog.
 * It ensures the event is fired only once for a newly authenticated user.
 * @param user - The user object from the Supabase session.
 * @param isInitialized - A boolean indicating if the auth state has been loaded.
 */
export function useNewUserAnalytics(user: User | null, isInitialized: boolean) {
  // Use a ref to ensure we only track the event once per component lifecycle
  const hasTrackedRef = useRef(false);

  useEffect(() => {
    // Only proceed if auth is ready, we have a user, and we haven't already tracked this event
    if (isInitialized && user && !hasTrackedRef.current) {
      
      // Heuristic to determine if this is a new user.
      // We check if the account was created within the last 60 seconds.
      const isNewUser = new Date().getTime() - new Date(user.created_at).getTime() < 60000;

      if (isNewUser) {
        console.log("New user detected, tracking sign-up event with PostHog.");
        hasTrackedRef.current = true; // Mark as tracked immediately
        
        const userRole = user.app_metadata?.role || 'unknown';
        
        // 1. Identify the user to enrich their profile in PostHog
        posthog.identify(
          user.id,
          {
            email: user.email,
            name: user.user_metadata?.full_name,
            role: userRole
          }
        );
        
        // 2. Capture the 'user_signed_up' event
        posthog.capture(
          'user_signed_up',
          {
            role: userRole
          }
        );
      }
    }
  }, [user, isInitialized]); // This effect re-runs when the auth state changes
}