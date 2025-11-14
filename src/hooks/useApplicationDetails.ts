// src/hooks/useApplicationDetails.ts
"use client";

import { useState, useEffect, useRef } from 'react';
import { getApplicationDetailsAction, type ApplicationDetails } from '@/app/actions/employer/applications/getApplicationDetailsAction';
import { updateApplicationStatusAction } from '@/app/actions/employer/applications/updateApplicationStatusAction';
import type { ApplicationStatusOption } from '@/types';
import { toast } from 'sonner';

interface UseApplicationDetailsParams {
  applicationId: string | null;
  isOpen: boolean;
  onStatusChange: (applicationId: string, newStatus: ApplicationStatusOption) => void;
}

export function useApplicationDetails({ applicationId, isOpen, onStatusChange }: UseApplicationDetailsParams) {
  const [details, setDetails] = useState<ApplicationDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showUpdateSuccess, setShowUpdateSuccess] = useState(false);
  const [isRequestInFlight, setIsRequestInFlight] = useState(false);
  const successBannerTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // The useEffect for fetching data is clean and focused.
  useEffect(() => {
    if (isOpen && applicationId) {
      setIsLoading(true);
      setError(null);
      setDetails(null);

      getApplicationDetailsAction(applicationId)
        .then(result => {
          if (result.success && result.data) setDetails(result.data);
          else setError(result.error || 'An unknown error occurred.');
        })
        .finally(() => setIsLoading(false));
    }
  }, [isOpen, applicationId]);

  // The useEffect for timer cleanup is also self-contained.
  useEffect(() => {
    return () => {
      if (successBannerTimerRef.current) {
        clearTimeout(successBannerTimerRef.current);
      }
    };
  }, []);

  const handleViewResume = () => {
    if (!details || details.status !== 'SUBMITTED' || isRequestInFlight) return;

    setIsRequestInFlight(true);
    updateApplicationStatusAction(details.id, 'VIEWED')
      .then(updateResult => {
        if (updateResult.success) {
          setDetails(prev => prev ? { ...prev, status: 'VIEWED' } : null);
          onStatusChange(details.id, 'VIEWED');
        } else {
          toast.error(`Failed to auto-update status: ${updateResult.error}`);
        }
      })
      .catch((err) => toast.error(`Failed to auto-update status: ${err.message || 'A network error occurred.'}`))
      .finally(() => setIsRequestInFlight(false));
  };

  const handleStatusChange = (newStatus: ApplicationStatusOption) => {
  if (!details || details.status === newStatus || isRequestInFlight) return;

  setIsRequestInFlight(true);
  
  const statusUpdatePromise = updateApplicationStatusAction(details.id, newStatus);
  
  toast.promise(statusUpdatePromise, {
    loading: "Updating status...",
    success: (result) => {
      if (result.success) {
        setDetails(prev => prev ? { ...prev, status: newStatus } : null);
        onStatusChange(details.id, newStatus);

        if (successBannerTimerRef.current) clearTimeout(successBannerTimerRef.current);
        setShowUpdateSuccess(true);
        successBannerTimerRef.current = setTimeout(() => setShowUpdateSuccess(false), 3000);
        
        return result.message;
      } else {
        throw new Error(result.error);
      }
    },
    error: (err) => err.message,
  });
  
  // Chain finally on the original promise, not the toast return value
  statusUpdatePromise.finally(() => setIsRequestInFlight(false));
};

  // Expose a clean interface for the UI component to use.
  return {
    details,
    isLoading,
    error,
    isPending: isRequestInFlight,
    showUpdateSuccess,
    handleViewResume,
    handleStatusChange,
  };
}