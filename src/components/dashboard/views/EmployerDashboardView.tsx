// src/components/dashboard/views/EmployerDashboardView.tsx
"use client";

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import type { UserProfile } from '@/types';
import type { EmployerStats } from '@/app/actions/employer/getEmployerDashboardStatsAction'; // Import the type
import { Briefcase, Clock, Archive, ListChecks, PlusCircle } from 'lucide-react';

// The component now expects the real stats object and the user profile
interface EmployerDashboardViewProps {
  profile: UserProfile;
  stats: EmployerStats;
}

export default function EmployerDashboardView({ profile, stats }: EmployerDashboardViewProps) {
  const firstName = profile?.full_name?.split(' ')[0] || 'Employer';

  const statCards = [
    { title: "Active Jobs", value: stats.activeJobs, icon: Briefcase, color: "text-green-500", bgColor: "bg-green-100" },
    { title: "Pending Approval", value: stats.pendingJobs, icon: Clock, color: "text-orange-500", bgColor: "bg-orange-100" },
    { title: "Archived Jobs", value: stats.archivedJobs, icon: Archive, color: "text-gray-500", bgColor: "bg-gray-100" },
    { title: "Total Jobs Posted", value: stats.totalJobs, icon: ListChecks, color: "text-blue-500", bgColor: "bg-blue-100" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Welcome back, {firstName}!</h1>
        <p className="text-muted-foreground mt-1">Here&apos;s a summary of your activity.</p>
      </div>

      {/* Quick Stats - Powered by REAL data */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="flex items-center justify-between p-6">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                <p className="text-3xl font-bold">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Core Actions - Simple and direct */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="hover:shadow-lg transition-shadow flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ListChecks className="h-5 w-5" />
              <span>Manage Your Jobs</span>
            </CardTitle>
            <CardDescription>View, edit, or archive your current job listings.</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow" />
          <div className="p-6 pt-0">
            <Button variant="outline" asChild className="w-full">
              <Link href="/dashboard/my-jobs">View My Jobs</Link>
            </Button>
          </div>
        </Card>
        
        <Card className="hover:shadow-lg transition-shadow flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PlusCircle className="h-5 w-5" />
              <span>Create a New Job</span>
            </CardTitle>
            <CardDescription>Post a new job opening to attract top talent.</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow" />
          <div className="p-6 pt-0">
            <Button asChild className="w-full">
              <Link href="/dashboard/post-job">Post a New Job</Link>
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
