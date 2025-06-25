// src/components/dashboard/views/AdminDashboardView.tsx
"use client";

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';

// Presentational component for the Admin overview.
export default function AdminDashboardView() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-1">Manage site settings, user roles, and job postings.</p>
      </div>

      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle>Pending Job Approvals</CardTitle>
          <CardDescription>Review and approve or reject new job submissions.</CardDescription>
        </CardHeader>
        <CardFooter>
          <Button variant="outline" asChild>
              <Link href="/dashboard/admin/pending-approvals">View Pending Jobs</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}