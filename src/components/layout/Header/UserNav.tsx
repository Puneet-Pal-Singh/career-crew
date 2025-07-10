// // src/components/layout/Header/UserNav.tsx
// "use client";

// import React from 'react';
// import Link from 'next/link';
// import { useRouter } from 'next/navigation';
// import { useAuth } from '@/contexts/AuthContext';
// import { useUserProfile } from '@/contexts/UserProfileContext';
// import { Button } from '@/components/ui/button';
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { LayoutDashboard, LogOut, Settings} from 'lucide-react';
// import { Skeleton } from '@/components/ui/skeleton'; // For a better loading state

// export default function UserNav() {
//   const { user, signOut, isInitialized } = useAuth();
//   const { userProfile } = useUserProfile();
//   const router = useRouter();

//   const handleSignOut = async () => {
//     await signOut();
//     router.push('/'); // Redirect to homepage after sign out
//   };

//   // While auth state is initializing, show a skeleton loader to prevent layout shifts.
//   if (!isInitialized) {
//     return <Skeleton className="h-10 w-28 rounded-md" />;
//   }

//   // If user is not authenticated, show Login and Sign Up buttons.
//   if (!user) {
//     return (
//       <div className="flex items-center gap-2">
//         <Button variant="ghost" asChild>
//           <Link href="/login">Login</Link>
//         </Button>
//         <Button asChild>
//           <Link href="/register">Sign Up</Link>
//         </Button>
//       </div>
//     );
//   }

//   // If user is authenticated, show the profile dropdown menu.
//   const userInitial = userProfile?.full_name?.charAt(0) || user.email?.charAt(0) || 'U';

//   return (
//     <DropdownMenu>
//       <DropdownMenuTrigger asChild>
//         <Button variant="ghost" className="relative h-10 w-10 rounded-full">
//           <Avatar className="h-10 w-10 border-2 border-transparent hover:border-primary transition-colors">
//             <AvatarImage src={userProfile?.avatar_url || ''} alt={userProfile?.full_name || 'User avatar'} />
//             <AvatarFallback>{userInitial.toUpperCase()}</AvatarFallback>
//           </Avatar>
//         </Button>
//       </DropdownMenuTrigger>
//       <DropdownMenuContent className="w-56" align="end" forceMount>
//         <DropdownMenuLabel className="font-normal">
//           <div className="flex flex-col space-y-1">
//             <p className="text-sm font-medium leading-none">{userProfile?.full_name || 'Welcome'}</p>
//             <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
//           </div>
//         </DropdownMenuLabel>
//         <DropdownMenuSeparator />
//         <DropdownMenuItem asChild className="cursor-pointer">
//           <Link href="/dashboard">
//             <LayoutDashboard className="mr-2 h-4 w-4" />
//             <span>Dashboard</span>
//           </Link>
//         </DropdownMenuItem>
//         <DropdownMenuItem disabled className="cursor-not-allowed">
//           <Settings className="mr-2 h-4 w-4" />
//           <span>Settings</span>
//         </DropdownMenuItem>
//         <DropdownMenuSeparator />
//         <DropdownMenuItem onClick={handleSignOut} className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer">
//           <LogOut className="mr-2 h-4 w-4" />
//           <span>Log out</span>
//         </DropdownMenuItem>
//       </DropdownMenuContent>
//     </DropdownMenu>
//   );
// }


// src/components/layout/Header/UserNav.tsx
"use client";

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { User } from '@supabase/supabase-js';
import type { UserProfile } from '@/types';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LayoutDashboard, LogOut, Settings } from 'lucide-react';
// FIX: Using the correct import path from YOUR file structure
import { supabase } from '@/lib/supabaseClient'; 

// FIX: Define props to accept the user and profile objects from the server-hydrated Header.
interface UserNavProps {
  user: User;
  profile: UserProfile | null;
}

// FIX: The component now receives props and has NO internal data fetching hooks.
export default function UserNav({ user, profile }: UserNavProps) {
  const router = useRouter();

  const handleSignOut = async () => {
    // Use the imported supabase client for the sign-out operation
    await supabase.auth.signOut();
    router.push('/'); // Redirect to homepage after sign out
    router.refresh(); // Crucial for re-validating server components
  };

  // The logic is now much simpler. If this component renders, we know the user exists.
  const userInitial = profile?.full_name?.charAt(0) || user.email?.charAt(0) || 'U';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10 border-2 border-transparent hover:border-primary transition-colors">
            <AvatarImage src={profile?.avatar_url || ''} alt={profile?.full_name || 'User avatar'} />
            <AvatarFallback>{userInitial.toUpperCase()}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{profile?.full_name || 'Welcome'}</p>
            <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild className="cursor-pointer">
          <Link href="/dashboard">
            <LayoutDashboard className="mr-2 h-4 w-4" />
            <span>Dashboard</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem disabled className="cursor-not-allowed">
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut} className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}