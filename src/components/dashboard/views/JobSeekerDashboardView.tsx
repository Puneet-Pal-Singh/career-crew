// // src/components/dashboard/views/JobSeekerDashboardView.tsx

// // REMOVED: "use client" and all hooks (useState, useEffect)
// import StatCard from '@/components/dashboard/StatCard';
// import { getSeekerDashboardStats } from '@/app/actions/seeker/getSeekerStatsAction';
// import { getRecentApplicationsAction } from '@/app/actions/seeker/getRecentApplicationsAction';
// import ProfileSummaryCard from '@/components/dashboard/ProfileSummaryCard';
// import RecentApplicationsPreview from '@/components/dashboard/seeker/RecentApplicationsPreview';
// import { FileText, Bookmark, Briefcase as BriefcaseIcon } from 'lucide-react';
// import type { UserProfile } from '@/types'; 
// import type { User } from '@supabase/supabase-js'; // We'll need the user object now

// // Define the shape of the props we're now expecting
// interface JobSeekerDashboardViewProps {
//   user: User | null; // Add user to the props
//   profile: UserProfile | null;
// }


// // The component is now an async function to allow `await` for data fetching
// export default async function JobSeekerDashboardView({ user, profile }: JobSeekerDashboardViewProps) {
//   // Fetch data directly on the server before rendering
//   const [statsData, recentAppsData] = await Promise.all([
//     getSeekerDashboardStats(),
//     getRecentApplicationsAction(),
//   ]);

//   // Extract data for easier access, with fallbacks for safety
//   const stats = statsData.success ? statsData.stats : { totalApplications: 0, activeApplications: 0 };
//   const applications = recentAppsData.success ? recentAppsData.applications : [];

//   // Replace the old one-liner with this robust logic.
//   let firstName = 'back'; // Start with the default fallback value.
//   // Check if profile and full_name exist and are not just empty whitespace.
//   if (profile && profile.full_name && profile.full_name.trim() !== '') {
//     firstName = profile.full_name.split(' ')[0];
//   }

//   return (
//     // Main layout grid: 2 columns on large screens, 1 column on smaller screens
//     <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      
//       {/* Main Content Column (spans 2/3 of the width on large screens) */}
//       <div className="lg:col-span-2 space-y-8">
//         {/* <div>
//           <h1 className="text-3xl font-bold text-foreground">Seeker Dashboard</h1>
//           <p className="text-muted-foreground mt-1">
//             Welcome back! Here&apos;s a summary of your job search activity.
//           </p>
//         </div> */}
//         {/* --- HEADLINE AND SUB-HEADLINE UPDATED HERE --- */}
//        <div>
//           <h1 className="text-3xl font-bold text-foreground">
//             Welcome, {firstName}!
//           </h1>
//           <p className="text-muted-foreground mt-1">
//             Ready to make your next move? Here&apos;s your progress so far.
//           </p>
//         </div>

//         {/* Stat Cards Grid */}
//         <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
//           <StatCard 
//             title="Total Applications"
//             value={stats?.totalApplications ?? 0}
//             icon={FileText}
//             description="All applications you've ever submitted."
//           />
//           <StatCard 
//             title="Active Applications"
//             value={stats?.activeApplications ?? 0}
//             icon={BriefcaseIcon}
//             description="Currently submitted or in review."
//           />
//           <StatCard 
//             title="Saved Jobs"
//             value={0}
//             icon={Bookmark}
//             description="Feature coming soon!"
//             className="opacity-60 cursor-not-allowed"
//           />
//         </div>

//         {/* New Recent Applications Preview Component */}
//         <RecentApplicationsPreview applications={applications || []} />

//         {/* Display errors if any fetching failed */}
//         {(!statsData.success || !recentAppsData.success) && 
//             <p className="text-destructive mt-4 text-sm">
//                 There was an issue loading some dashboard components.
//             </p>
//         }
//       </div>

//       {/* Right Sidebar Column */}
//       <div className="space-y-6">
//         {/* --- FIX: Pass user and profile props down to the card --- */}
//         <ProfileSummaryCard user={user} profile={profile} />
//       </div>
//     </div>
//   );
// }


// src/components/dashboard/views/JobSeekerDashboardView.tsx

import StatCard from '@/components/dashboard/StatCard';
import { getSeekerDashboardStats } from '@/app/actions/seeker/getSeekerStatsAction';
import { getRecentApplicationsAction } from '@/app/actions/seeker/getRecentApplicationsAction';
import ProfileSummaryCard from '@/components/dashboard/ProfileSummaryCard';
import RecentApplicationsPreview from '@/components/dashboard/seeker/RecentApplicationsPreview';
import { FileText, Bookmark, Briefcase as BriefcaseIcon } from 'lucide-react';
import type { UserProfile } from '@/types'; 
import type { User } from '@supabase/supabase-js';

// --- FIX: The props are now non-nullable as the parent page guarantees they exist ---
interface JobSeekerDashboardViewProps {
  user: User;
  profile: UserProfile;
}

// This component remains an async Server Component for data fetching
export default async function JobSeekerDashboardView({ user, profile }: JobSeekerDashboardViewProps) {
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
        <ProfileSummaryCard user={user} profile={profile} />
      </div>
    </div>
  );
}