// src/components/dashboard/RoleSelection.tsx
"use client";

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserProfile, UserRole } from '@/contexts/UserProfileContext'; // UserProfile type also here
import { Button } from '@/components/ui/button';
import { Loader2, Briefcase, UserSearch } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function RoleSelection() {
  const { user } = useAuth();
  // isLoadingProfile from context can indicate if the profile is being fetched or updated
  const { updateUserProfileRole, isLoadingProfile: isProfileOperationPending } = useUserProfile(); 
  const [isSubmittingChoice, setIsSubmittingChoice] = useState(false); // Local state for button press
  const [error, setError] = useState<string | null>(null);

  const handleRoleSelect = async (selectedRole: UserRole) => {
    if (!user?.id) {
      setError("User not identified. Please try logging in again.");
      return;
    }
    // Basic validation, UserRole type handles allowed values
    if (selectedRole !== 'EMPLOYER' && selectedRole !== 'JOB_SEEKER' && selectedRole !== 'ADMIN') {
        setError("Invalid role selected.");
        return;
    }

    setIsSubmittingChoice(true); // Indicate this specific action is processing
    setError(null);
    
    // updateUserProfileRole now also sets 'has_made_role_choice' to true in the DB
    const success = await updateUserProfileRole(user.id, selectedRole);
    
    if (success) {
      console.log(`RoleSelection: Role chosen: ${selectedRole}. Profile updated in DB.`);
      // No sessionStorage needed. The UserProfileContext will refetch,
      // and DashboardPage will re-render based on the new 'has_made_role_choice' and 'role'.
    } else {
      // Error state is set by updateUserProfileRole in the context if it fails,
      // but we can also set a local error if needed, or rely on context's error.
      setError("Failed to update your role. Please try again or contact support.");
    }
    setIsSubmittingChoice(false);
  };

  const commonButtonProps = "w-full md:w-auto text-lg py-8 px-6";
  const commonIconProps = { size: 28, className: "mr-3" };
  const isLoading = isProfileOperationPending || isSubmittingChoice;

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] p-4"> {/* Adjust min-height */}
      <Card className="w-full max-w-2xl shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">Choose Your Primary Role</CardTitle>
          <CardDescription className="text-lg text-muted-foreground pt-2">
            How will you primarily use CareerCrew Consulting?
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
              disabled={isLoading}
            >
              <UserSearch {...commonIconProps} className="text-primary group-hover:scale-110 transition-transform"/>
              <span className="font-semibold">I&apos;m a Job Seeker</span>
              <span className="text-xs text-muted-foreground text-center px-2">Find my next career opportunity.</span>
              {isLoading && <Loader2 className="animate-spin h-5 w-5 mt-2" />}
            </Button>
            <Button
              variant="outline"
              className={`${commonButtonProps} flex flex-col h-auto items-center justify-center space-y-2 group hover:border-secondary hover:bg-secondary/5`}
              onClick={() => handleRoleSelect('EMPLOYER')}
              disabled={isLoading}
            >
              <Briefcase {...commonIconProps} className="text-secondary group-hover:scale-110 transition-transform"/>
              <span className="font-semibold">I&apos;m an Employer</span>
              <span className="text-xs text-muted-foreground text-center px-2">Hire top talent for my company.</span>
              {isLoading && <Loader2 className="animate-spin h-5 w-5 mt-2" />}
            </Button>
          </div>
          <p className="mt-8 text-xs text-center text-muted-foreground">
            This helps us tailor your experience. This choice is generally permanent.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}