// src/app/dashboard/page.tsx
import React from 'react';
import DashboardPageClient from './DashboardPageClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard - CareerCrew',
  description: 'Manage your profile, job postings, and applications on CareerCrew.',
};

// This Server Component is the entry point for the /dashboard route.
// It delegates all client-side logic and rendering to DashboardPageClient.
export default function DashboardPage() {
  return <DashboardPageClient />;
}