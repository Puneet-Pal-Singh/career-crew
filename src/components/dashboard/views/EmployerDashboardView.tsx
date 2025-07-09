// // src/components/dashboard/views/EmployerDashboardView.tsx
// "use client";

// import React from 'react';
// import Link from 'next/link';
// import { Button } from '@/components/ui/button';
// import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';

// // This is a presentational component. It could fetch stats in the future.
// export default function EmployerDashboardView() {
//   return (
//     <div className="space-y-8">
//       <div>
//         <h1 className="text-3xl font-bold text-foreground">Employer Dashboard</h1>
//         <p className="text-muted-foreground mt-1">Manage your job postings, review applications, and update company details.</p>
//       </div>
      
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         <Card className="hover:shadow-lg transition-shadow">
//           <CardHeader>
//             <CardTitle>Manage Job Postings</CardTitle>
//             <CardDescription>View, edit, or archive your current job listings.</CardDescription>
//           </CardHeader>
//           <CardFooter>
//             <Button variant="outline" asChild>
//               <Link href="/dashboard/my-jobs">View My Job Listings</Link>
//             </Button>
//           </CardFooter>
//         </Card>
//         <Card className="hover:shadow-lg transition-shadow">
//           <CardHeader>
//             <CardTitle>Post a New Job</CardTitle>
//             <CardDescription>Create and publish a new job opening to attract top talent.</CardDescription>
//           </CardHeader>
//           <CardFooter>
//             <Button asChild>
//               <Link href="/dashboard/post-job">Post New Job</Link>
//             </Button>
//           </CardFooter>
//         </Card>
//       </div>
//     </div>
//   );
// }

// src/components/dashboard/views/EmployerDashboardView.tsx
"use client";

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import type { User } from '@supabase/supabase-js';
import type { UserProfile } from '@/types';

// Define the props the component now expects
interface EmployerDashboardViewProps {
  user: User;
  profile: UserProfile;
}

export default function EmployerDashboardView({ profile }: EmployerDashboardViewProps) {
  const firstName = profile?.full_name?.split(' ')[0] || 'Employer';

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Employer Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Welcome, {firstName}! Manage your company&apos;s presence on CareerCrew.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle>Manage Job Postings</CardTitle>
            <CardDescription>View, edit, or archive your current job listings.</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button variant="outline" asChild>
              <Link href="/dashboard/my-jobs">View My Job Listings</Link>
            </Button>
          </CardFooter>
        </Card>
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle>Post a New Job</CardTitle>
            <CardDescription>Create a new job opening to attract top talent.</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button asChild>
              <Link href="/dashboard/post-job">Post New Job</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}