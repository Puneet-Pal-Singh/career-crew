// src/components/dashboard/views/JobSeekerDashboardView.tsx
"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import StatCard from '@/components/dashboard/StatCard';
import { getSeekerDashboardStats } from '@/app/actions/seeker/getSeekerStatsAction';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Loader2, FileText, Bookmark, Briefcase as BriefcaseIcon } from 'lucide-react';

// This component is now self-contained and responsible for the Seeker's overview.
export default function JobSeekerDashboardView() {
  const [stats, setStats] = useState<{ totalApplications: number; activeApplications: number } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Data fetching logic is encapsulated here.
    async function fetchData() {
      setIsLoading(true);
      try {
        const result = await getSeekerDashboardStats();
        if (result.success && result.stats) {
          setStats(result.stats);
        } else {
          setError(result.error || "Failed to load dashboard stats.");
        }
      } catch (err) {
        setError("An unexpected error occurred.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Seeker Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Welcome back! Here&apos;s a summary of your job search activity.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatCard 
          title="Total Applications"
          value={isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : stats?.totalApplications ?? 0}
          icon={FileText}
          description="All applications you've ever submitted."
        />
        <StatCard 
          title="Active Applications"
          value={isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : stats?.activeApplications ?? 0}
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

      <Card>
        <CardHeader>
          <CardTitle>My Applications</CardTitle>
          <CardDescription>View and track all your submitted job applications and their current status.</CardDescription>
        </CardHeader>
        <CardFooter>
          <Button asChild>
            <Link href="/dashboard/seeker/applications">View All Applications</Link>
          </Button>
        </CardFooter>
      </Card>

      {error && <p className="text-destructive mt-4 text-sm">{error}</p>}
    </div>
  );
}