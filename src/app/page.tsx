// src/app/page.tsx
import AnimatedHeroSection from '@/components/landing/AnimatedHeroSection';
import AnimatedHowItWorksSection from '@/components/landing/AnimatedHowItWorksSection';
// import FeaturesSection from '@/components/landing/FeaturesSection'; // OLD (or AnimatedFeaturesSection)
import AnimatedFeaturesSection from '@/components/landing/AnimatedFeaturesSection';
// import FeaturedCompaniesSection from '@/components/landing/FeaturedCompaniesSection'; // OLD
import AnimatedFeaturedCompanies from '@/components/landing/AnimatedFeaturedCompanies'; // NEW
import AnimatedTestimonialsSection from '@/components/landing/AnimatedTestimonialsSection';
// import RecentJobsSection from '@/components/landing/RecentJobsSection'; // OLD
import AnimatedRecentJobsSection from '@/components/landing/AnimatedRecentJobsSection'; // NEW
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
      {/* <FeaturesSection features={features} />  */} {/* OLD */}
      <AnimatedFeaturesSection features={features} /> {/* NEW animated component*/}
      {/* <FeaturedCompaniesSection companies={featuredCompanies} /> */}  {/* OLD */}
      <AnimatedFeaturedCompanies companies={featuredCompanies} /> {/* NEW animated component*/}
      {/* <TestimonialsSection testimonials={testimonials} /> */}  {/* OLD */}
      <AnimatedTestimonialsSection testimonials={testimonials} /> {/* NEW animated component*/}
      {/* <RecentJobsSection jobs={recentJobs} /> */} {/* OLD */}
      <AnimatedRecentJobsSection jobs={recentJobs} /> {/* USE NEW COMPONENT */}
      <AnimatedFinalCTASection /> 
      
      {/* TODO: Add new sections planned: */}
      {/* <StatsSection /> */}
      {/* <BlogPreviewSection /> */}
      {/* <ForJobSeekersSection /> */}
      {/* <ForEmployersSection /> */}
    </>
  );
}