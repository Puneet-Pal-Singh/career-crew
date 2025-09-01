// src/app/page.tsx

import HeroSection from '@/components/landing/hero';
import RecentJobsSection from '@/components/landing/recent-jobs';
import ValuePropositionSection from '@/components/landing/value-proposition';
// Assuming ValuePropositionSection2 is a temporary or alternate component
import ValuePropositionSection2 from '@/components/landing/value-proposition/ForEmployersSection';
import TestimonialsSection from '@/components/landing/testimonials';
import FinalCTASection from '@/components/landing/final-cta';

import { getTestimonialsData } from '@/lib/data/landingContent';

export default async function HomePage() {
  const testimonials = await getTestimonialsData();

  return (
    <>
      <HeroSection />
      {/* ✅ THE FIX: The component now fetches its own data, so we don't pass any props. */}
      <RecentJobsSection />
      <ValuePropositionSection />
      <ValuePropositionSection2 />
      <TestimonialsSection testimonials={testimonials} />
      <FinalCTASection />
    </>
  );
}