// src/components/dashboard/views/JobSeekerDashboardView.tsx

import StatCard from '@/components/dashboard/StatCard';
import { getSeekerDashboardStats } from '@/app/actions/seeker/getSeekerStatsAction';
import { getRecentApplicationsAction } from '@/app/actions/seeker/getRecentApplicationsAction';
import ProfileSummaryCard from '@/components/dashboard/ProfileSummaryCard';
import RecentApplicationsPreview from '@/components/dashboard/seeker/RecentApplicationsPreview';
import { FileText, Bookmark, Briefcase as BriefcaseIcon } from 'lucide-react';
import type { UserProfile } from '@/types'; 

// --- FIX: The props are now non-nullable as the parent page guarantees they exist ---
interface JobSeekerDashboardViewProps {
  profile: UserProfile;
}

// This component remains an async Server Component for data fetching
export default async function JobSeekerDashboardView({ profile }: JobSeekerDashboardViewProps) {
  // Fetch dashboard-specific data
  const [statsData, recentAppsData] = await Promise.all([
    getSeekerDashboardStats(),
    getRecentApplicationsAction(),
  ]);

  const stats = statsData.success ? statsData.stats : { totalApplications: 0, activeApplications: 0 };
  const applications = recentAppsData.success ? recentAppsData.applications : [];

  // Safely extract the first name from the guaranteed profile prop
  const firstName = profile.full_name?.split(' ')[0] || 'back';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Main Content Column */}
      <div className="lg:col-span-2 space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Welcome, {firstName}!
          </h1>
          <p className="text-muted-foreground mt-1">
            Ready to make your next move? Here’s your progress so far.
          </p>
        </div>

        {/* Stat Cards Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <StatCard 
            title="Total Applications"
            value={stats?.totalApplications ?? 0}
            icon={FileText}
            description="All applications you've ever submitted."
          />
          <StatCard 
            title="Active Applications"
            value={stats?.activeApplications ?? 0}
            icon={BriefcaseIcon}
            description="Currently submitted or in review."
          />
          <StatCard 
            title="Saved Jobs"
            value={0}
            icon={Bookmark}
            description="Feature coming soon!"
            className="opacity-60 cursor-not-allowed"
          />
        </div>

        {/* Recent Applications Preview */}
        <RecentApplicationsPreview applications={applications || []} />

        {/* Error display for data fetching */}
        {(!statsData.success || !recentAppsData.success) && 
            <p className="text-destructive mt-4 text-sm">
                There was an issue loading some dashboard components.
            </p>
        }
      </div>

      {/* Right Sidebar Column */}
      <div className="space-y-6">
        {/* Pass the non-nullable props down to the summary card */}
        <ProfileSummaryCard profile={profile} />
      </div>
    </div>
  );
}