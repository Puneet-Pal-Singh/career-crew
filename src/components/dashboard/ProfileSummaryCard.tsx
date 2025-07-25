// src/components/dashboard/ProfileSummaryCard.tsx
import { Card, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Edit, Mail } from 'lucide-react';
import type { UserProfile } from '@/types';

// FIX: This component should only need the complete UserProfile object.
interface ProfileSummaryCardProps {
  profile: UserProfile | null;
}

export default function ProfileSummaryCard({ profile }: ProfileSummaryCardProps) {
  if (!profile) {
    return (
        <Card>
            <CardHeader className="items-center text-center p-6">
                <p className="text-muted-foreground">Profile not available.</p>
            </CardHeader>
        </Card>
    );
  }
  
  // FIX: Get ALL data from the single 'profile' prop.
  const displayName = profile.full_name || 'Welcome!';
  const userInitial = displayName.charAt(0) || profile.email.charAt(0) || 'U';

  return (
    <Card>
      <CardHeader className="items-center text-center p-6">
        <Avatar className="h-20 w-20 mb-2 border-2">
          <AvatarImage src={profile.avatar_url || ''} alt={profile.full_name || 'User Avatar'} />
          <AvatarFallback className="text-2xl">{userInitial.toUpperCase()}</AvatarFallback>
        </Avatar>
        <CardTitle>{displayName}</CardTitle>
        <CardDescription className="flex items-center gap-2">
            {/* FIX: Use the email from the profile object. */}
            <Mail className="h-3 w-3" /> {profile.email}
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