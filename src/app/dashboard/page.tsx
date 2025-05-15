// src/app/dashboard/page.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard - CareerCrew Consulting',
  description: 'Your CareerCrew Consulting dashboard.',
};

export default function DashboardPage() {
  // This page will be protected by middleware.
  // We'll fetch user-specific data here later.
  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-4">Welcome to your Dashboard!</h1>
      <p className="text-muted-foreground">
        This is a placeholder for your dashboard content. We will build this out soon.
      </p>
      {/* We will add role-based views here */}
    </div>
  );
}
