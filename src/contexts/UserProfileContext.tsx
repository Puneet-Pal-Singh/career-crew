// src/contexts/UserProfileContext.tsx
"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "./AuthContext"; // Import useAuth to get the authenticated user

// Re-define UserProfile types here or import from a shared types file
export type UserRole = 'JOB_SEEKER' | 'EMPLOYER' | 'ADMIN';
export interface UserProfile {
  id: string;
  updated_at: string;
  email: string;
  full_name?: string | null;
  avatar_url?: string | null;
  role: UserRole;
  // company_name?: string | null; 
}

interface UserProfileContextType {
  userProfile: UserProfile | null;
  isLoadingProfile: boolean;
  profileError: Error | null;
  refetchUserProfile: () => void; // Allow components to trigger a profile refresh
  updateUserProfileRole: (userId: string, newRole: UserRole) => Promise<boolean>; // Example update function
}

const UserProfileContext = createContext<UserProfileContextType | undefined>(undefined);

export const UserProfileProvider = ({ children }: { children: ReactNode }) => {
  const { user, isInitialized: authIsInitialized } = useAuth(); // Get user from AuthContext

  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState<boolean>(true); // Start true until first fetch attempt
  const [profileError, setProfileError] = useState<Error | null>(null);

  const fetchUserProfile = useCallback(async (userId: string) => {
    if (!userId) {
      setUserProfile(null);
      setIsLoadingProfile(false);
      return;
    }
    console.log("UserProfileContext: Fetching profile for user ID:", userId);
    setIsLoadingProfile(true);
    setProfileError(null);
    try {
      const { data, error, status } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error && status !== 406) { // 406: "Not Acceptable" - PostgREST returns this if .single() finds no rows
        throw error;
      }
      if (data) {
        console.log("UserProfileContext: Profile fetched:", data);
        setUserProfile(data as UserProfile);
      } else {
        console.log("UserProfileContext: No profile found for user", userId, "(This could be normal if profile is created on first role selection).");
        setUserProfile(null); // Explicitly set to null if no data
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Error fetching user profile.";
      console.error("UserProfileContext: fetchUserProfile error:", message);
      setProfileError(new Error(message));
      setUserProfile(null);
    } finally {
      setIsLoadingProfile(false);
    }
  }, []);

  useEffect(() => {
    // Fetch profile only when AuthContext is initialized and a user ID is available
    if (authIsInitialized && user?.id) {
      fetchUserProfile(user.id);
    } else if (authIsInitialized && !user) {
      // User logged out or no user session
      setUserProfile(null);
      setIsLoadingProfile(false); // No profile to load if no user
      setProfileError(null);
    }
  }, [user, authIsInitialized, fetchUserProfile]);

  const refetchUserProfile = useCallback(() => {
    if (user?.id) {
      fetchUserProfile(user.id);
    }
  }, [user, fetchUserProfile]);

  // Example function to update user role - this should ideally be a server action for security
  // This is a placeholder for how you might interact with profile updates
  const updateUserProfileRole = async (userId: string, newRole: UserRole): Promise<boolean> => {
    setIsLoadingProfile(true);
    try {
        const { error } = await supabase
            .from('profiles')
            .update({ role: newRole, updated_at: new Date().toISOString() })
            .eq('id', userId);
        if (error) throw error;

        // UX: If role selection is intended to be a one-time choice shown to default JOB_SEEKERs
        // you might set a flag here after they make *any* choice.
        if (typeof window !== 'undefined') {
          sessionStorage.setItem(`roleSelected_${userId}`, 'true');
        }
        
        refetchUserProfile(); // Re-fetch profile to get updated data
        console.log("UserProfileContext: Role updated successfully for", userId);
        return true;
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Error updating role.";
        console.error("UserProfileContext: updateUserProfileRole error:", message);
        setProfileError(new Error(message));
        setIsLoadingProfile(false);
        return false;
    }
  };

  return (
    <UserProfileContext.Provider value={{ userProfile, isLoadingProfile, profileError, refetchUserProfile, updateUserProfileRole }}>
      {children}
    </UserProfileContext.Provider>
  );
};

export const useUserProfile = (): UserProfileContextType => {
  const context = useContext(UserProfileContext);
  if (context === undefined) throw new Error("useUserProfile must be used within a UserProfileProvider");
  return context;
};