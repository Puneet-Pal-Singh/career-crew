// // src/components/dashboard/DashboardSidebar.tsx
// "use client";

// import React from 'react';
// import Link from 'next/link';
// import { usePathname } from 'next/navigation';
// import { useUserProfile } from '@/contexts/UserProfileContext';
// import { cn } from '@/lib/utils';
// import type { UserRole } from '@/types';
// import { 
//   LayoutDashboard, 
//   ListChecks, 
//   PlusCircle, 
//   FileText, 
//   ShieldCheck,
//   Briefcase // For the logo
// } from 'lucide-react';
// import { Skeleton } from '@/components/ui/skeleton'; // For loading state

// // Define the structure for a dashboard navigation link
// export interface DashboardNavLink {
//   href: string;
//   label: string;
//   icon: React.ElementType;
//   roles: UserRole[]; // Defines which roles see this link
// }

// // Export the config so mobile header (DashboardHeader) can use it.
// // This is our single source of truth for dashboard navigation.
// export const DASHBOARD_LINKS: DashboardNavLink[] = [
//   { href: "/dashboard", label: "Overview", icon: LayoutDashboard, roles: ["JOB_SEEKER", "EMPLOYER", "ADMIN"] },
//   // Seeker Links
//   { href: "/dashboard/seeker/applications", label: "My Applications", icon: FileText, roles: ["JOB_SEEKER"] },
  
//   // Employer Links
//   { href: "/dashboard/my-jobs", label: "My Jobs", icon: ListChecks, roles: ["EMPLOYER"] },
//   { href: "/dashboard/post-job", label: "Post a New Job", icon: PlusCircle, roles: ["EMPLOYER"] },
  
//   // Admin Links
//   { href: "/dashboard/admin/pending-approvals", label: "Pending Jobs", icon: ShieldCheck, roles: ["ADMIN"] },
// ];

// /**
//  * A reusable component that renders the actual navigation links.
//  * Used by both the desktop sidebar and the mobile sheet menu.
//  */
// export function DashboardSidebarNav() {
//   const pathname = usePathname();
//   const { userProfile, isLoadingProfile } = useUserProfile();

//   // If the profile is loading, show a skeleton state.
//   if (isLoadingProfile || !userProfile) {
//     return (
//       <div className="space-y-2 px-2">
//         <Skeleton className="h-9 w-full" />
//         <Skeleton className="h-9 w-5/6" />
//       </div>
//     );
//   }

//   // Filter links based on the current user's role
//   const availableLinks = DASHBOARD_LINKS.filter(link =>
//     link.roles.includes(userProfile.role)
//   );

//   return (
//     <>
//       {availableLinks.map((link) => {
//         // Active state logic: exact match for '/dashboard', startsWith for others
//         const isActive = link.href === '/dashboard' ? pathname === link.href : pathname.startsWith(link.href);
//         return (
//           <Link
//             key={link.href}
//             href={link.href}
//             className={cn(
//               "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
//               isActive && "bg-muted text-primary font-semibold"
//             )}
//           >
//             <link.icon className="h-4 w-4" />
//             {link.label}
//           </Link>
//         );
//       })}
//     </>
//   );
// }

// /**
//  * The main desktop sidebar component. It provides the overall structure and branding.
//  */
// export default function DashboardSidebar() {
//   return (
//     <aside className="flex h-full max-h-screen flex-col">
//       {/* Header section of the sidebar with logo */}
//       <div className="flex h-16 items-center border-b px-4">
//         <Link href="/" className="flex items-center gap-2 font-semibold">
//           <Briefcase className="h-6 w-6 text-primary" />
//           <span className="font-display text-xl font-bold">CareerCrew</span>
//         </Link>
//       </div>
//       {/* The navigation links rendered by the reusable nav component */}
//       {/* --- FIX IS HERE --- */}
//       {/* Remove 'grid' and 'items-start'. 'flex-1' is fine if you want the nav area to fill space,
//           but the content inside shouldn't be stretched. A simple div wrapper or just changing
//           the nav classes works well. */}
//       <nav className="flex-1 overflow-auto py-4 px-2">
//         <div className="grid gap-1 text-sm font-medium"> {/* Wrap nav items in a div */}
//           <DashboardSidebarNav />
//         </div>
//       </nav>
      
//       {/* Optional: Add a section at the bottom of the sidebar */}
//       {/* <div className="mt-auto p-4"> ... Settings or User Info ... </div> */}
//     </aside>
//   );
// }


// src/components/dashboard/DashboardSidebar.tsx
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import type { UserRole } from '@/types';
import { LayoutDashboard, ListChecks, PlusCircle, FileText, ShieldCheck, Briefcase } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export interface DashboardNavLink {
  href: string;
  label: string;
  icon: React.ElementType;
}

// FIX: Logic is moved outside the component into a pure function
const getNavLinksForRole = (role?: UserRole): DashboardNavLink[] => {
  switch (role) {
    case 'JOB_SEEKER':
      return [
        { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
        { href: "/dashboard/seeker/applications", label: "My Applications", icon: FileText },
      ];
    case 'EMPLOYER':
      return [
        { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
        { href: "/dashboard/my-jobs", label: "My Jobs", icon: ListChecks },
        { href: "/dashboard/post-job", label: "Post a New Job", icon: PlusCircle },
      ];
    case 'ADMIN':
      return [
        { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
        { href: "/dashboard/admin/pending-approvals", label: "Pending Jobs", icon: ShieldCheck },
      ];
    default:
      return []; // Return an empty array if role is undefined
  }
};

export function DashboardSidebarNav({ role }: { role?: UserRole }) {
  const pathname = usePathname();
  const availableLinks = getNavLinksForRole(role);

  if (!role) {
    return (
      <div className="space-y-2 px-2">
        <Skeleton className="h-9 w-full" />
        <Skeleton className="h-9 w-5/6" />
      </div>
    );
  }

  return (
    <>
      {availableLinks.map((link) => {
        const isActive = link.href === '/dashboard' ? pathname === link.href : pathname.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn("flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary", isActive && "bg-muted text-primary font-semibold")}
          >
            <link.icon className="h-4 w-4" />
            {link.label}
          </Link>
        );
      })}
    </>
  );
}

export default function DashboardSidebar({ role }: { role?: UserRole }) {
  return (
    <aside className="flex h-full max-h-screen flex-col">
      <div className="flex h-16 items-center border-b px-4">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Briefcase className="h-6 w-6 text-primary" />
          <span className="font-display text-xl font-bold">CareerCrew</span>
        </Link>
      </div>
      <nav className="flex-1 overflow-auto py-4 px-2">
        <div className="grid gap-1 text-sm font-medium">
          {/* FIX: Pass the role prop down to the Nav component */}
          <DashboardSidebarNav role={role} />
        </div>
      </nav>
    </aside>
  );
}