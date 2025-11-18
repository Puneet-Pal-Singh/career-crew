// src/hooks/analytics/usePostHogIdentify.ts
"use client";

import { useEffect } from 'react';
import type { User } from '@supabase/supabase-js';
import posthog from 'posthog-js';
import type { UserRole } from '@/types';

/**
 * Custom hook to identify the authenticated user in PostHog.
 * This links the anonymous session (cookie) to the actual database User ID,
 * which is required for server-side events to match client-side pageviews in funnels.
 */
export function usePostHogIdentify(user: User | null, userRole: UserRole | null) {
  useEffect(() => {
    if (user && user.id) {
      posthog.identify(user.id, {
        email: user.email,
        role: userRole,
      });
    }
  }, [user, userRole]);
}