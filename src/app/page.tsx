// src/app/page.tsx
import AnimatedHeroSection from '@/components/landing/AnimatedHeroSection';
import AnimatedHowItWorksSection from '@/components/landing/AnimatedHowItWorksSection';
import FeaturesSection from '@/components/landing/FeaturesSection'; // NEW (or AnimatedFeaturesSection)
import FeaturedCompaniesSection from '@/components/landing/FeaturedCompaniesSection'; // NEW
import AnimatedTestimonialsSection from '@/components/landing/AnimatedTestimonialsSection';
import RecentJobsSection from '@/components/landing/RecentJobsSection'; // NEW
import AnimatedFinalCTASection from '@/components/landing/AnimatedFinalCTASection';

// Data fetching functions (can be in this file or moved to a lib/data.ts file)
import { getRecentJobsData } from '@/lib/data/jobs'; // Example: moved data fetching
import { 
  getFeaturesData, 
  getHowItWorksStepsData, 
  getFeaturedCompaniesData, 
  getTestimonialsData 
} from '@/lib/data/landingContent'; // Example: moved data fetching

export default async function HomePage() {
  // Fetch all necessary data concurrently
  const [
    recentJobs,
    features,
    howItWorksSteps,
    featuredCompanies,
    testimonials
  ] = await Promise.all([
    getRecentJobsData(),
    getFeaturesData(),
    getHowItWorksStepsData(),
    getFeaturedCompaniesData(),
    getTestimonialsData()
  ]);

  return (
    <>
      <AnimatedHeroSection />
      <AnimatedHowItWorksSection steps={howItWorksSteps} />
      <FeaturesSection features={features} /> 
      {/* Or <AnimatedFeaturesSection features={features} /> if it has top-level animations */}
      <FeaturedCompaniesSection companies={featuredCompanies} />
      <AnimatedTestimonialsSection testimonials={testimonials} />
      <RecentJobsSection jobs={recentJobs} />
      <AnimatedFinalCTASection />
      
      {/* TODO: Add new sections planned: */}
      {/* <StatsSection /> */}
      {/* <BlogPreviewSection /> */}
      {/* <ForJobSeekersSection /> */}
      {/* <ForEmployersSection /> */}
    </>
  );
}