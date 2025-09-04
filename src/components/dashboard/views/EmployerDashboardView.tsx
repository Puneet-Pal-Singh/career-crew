// src/components/dashboard/views/EmployerDashboardView.tsx
"use client";

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { UserProfile } from '@/types';
import type { EmployerStats } from '@/app/actions/employer/getEmployerDashboardStatsAction';
import type { JobPerformanceData } from '@/app/actions/employer/getJobPerformanceAction';
import type { EmployerApplicationPreview } from '@/app/actions/employer/getEmployerRecentApplicationsAction';
import { Briefcase, Clock, Archive, ListChecks, PlusCircle, Users, TrendingUp, UserCheck } from 'lucide-react';

// The props interface is now updated to include all our data
interface EmployerDashboardViewProps {
  profile: UserProfile;
  stats: EmployerStats;
  jobPerformance: JobPerformanceData[];
  recentApplications: EmployerApplicationPreview[];
}

export default function EmployerDashboardView({ profile, stats, jobPerformance, recentApplications }: EmployerDashboardViewProps) {
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="hover:shadow-lg transition-shadow flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><ListChecks className="h-5 w-5" /><span>Manage Your Jobs</span></CardTitle>
            <CardDescription>View, edit, or archive your current job listings.</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow" />
          <div className="p-6 pt-0"><Button variant="outline" asChild className="w-full"><Link href="/dashboard/my-jobs">View My Jobs</Link></Button></div>
        </Card>
        <Card className="hover:shadow-lg transition-shadow flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><PlusCircle className="h-5 w-5" /><span>Create a New Job</span></CardTitle>
            <CardDescription>Post a new job opening to attract top talent.</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow" />
          <div className="p-6 pt-0"><Button asChild className="w-full"><Link href="/dashboard/post-job">Post a New Job</Link></Button></div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><UserCheck /> Recent Applications</CardTitle>
            <CardDescription>The latest candidates who applied to your positions.</CardDescription>
          </CardHeader>
          <CardContent>
            {recentApplications.length > 0 ? (
              <div className="space-y-4">
                {recentApplications.map((app) => (
                  <div key={app.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-semibold">{app.applicantName}</p>
                      <p className="text-sm text-muted-foreground">{app.jobTitle}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline" className="capitalize">{app.status.toLowerCase()}</Badge>
                      <p className="text-sm text-muted-foreground mt-1">{app.appliedAt}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-sm text-muted-foreground py-8">No recent applications found.</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><TrendingUp /> Job Performance</CardTitle>
            <CardDescription>A summary of your most recent job postings.</CardDescription>
          </CardHeader>
          <CardContent>
            {jobPerformance.length > 0 ? (
              <div className="space-y-4">
                {jobPerformance.map((job) => (
                  <div key={job.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-semibold">{job.title}</p>
                      <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1"><Users className="h-4 w-4" /> {job.applicationCount} Applications</p>
                    </div>
                    <Badge variant={job.status === 'APPROVED' ? 'default' : 'secondary'} className="capitalize">
                      {job.status.replace('_', ' ').toLowerCase()}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-sm text-muted-foreground py-8">You have no active or pending jobs to display.</div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}