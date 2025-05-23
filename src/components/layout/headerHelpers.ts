// src/components/layout/headerHelpers.ts
import { UserProfile } from "@/types"; // Assuming UserProfile is defined in types
import { LucideIcon, Search, Users, Briefcase, LayoutDashboard, Settings } from "lucide-react";
// import { ListChecks, FileClock } from "lucide-react"; // Assuming these icons are available
export interface NavLinkItem {
  href: string;
  label: string;
  icon?: LucideIcon;
  show: boolean; // To control visibility based on auth/role
  isPrimaryAction?: boolean; // Optional: for special styling like 'Sign Up' or 'Post a Job'
}

interface GetNavLinksParams {
  isAuthenticated: boolean;
  userProfile: UserProfile | null;
  isLoadingProfile: boolean; // To handle loading state for role-specific links
}

export const getNavigationLinks = ({
  isAuthenticated,
  userProfile,
  isLoadingProfile,
}: GetNavLinksParams): { mainNav: NavLinkItem[], authNav: NavLinkItem[], mobileAuthNav: NavLinkItem[] } => {
  
  const baseMainNavLinks: NavLinkItem[] = [
    { href: '/jobs', label: 'Browse Jobs', icon: Search, show: true },
    { href: '/#how-it-works', label: 'How It Works', icon: Users, show: true },
    { href: '/#features', label: 'Features', icon: Briefcase, show: true },
  ];

  const dynamicNavLinks: NavLinkItem[] = [];
  let postJobLink: NavLinkItem | null = null;

  if (isAuthenticated) {
    if (isLoadingProfile) {
      // Show a generic "Dashboard" link while profile is loading
      dynamicNavLinks.push({ href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, show: true });
    } else if (userProfile) {
      // All roles go to '/dashboard' for their main view; content there differentiates
      switch (userProfile.role) {
        case 'JOB_SEEKER':
          dynamicNavLinks.push({ href: '/dashboard', label: 'Seeker Dashboard', icon: LayoutDashboard, show: true });
          // You can add other seeker-specific HEADER links here if needed,
          // but main dashboard view is at /dashboard
          break;
        case 'EMPLOYER':
          dynamicNavLinks.push({ href: '/dashboard', label: 'Employer Dashboard', icon: LayoutDashboard, show: true });
          // Specific actions for employers can still have their own direct links
          postJobLink = { href: '/dashboard/post-job', label: 'Post a Job', icon: Briefcase, show: true, isPrimaryAction: true };
          // Link to their job listings (ensure this route exists)
          // dynamicNavLinks.push({ href: '/dashboard/my-jobs', label: 'My Listings', icon: ListChecks, show: true }); // Assuming ListChecks icon
          break;
        case 'ADMIN':
          dynamicNavLinks.push({ href: '/dashboard', label: 'Admin Panel', icon: Settings, show: true });
          // Specific admin pages can have direct links too
          // dynamicNavLinks.push({ href: '/dashboard/admin/pending-approvals', label: 'Pending Jobs', icon: FileClock, show: true }); // Assuming FileClock icon
          break;
        default:
          // Fallback if role is unknown, still point to /dashboard
          dynamicNavLinks.push({ href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, show: true });
      }
    } else {
      // Authenticated but profile somehow not found (e.g., error or still loading initially)
      // Point to /dashboard, where RoleSelection might appear if profile truly missing
      dynamicNavLinks.push({ href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, show: true });
    }
  }

  const mainNav = [...baseMainNavLinks, ...dynamicNavLinks];
  if (postJobLink) {
    mainNav.push(postJobLink); // Add Post a Job to main nav for employers
  }

  // Authentication related navigation (Login, Signup, Logout)
  const authNav: NavLinkItem[] = !isAuthenticated
    ? [
        { href: '/login', label: 'Login', show: true },
        { href: '/register', label: 'Sign Up', show: true, isPrimaryAction: true },
      ]
    : [
        // Logout is a button, handled separately in Header component
      ];
      
  const mobileAuthNav: NavLinkItem[] = !isAuthenticated
    ? [
        { href: '/login', label: 'Login', icon: Users /* Placeholder, use LogIn */, show: true },
        { href: '/register', label: 'Sign Up', icon: Briefcase /* Placeholder, use UserPlus */, show: true, isPrimaryAction: true },
      ]
    : [
        // Logout button handled separately
      ];


  return { 
    mainNav: mainNav.filter(link => link.show), 
    authNav: authNav.filter(link => link.show),
    mobileAuthNav: mobileAuthNav.filter(link => link.show),
  };
};