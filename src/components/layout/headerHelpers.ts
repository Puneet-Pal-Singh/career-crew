// src/components/layout/headerHelpers.ts
import { UserRole, UserProfile } from "@/contexts/UserProfileContext"; // Assuming types are exported
import { LucideIcon, Search, Users, Briefcase, LayoutDashboard, Settings, BarChart2 } from "lucide-react";

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

  let dynamicNavLinks: NavLinkItem[] = [];
  let postJobLink: NavLinkItem | null = null;

  if (isAuthenticated) {
    if (isLoadingProfile) {
      // Show a generic "Dashboard" while profile is loading
      dynamicNavLinks.push({ href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, show: true });
    } else if (userProfile) {
      switch (userProfile.role) {
        case 'JOB_SEEKER':
          dynamicNavLinks.push({ href: '/dashboard/seeker', label: 'Seeker Hub', icon: BarChart2, show: true });
          break;
        case 'EMPLOYER':
          dynamicNavLinks.push({ href: '/dashboard/employer', label: 'Employer Hub', icon: BarChart2, show: true });
          postJobLink = { href: '/dashboard/post-job', label: 'Post a Job', icon: Briefcase, show: true, isPrimaryAction: true };
          break;
        case 'ADMIN':
          dynamicNavLinks.push({ href: '/dashboard/admin', label: 'Admin Panel', icon: Settings, show: true });
          // Admin might also be able to post a job or have other specific links
          break;
        default:
          dynamicNavLinks.push({ href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, show: true });
      }
    } else {
      // Authenticated but profile not found (should be rare with trigger)
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