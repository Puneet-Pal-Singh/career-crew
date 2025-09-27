// src/lib/dashboardNavLinks.ts
import { LayoutDashboard, ListChecks, PlusCircle, FileText, ShieldCheck, Users, Search } from 'lucide-react';
import type { UserRole } from '@/types';

// Define the structure for a dashboard navigation link
export interface DashboardNavLink {
  href: string;
  label: string;
  icon: React.ElementType;
}

// The single source of truth for all navigation links
export const getNavLinksForRole = (role?: UserRole): DashboardNavLink[] => {
  switch (role) {
    case 'JOB_SEEKER':
      return [
        { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
        { href: "/jobs", label: "Browse Jobs", icon: Search },
        { href: "/dashboard/seeker/applications", label: "My Applications", icon: FileText },
      ];
    case 'EMPLOYER':
      return [
        { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
        { href: "/dashboard/my-jobs", label: "My Jobs", icon: ListChecks },
        { href: "/dashboard/applications", label: "All Applications", icon: Users },
        { href: "/dashboard/post-job", label: "Post a New Job", icon: PlusCircle },
      ];
    case 'ADMIN':
      return [
        { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
        { href: "/dashboard/admin/pending-approvals", label: "Pending Jobs", icon: ShieldCheck },
      ];
    default:
      return []; // Return empty for unknown or loading roles
  }
};