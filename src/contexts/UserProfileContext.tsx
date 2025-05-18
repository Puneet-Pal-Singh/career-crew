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
  email: string; // Email is NOT NULL in your DB schema
  full_name?: string | null;
  avatar_url?: string | null;
  role: UserRole; // Role is NOT NULL and defaults to 'JOB_SEEKER' in your DB schema
  // company_name?: string | null; 
}

interface UserProfileContextType {
  userProfile: UserProfile | null;
  isLoadingProfile: boolean;
  profileError: Error | null;
  refetchUserProfile: () => void;
  updateUserProfileRole: (userId: string, newRole: UserRole) => Promise<boolean>;
}

const UserProfileContext = createContext<UserProfileContextType | undefined>(undefined);

export const UserProfileProvider = ({ children }: { children: ReactNode }) => {
  const { user, isInitialized: authIsInitialized } = useAuth();

  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState<boolean>(true);
  const [profileError, setProfileError] = useState<Error | null>(null);

  const fetchUserProfile = useCallback(async (userId: string) => {
    if (!userId) {
      setUserProfile(null);
      setIsLoadingProfile(false);
      setProfileError(null);
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

      if (error && status !== 406) {
        throw error;
      }
      if (data) {
        console.log("UserProfileContext: Profile fetched:", data);
        setUserProfile(data as UserProfile);
      } else {
        console.log("UserProfileContext: No profile found for user", userId, "(This is expected if profile is created on first role selection).");
        setUserProfile(null);
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
    if (authIsInitialized && user?.id) {
      fetchUserProfile(user.id);
    } else if (authIsInitialized && !user) {
      setUserProfile(null);
      setIsLoadingProfile(false);
      setProfileError(null);
    }
  }, [user, authIsInitialized, fetchUserProfile]);

  const refetchUserProfile = useCallback(() => {
    if (user?.id) {
      fetchUserProfile(user.id);
    } else {
      // If no user, ensure profile state is cleared
      setUserProfile(null);
      setIsLoadingProfile(false);
      setProfileError(null);
    }
  }, [user, fetchUserProfile]);

  const updateUserProfileRole = async (userId: string, newRole: UserRole): Promise<boolean> => {
    // Ensure we have the authenticated user's email for the insert,
    // as 'email' is NOT NULL in your 'profiles' table.
    // 'user' object comes from useAuth() which should be up-to-date.
    if (!user?.email) {
      console.error("UserProfileContext: User email not available from AuthContext for profile upsert.");
      setProfileError(new Error("User email not available. Cannot update profile. Please try logging in again."));
      return false;
    }

    // We are about to attempt an operation, set loading true
    setIsLoadingProfile(true); // Or a more specific loading state like isUpdatingRole
    setProfileError(null);   // Clear previous errors

    try {
      const profileDataForUpsert = {
        id: userId,             // Primary key for matching
        email: user.email,      // Email is NOT NULL
        role: newRole,          // The new role to set
        updated_at: new Date().toISOString(), // Keep updated_at fresh
        // full_name and avatar_url are nullable and can be omitted here.
        // If they were previously set, upsert should preserve them if not specified,
        // depending on Supabase's default upsert behavior (usually `merge`).
      };

      console.log("UserProfileContext: Attempting to upsert profile:", profileDataForUpsert);

      const { error: upsertError } = await supabase
        .from('profiles')
        .upsert(profileDataForUpsert, {
          onConflict: 'id', // Use 'id' to determine conflict for upsert
          // `returning: 'minimal'` is default, no need to specify unless you want data back
        });

      if (upsertError) {
        console.error("UserProfileContext: Supabase upsert error:", upsertError.message);
        // It's good to throw the specific error for more detailed debugging
        throw upsertError;
      }

      // If upsert is successful
      if (typeof window !== 'undefined') {
        sessionStorage.setItem(`roleSelected_${userId}`, 'true');
      }
      
      console.log("UserProfileContext: Profile role upserted successfully for", userId, "to", newRole);
      // Crucially, refetch the profile to ensure the context state reflects the database,
      // including any default values that might have been applied on insert (though less relevant here since we specify role).
      refetchUserProfile(); 
      return true;

    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "An unexpected error occurred while updating/creating the user profile role.";
      console.error("UserProfileContext: updateUserProfileRole encountered an error:", message);
      setProfileError(new Error(message));
      // Since an error occurred, ensure loading state is reset if refetchUserProfile doesn't run or also errors.
      // refetchUserProfile itself sets isLoadingProfile to true then false.
      // If we land here, it means either upsert failed or refetch might have failed.
      setIsLoadingProfile(false); // Explicitly set loading to false on catch
      return false;
    }
    // No finally block needed for isLoadingProfile if try/catch and refetch manage it.
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