// src/app/dashboard/page.tsx
import { getSession, type Session } from '@/lib/auth'; // Import Session type
import { redirect } from 'next/navigation';
import { UserRole } from '@prisma/client'; // Import UserRole enum directly

// Import your role-specific dashboard view components
import EmployerDashboardView from './(employer)/_components/EmployerDashboardView';
// For now, define simple placeholders for other roles if their full components aren't ready
// import SeekerDashboardView from './(seeker)/_components/SeekerDashboardView';
// import AdminDashboardView from './(admin)/_components/AdminDashboardView';

// Simple placeholder for Seeker View
function SeekerDashboardPlaceholder({ userName }: { userName?: string }) {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-content-light dark:text-content-dark">Seeker Dashboard</h1>
      <p className="text-subtle-light dark:text-subtle-dark">Welcome, {userName || 'Job Seeker'}!</p>
      <p className="mt-4">Your personalized job seeking tools will appear here.</p>
    </div>
  );
}

// Simple placeholder for Admin View
function AdminDashboardPlaceholder({ userName }: { userName?: string }) {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-content-light dark:text-content-dark">Admin Dashboard</h1>
      <p className="text-subtle-light dark:text-subtle-dark">Welcome, {userName || 'Admin'}!</p>
      <p className="mt-4">Site administration tools and overview will appear here.</p>
    </div>
  );
}


export default async function DashboardPage() {
  const session: Session | null = await getSession();

  // Ensure user and role are present in the session
  if (!session?.user?.userId || !session.user.role) {
    redirect('/login?callbackUrl=/dashboard');
  }

  const userRole: UserRole = session.user.role; 
  const userName: string | undefined = session.user.name;

  // Render component based on user role
  switch (userRole) {
    case UserRole.EMPLOYER:
      return <EmployerDashboardView />;
    case UserRole.JOB_SEEKER: // Make sure 'JOB_SEEKER' matches your Prisma enum member
      // return <SeekerDashboardView />; 
      return <SeekerDashboardPlaceholder userName={userName} />;
    case UserRole.ADMIN:    // Make sure 'ADMIN' matches your Prisma enum member
      // return <AdminDashboardView />;
      return <AdminDashboardPlaceholder userName={userName} />;
    default:
      // Fallback for unknown roles or if a role doesn't have a specific dashboard view yet
      // This case should ideally not be reached if roles are well-defined
      console.warn(`DashboardPage: Unhandled user role - ${userRole}`);
      return (
        <div>
          <h1 className="text-2xl font-semibold text-content-light dark:text-content-dark">Dashboard Overview</h1>
          <p className="text-subtle-light dark:text-subtle-dark">Welcome, {userName || 'User'}!</p>
          <p className="text-subtle-light dark:text-subtle-dark">Your role: {userRole}</p>
          <p className="text-red-500 mt-4">Your dashboard view is not yet configured for this role.</p>
        </div>
      );
  }
}