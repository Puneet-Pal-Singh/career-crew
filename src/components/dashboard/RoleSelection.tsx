// src/components/dashboard/RoleSelection.tsx
"use client";

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserProfile, UserRole } from '@/contexts/UserProfileContext';
import { Button } from '@/components/ui/button';
import { Loader2, Briefcase, UserSearch } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function RoleSelection() {
  const { user } = useAuth();
  const { updateUserProfileRole, isLoadingProfile } = useUserProfile();
  const [isUpdatingRole, setIsUpdatingRole] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRoleSelect = async (selectedRole: UserRole) => {
    if (!user?.id) {
      setError("User not identified. Please try logging in again.");
      return;
    }
    if (selectedRole !== 'EMPLOYER' && selectedRole !== 'JOB_SEEKER') {
        setError("Invalid role selected."); // Basic validation
        return;
    }

    setIsUpdatingRole(true);
    setError(null);
    
    const success = await updateUserProfileRole(user.id, selectedRole);
    
    if (success) {
      console.log(`RoleSelection: Role updated to ${selectedRole}. Profile will be refetched by context.`);
      // The UserProfileContext's updateUserProfileRole already calls refetchUserProfile.
      // The dashboard page will re-render based on the updated userProfile.
      if (typeof window !== 'undefined' && user?.id) {
        sessionStorage.setItem(`roleSelected_${user.id}`, 'true');
      }
    } else {
      setError("Failed to update role. Please try again.");
    }
    setIsUpdatingRole(false);
  };

  const commonButtonProps = "w-full md:w-auto text-lg py-8 px-6";
  const commonIconProps = { size: 28, className: "mr-3" };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-4">
      <Card className="w-full max-w-2xl shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">Choose Your Role</CardTitle>
          <CardDescription className="text-lg text-muted-foreground pt-2">
            How would you like to use CareerCrew Consulting?
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          {error && (
            <p className="mb-4 text-center text-sm text-destructive bg-destructive/10 p-3 rounded-md">
              {error}
            </p>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Button
              variant="outline"
              className={`${commonButtonProps} flex flex-col h-auto items-center justify-center space-y-2 group hover:border-primary hover:bg-primary/5`}
              onClick={() => handleRoleSelect('JOB_SEEKER')}
              disabled={isUpdatingRole || isLoadingProfile}
            >
              <UserSearch {...commonIconProps} className="text-primary group-hover:scale-110 transition-transform"/>
              <span className="font-semibold">I&apos;m a Job Seeker</span>
              <span className="text-xs text-muted-foreground text-center px-2">Find my next career opportunity.</span>
              {isUpdatingRole && <Loader2 className="animate-spin h-5 w-5 mt-2" />}
            </Button>
            <Button
              variant="outline"
              className={`${commonButtonProps} flex flex-col h-auto items-center justify-center space-y-2 group hover:border-secondary hover:bg-secondary/5`}
              onClick={() => handleRoleSelect('EMPLOYER')}
              disabled={isUpdatingRole || isLoadingProfile}
            >
              <Briefcase {...commonIconProps} className="text-secondary group-hover:scale-110 transition-transform"/>
              <span className="font-semibold">I&apos;m an Employer</span>
              <span className="text-xs text-muted-foreground text-center px-2">Hire top talent for my company.</span>
              {isUpdatingRole && <Loader2 className="animate-spin h-5 w-5 mt-2" />}
            </Button>
          </div>
          <p className="mt-8 text-xs text-center text-muted-foreground">
            You can typically change this later in your profile settings (feature coming soon).
          </p>
        </CardContent>
      </Card>
    </div>
  );
}