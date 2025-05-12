// src/components/dashboard/DashboardSidebar.tsx
'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Briefcase, FilePlus, Users, Settings, LogOut, UserCircle } from 'lucide-react';
import { UserRole } from '@prisma/client'; // <<<<<<<<<<< CORRECT: Import UserRole as a value

interface NavLink {
  href: string;
  label: string;
  icon: React.ElementType;
  allowedRoles: UserRole[]; // Use UserRole type from Prisma
  exactMatch?: boolean;
}

const DASHBOARD_BASE_PATH = '/dashboard';

const allNavLinks: NavLink[] = [
  { href: DASHBOARD_BASE_PATH, label: 'Overview', icon: LayoutDashboard, allowedRoles: [UserRole.JOB_SEEKER, UserRole.EMPLOYER, UserRole.ADMIN], exactMatch: true },
  // Employer Links
  { href: `${DASHBOARD_BASE_PATH}/my-jobs`, label: 'My Jobs', icon: Briefcase, allowedRoles: [UserRole.EMPLOYER] },
  { href: `${DASHBOARD_BASE_PATH}/post-job`, label: 'Post New Job', icon: FilePlus, allowedRoles: [UserRole.EMPLOYER] },
  // Seeker Links
  { href: `${DASHBOARD_BASE_PATH}/applied-jobs`, label: 'Applications', icon: Briefcase, allowedRoles: [UserRole.JOB_SEEKER] },
  { href: `${DASHBOARD_BASE_PATH}/profile`, label: 'My Profile', icon: UserCircle, allowedRoles: [UserRole.JOB_SEEKER] },
  // Admin Links
  { href: `${DASHBOARD_BASE_PATH}/manage-jobs`, label: 'Manage Jobs', icon: Settings, allowedRoles: [UserRole.ADMIN] },
  { href: `${DASHBOARD_BASE_PATH}/manage-users`, label: 'Manage Users', icon: Users, allowedRoles: [UserRole.ADMIN] },
];

interface DashboardSidebarProps {
  userRole: UserRole; // Use Prisma UserRole type
}

export default function DashboardSidebar({ userRole }: DashboardSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const filteredNavLinks = allNavLinks.filter(link => link.allowedRoles.includes(userRole));

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/auth/logout', { method: 'POST' });
      if (res.ok) {
        router.push('/login'); 
        router.refresh(); // Force a refresh to clear any client-side auth state
      } else {
        console.error('Logout failed');
        // TODO: Add user feedback for failed logout
      }
    } catch (error) {
      console.error('Logout error:', error);
      // TODO: Add user feedback for logout error
    }
  };

  return (
    <aside className="w-60 xl:w-64 bg-surface-light dark:bg-surface-dark border-r border-border-light dark:border-border-dark flex flex-col sticky top-0 h-screen">
      <div className="p-5 border-b border-border-light dark:border-border-dark flex items-center justify-center xl:justify-start">
        <Link href="/" className="flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7 text-primary dark:text-primary-dark">
            <path d="M12.378 1.602a.75.75 0 00-.756 0L3.32 6.026A.75.75 0 003 6.695V17.25a.75.75 0 00.75.75h16.5a.75.75 0 00.75-.75V6.695a.75.75 0 00-.32-.669L12.378 1.602zm0 2.23L19.5 7.23v9.72H4.5V7.23L11.622 3.832zM11.25 17.25V12h1.5v5.25h-1.5z" />
            <path d="M11.25 8.25V6.75a.75.75 0 01.75-.75h0a.75.75 0 01.75.75V8.25a.75.75 0 01-.75.75h0a.75.75 0 01-.75-.75z" />
          </svg>
          <span className="font-display text-xl xl:text-2xl font-bold text-primary dark:text-primary-dark hidden xl:inline">
            CareerCrew
          </span>
        </Link>
      </div>
      <nav className="flex-grow p-3 sm:p-4 space-y-1.5">
        {filteredNavLinks.map((link) => {
          const isActive = link.exactMatch ? pathname === link.href : pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150 ease-in-out
                ${isActive
                  ? 'bg-primary text-white dark:bg-primary-dark dark:text-gray-900 shadow-sm'
                  : 'text-subtle-light dark:text-subtle-dark hover:bg-primary/5 dark:hover:bg-primary-dark/10 hover:text-primary dark:hover:text-primary-dark'
                }`}
            >
              <link.icon size={18} className={isActive ? '' : 'opacity-80'} />
              <span>{link.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="p-3 sm:p-4 mt-auto border-t border-border-light dark:border-border-dark">
        <button
          onClick={handleLogout}
          className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium w-full
                     text-subtle-light dark:text-subtle-dark hover:bg-danger/10 dark:hover:bg-danger-dark/10 hover:text-danger dark:hover:text-danger-dark transition-colors duration-150 ease-in-out group"
        >
          <LogOut size={18} className="opacity-80 group-hover:opacity-100"/>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}