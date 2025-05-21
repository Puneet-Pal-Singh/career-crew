// src/contexts/UserProfileContext.tsx
"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "./AuthContext";

// Define UserRole and UserProfile (ensure UserProfile includes has_made_role_choice)
export type UserRole = 'JOB_SEEKER' | 'EMPLOYER' | 'ADMIN';
export interface UserProfile {
  id: string;
  updated_at: string;
  email: string;
  full_name?: string | null;
  avatar_url?: string | null;
  role: UserRole;
  has_made_role_choice: boolean; // This flag makes the role choice persistent
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
  // Start isLoadingProfile true only if auth is initialized and user exists, otherwise false.
  const [isLoadingProfile, setIsLoadingProfile] = useState<boolean>(false); 
  const [profileError, setProfileError] = useState<Error | null>(null);

  const clearProfileState = useCallback(() => {
    setUserProfile(null);
    setIsLoadingProfile(false);
    setProfileError(null);
  }, []);

  const fetchUserProfile = useCallback(async (userId: string) => {
    if (!userId) {
      clearProfileState();
      return;
    }
    // console.log("UserProfileContext: Fetching profile for user ID:", userId);
    setIsLoadingProfile(true);
    setProfileError(null); // Clear previous errors before fetching
    try {
      // Explicitly select all desired fields including the new 'has_made_role_choice'
      const { data, error, status } = await supabase
        .from('profiles')
        .select('id, updated_at, email, full_name, avatar_url, role, has_made_role_choice')
        .eq('id', userId)
        .single();

      if (error && status !== 406) { // 406: PostgREST "Not Acceptable" for .single() no rows
        throw error;
      }
      if (data) {
        // console.log("UserProfileContext: Profile fetched:", data);
        setUserProfile(data as UserProfile);
      } else {
        // console.log("UserProfileContext: No profile found for user", userId);
        // This case should be less common if the DB trigger creates a profile on signup.
        // If upsert in updateUserProfileRole creates it, this fetch might initially find nothing.
        setUserProfile(null); 
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Error fetching user profile.";
      console.error("UserProfileContext: fetchUserProfile error:", message);
      setProfileError(new Error(message));
      setUserProfile(null); // Ensure profile is null on error
    } finally {
      setIsLoadingProfile(false);
    }
  }, [clearProfileState]); // Added clearProfileState to dependencies

  useEffect(() => {
    if (authIsInitialized && user?.id) {
      // Only set loading true right before fetch if user exists
      setIsLoadingProfile(true); 
      fetchUserProfile(user.id);
    } else if (authIsInitialized && !user) {
      clearProfileState();
    }
    // If auth is not yet initialized, do nothing, wait for it.
    // isLoadingProfile will remain false until authIsInitialized and user exists.
  }, [user, authIsInitialized, fetchUserProfile, clearProfileState]);

  const refetchUserProfile = useCallback(() => {
    if (user?.id) {
      fetchUserProfile(user.id);
    } else {
      clearProfileState();
    }
  }, [user, fetchUserProfile, clearProfileState]);

  const updateUserProfileRole = async (userId: string, newRole: UserRole): Promise<boolean> => {
    if (!user?.email) {
      console.error("UserProfileContext: User email not available for profile upsert.");
      setProfileError(new Error("User context is not available. Please try logging in again."));
      return false;
    }

    setIsLoadingProfile(true); // Indicate an update operation is in progress
    setProfileError(null);

    try {
      const profileDataForUpsert = {
        id: userId,
        email: user.email, // Required as it's NOT NULL in your 'profiles' table
        role: newRole,
        has_made_role_choice: true, // Persistently mark that a role choice has been made
        updated_at: new Date().toISOString(),
      };

      // console.log("UserProfileContext: Attempting to upsert profile:", profileDataForUpsert);

      const { error: upsertError } = await supabase
        .from('profiles')
        .upsert(profileDataForUpsert, {
          onConflict: 'id', // Match based on the 'id' primary key
        });

      if (upsertError) {
        console.error("UserProfileContext: Supabase upsert error:", upsertError.message);
        throw upsertError; // Propagate the error
      }
      
      // console.log("UserProfileContext: Profile role upserted successfully for", userId, "to", newRole);
      // After successful upsert, refetch the profile to get the latest state from DB
      // (including the updated has_made_role_choice and role)
      refetchUserProfile(); 
      return true;

    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "An unexpected error occurred while updating profile role.";
      console.error("UserProfileContext: updateUserProfileRole error:", message);
      setProfileError(new Error(message));
      setIsLoadingProfile(false); // Reset loading state on error
      return false;
    }
    // `isLoadingProfile` will be set to false by `fetchUserProfile` called by `refetchUserProfile` on success,
    // or explicitly in the catch block on error.
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