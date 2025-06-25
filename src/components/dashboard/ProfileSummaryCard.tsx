// src/components/dashboard/ProfileSummaryCard.tsx
"use client";

import { useUserProfile } from '@/contexts/UserProfileContext';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Edit, Mail } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function ProfileSummaryCard() {
  const { user } = useAuth();
  const { userProfile, isLoadingProfile } = useUserProfile();

  if (isLoadingProfile || !userProfile || !user) {
    // Render a skeleton loader while profile data is loading
    return (
      <Card>
        <CardHeader className="items-center text-center p-6">
            <Skeleton className="h-20 w-20 rounded-full" />
            <Skeleton className="h-6 w-32 mt-4" />
            <Skeleton className="h-4 w-40 mt-2" />
        </CardHeader>
        <CardFooter className="p-6 pt-0">
            <Skeleton className="h-10 w-full" />
        </CardFooter>
      </Card>
    );
  }

  const userInitial = userProfile.full_name?.charAt(0) || user.email?.charAt(0) || 'U';

  return (
    <Card>
      <CardHeader className="items-center text-center p-6">
        <Avatar className="h-20 w-20 mb-2 border-2">
          <AvatarImage src={userProfile.avatar_url || ''} alt={userProfile.full_name || 'User Avatar'} />
          <AvatarFallback className="text-2xl">{userInitial.toUpperCase()}</AvatarFallback>
        </Avatar>
        <CardTitle>{userProfile.full_name || 'Welcome!'}</CardTitle>
        <CardDescription className="flex items-center gap-2">
            <Mail className="h-3 w-3" /> {user.email}
        </CardDescription>
      </CardHeader>
      
      {/* TODO: In V2, add Experience/Skills previews here */}
      
      <CardFooter className="p-6 pt-0">
        <Button variant="outline" className="w-full" disabled>
          <Edit className="mr-2 h-4 w-4" />
          Edit Profile (soon)
        </Button>
      </CardFooter>
    </Card>
  );
}