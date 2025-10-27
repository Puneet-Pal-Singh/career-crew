// src/components/dashboard/admin/CompanyDetailsModal.tsx
"use client";

import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { getEmployerProfileForAdminAction } from '@/app/actions/admin/getEmployerProfileForAdminAction';
import type { UserProfile } from '@/types';
import { Mail, User, Calendar, CheckCircle } from 'lucide-react';

interface CompanyDetailsModalProps {
  employerId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

// A reusable skeleton loader for the modal content
const ModalSkeleton = () => (
  <div className="space-y-4 pt-4">
    <div className="flex items-center space-x-4">
      <Skeleton className="h-16 w-16 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-4 w-48" />
      </div>
    </div>
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-4 w-3/4" />
  </div>
);

export default function CompanyDetailsModal({ employerId, isOpen, onClose }: CompanyDetailsModalProps) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch data only when the modal is opened with a valid ID
    if (isOpen && employerId) {
      setIsLoading(true);
      setError(null);
      setProfile(null);

      const fetchProfile = async () => {
        const result = await getEmployerProfileForAdminAction(employerId);
        if (result.success && result.profile) {
          setProfile(result.profile);
        } else {
          setError(result.error || "Failed to fetch profile.");
        }
        setIsLoading(false);
      };

      fetchProfile();
    }
  }, [isOpen, employerId]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Employer Details</DialogTitle>
          <DialogDescription>
            Full profile information for the selected employer.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          {isLoading && <ModalSkeleton />}
          
          {error && (
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {profile && (
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={profile.avatar_url ?? ''} alt={profile.full_name ?? 'Employer'} />
                  <AvatarFallback>{profile.full_name?.charAt(0) ?? 'E'}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-lg font-semibold">{profile.full_name || "Name not set"}</p>
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <Mail className="h-4 w-4" /> {profile.email}
                  </p>
                </div>
              </div>

              <div className="grid gap-2 text-sm">
                 <div className="flex items-center">
                   <User className="h-4 w-4 mr-2 text-muted-foreground" />
                   <span>Role: <Badge variant="secondary">{profile.role}</Badge></span>
                 </div>
                 <div className="flex items-center">
                   <CheckCircle className="h-4 w-4 mr-2 text-muted-foreground" />
                   <span>Onboarding Complete: <Badge variant={profile.has_completed_onboarding ? 'default' : 'destructive'}>{profile.has_completed_onboarding ? 'Yes' : 'No'}</Badge></span>
                 </div>
                 <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>Last Updated: {new Date(profile.updated_at).toLocaleDateString()}</span>
                 </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}