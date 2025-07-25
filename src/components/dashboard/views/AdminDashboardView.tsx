// src/components/dashboard/views/AdminDashboardView.tsx
"use client";

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

import type { UserProfile } from '@/types';

// Define the props the component now expects
interface AdminDashboardViewProps {
  profile: UserProfile;
}

export default function AdminDashboardView({ profile }: AdminDashboardViewProps) {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Welcome, {profile?.full_name || 'Admin'}.
        </p>
      </div>
      
      <div>
        <Button asChild>
          <Link href="/dashboard/admin/pending-approvals">
            Review Pending Job Approvals
          </Link>
        </Button>
      </div>
    </div>
  );
}