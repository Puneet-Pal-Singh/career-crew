// src/app/employer/page.tsx
import ForEmployersSection from "@/components/landing/value-proposition/ForEmployersSection";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'For Employers - CareerCrew',
  description: 'Find the best talent to build your dream team. Post jobs and manage candidates with ease.',
};

// This can be expanded into a full-featured landing page for employers.
// For now, it re-uses the relevant section from the main landing page.
export default function EmployerPage() {
  return <ForEmployersSection />;
}