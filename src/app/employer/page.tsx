// src/app/employer/page.tsx
import ForEmployersSection from "@/components/landing/value-proposition/ForEmployersSection";
import { createPageMetadata } from '@/lib/seo';

export const metadata = createPageMetadata({
  title: 'For Employers',
  description: 'Find the best talent to build your dream team. Post jobs and manage candidates with ease. Join 500+ companies already using CareerCrew.',
  keywords: 'hire talent, post jobs, recruitment, employer services, find candidates, talent acquisition',
});

// This can be expanded into a full-featured landing page for employers.
// For now, it re-uses the relevant section from the main landing page.
export default function EmployerPage() {
  return <ForEmployersSection />;
}