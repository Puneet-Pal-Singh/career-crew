// src/app/page.tsx

import HeroSection from '@/components/landing/hero';
import FeaturedCompaniesSection from '@/components/landing/FeaturedCompaniesSection';
import RecentJobsSection from '@/components/landing/recent-jobs';
import ValuePropositionSection from '@/components/landing/value-proposition';
import ValuePropositionSection2 from '@/components/landing/value-proposition/ForEmployersSection';
import StatsSection from '@/components/landing/stats';
import TestimonialsSection from '@/components/landing/testimonials';
import FinalCTASection from '@/components/landing/final-cta';

import { getTestimonialsData, getFeaturedCompaniesData } from '@/lib/data/landingContent';
import { createPageMetadata } from '@/lib/seo';

export const dynamic = 'force-dynamic';

export const metadata = createPageMetadata({
  title: 'Home',
  description: "CareerCrew Consulting connects top talent with innovative companies. Whether you're hiring or looking for your next role, we're here to help you succeed. 500+ companies trust us with 10,000+ successful placements.",
});

export default async function HomePage() {
  const testimonials = await getTestimonialsData();
  const allCompanies = await getFeaturedCompaniesData();
  const featuredCompanies = allCompanies.slice(0, 4);

  return (
    <>
      <HeroSection />
      <FeaturedCompaniesSection companies={featuredCompanies} />
      <RecentJobsSection />
      <ValuePropositionSection />
      <ValuePropositionSection2 />
      <StatsSection />
      <TestimonialsSection testimonials={testimonials} />
      <FinalCTASection />
    </>
  );
}