// src/components/dashboard/ProfileSummaryCard.tsx

// REMOVED: "use client" and all client-side hooks. This is now a simple presentational component.
import { Card, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Edit, Mail } from 'lucide-react';
import type { UserProfile } from '@/types';
import type { User } from '@supabase/supabase-js'; // Import the Supabase User type

// Define the props the component now expects
interface ProfileSummaryCardProps {
  user: User | null;
  profile: UserProfile | null;
}

export default function ProfileSummaryCard({ user, profile }: ProfileSummaryCardProps) {
  // We no longer need a loading skeleton here, as the parent server component handles loading.
  if (!profile || !user) {
    // This can be a simple fallback or null if the parent guarantees data
    return (
        <Card>
            <CardHeader className="items-center text-center p-6">
                <p className="text-muted-foreground">Profile not available.</p>
            </CardHeader>
        </Card>
    );
  }
  
  // Use the name from the profile, or a fallback "Welcome!" message
  const displayName = profile.full_name || 'Welcome!';
  const userInitial = displayName.charAt(0) || user.email?.charAt(0) || 'U';

  return (
    <Card>
      <CardHeader className="items-center text-center p-6">
        <Avatar className="h-20 w-20 mb-2 border-2">
          <AvatarImage src={profile.avatar_url || ''} alt={profile.full_name || 'User Avatar'} />
          <AvatarFallback className="text-2xl">{userInitial.toUpperCase()}</AvatarFallback>
        </Avatar>
        <CardTitle>{displayName}</CardTitle>
        <CardDescription className="flex items-center gap-2">
            <Mail className="h-3 w-3" /> {user.email}
        </CardDescription>
      </CardHeader>
      
      <CardFooter className="p-6 pt-0">
        <Button variant="outline" className="w-full" disabled>
          <Edit className="mr-2 h-4 w-4" />
          Edit Profile (soon)
        </Button>
      </CardFooter>
    </Card>
  );
}