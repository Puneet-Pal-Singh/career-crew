// src/contexts/UserProfileContext.tsx
"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
// FIX: Using the correct import path from YOUR file structure
import { supabase } from "@/lib/supabaseClient"; 
import { useAuth } from "@/lib/auth/contexts/AuthContext";
import type { UserProfile } from '@/types';

interface UserProfileContextType {
  userProfile: UserProfile | null;
  isLoadingProfile: boolean;
  profileError: Error | null;
}

const UserProfileContext = createContext<UserProfileContextType | undefined>(undefined);

export const UserProfileProvider = ({ children }: { children: ReactNode }) => {
  const { user, isInitialized: authIsInitialized } = useAuth();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [profileError, setProfileError] = useState<Error | null>(null);

  const fetchUserProfile = useCallback(async () => {
    if (!user) {
      setUserProfile(null);
      setIsLoadingProfile(false);
      return;
    }
    
    setIsLoadingProfile(true);
    setProfileError(null);
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, email, full_name, avatar_url, role, has_completed_onboarding')
        .eq('id', user.id)
        .single();

      if (error) {
        console.warn("UserProfileContext: Could not fetch profile (expected for new users).", error.message);
        setUserProfile(null); 
      } else {
        setUserProfile(data as UserProfile);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "A critical error occurred.";
      console.error("UserProfileContext: Caught exception:", message);
      setProfileError(new Error(message));
      setUserProfile(null);
    } finally {
      setIsLoadingProfile(false);
    }
  }, [user]);

  useEffect(() => {
    if (authIsInitialized) {
      fetchUserProfile();
    }
  }, [authIsInitialized, user, fetchUserProfile]);

  return (
    <UserProfileContext.Provider value={{ userProfile, isLoadingProfile, profileError }}>
      {children}
    </UserProfileContext.Provider>
  );
};

export const useUserProfile = (): UserProfileContextType => {
  const context = useContext(UserProfileContext);
  if (context === undefined) {
    throw new Error("useUserProfile must be used within a UserProfileProvider");
  }
  return context;
};