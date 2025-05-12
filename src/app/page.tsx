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
import AnimatedStatsSection from '@/components/landing/AnimatedStatsSection'; // NEW
import AnimatedBlogPreviewSection from '@/components/landing/AnimatedBlogPreviewSection'; // NEW
import ForJobSeekersSection from '@/components/landing/ForJobSeekersSection'; // NEW
import ForEmployersSection from '@/components/landing/ForEmployersSection';   // NEW

// Data fetching functions
// import { getRecentJobsData } from '@/lib/data/jobs'; // Old API fetch
import { getRecentJobsDataDirectly } from '@/lib/data/jobs'; // NEW direct DB fetch

import { 
  getFeaturesData, 
  getHowItWorksStepsData, 
  getFeaturedCompaniesData, 
  getTestimonialsData,
  getBlogPreviewData 
} from '@/lib/data/landingContent'; // Example: moved data fetching

// export const dynamic = 'force-dynamic'; // Or 'auto' if Next.js can infer correctly

export default async function HomePage() {
  // Fetch all necessary data concurrently
  const [
    recentJobs,
    features,
    howItWorksSteps,
    featuredCompanies,
    testimonials,
    blogPosts
  ] = await Promise.all([
    // getRecentJobsData(),
    getRecentJobsDataDirectly(),
    getFeaturesData(),
    getHowItWorksStepsData(),
    getFeaturedCompaniesData(),
    getTestimonialsData(),
    getBlogPreviewData() 
  ]);

  return (
    <>
      <AnimatedHeroSection />
      <AnimatedHowItWorksSection steps={howItWorksSteps} />
      <AnimatedFeaturesSection features={features} /> 
      <AnimatedStatsSection /> 
      <ForJobSeekersSection /> {/* ADD NEW SECTION */}
      <ForEmployersSection />  {/* ADD NEW SECTION */}
      <AnimatedFeaturedCompanies companies={featuredCompanies} /> 
      <AnimatedTestimonialsSection testimonials={testimonials} /> 
      <AnimatedRecentJobsSection jobs={recentJobs} /> 
      <AnimatedBlogPreviewSection posts={blogPosts} />
      <AnimatedFinalCTASection /> 
    </>
  );
}