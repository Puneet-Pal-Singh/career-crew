// src/app/page.tsx
import AnimatedHeroSection from '@/components/landing/AnimatedHeroSection';
import AnimatedHowItWorksSection from '@/components/landing/AnimatedHowItWorksSection';
import AnimatedFeaturesSection from '@/components/landing/AnimatedFeaturesSection';
import AnimatedFeaturedCompanies from '@/components/landing/AnimatedFeaturedCompanies';
import AnimatedTestimonialsSection from '@/components/landing/AnimatedTestimonialsSection';
import AnimatedRecentJobsSection from '@/components/landing/AnimatedRecentJobsSection';
import AnimatedFinalCTASection from '@/components/landing/AnimatedFinalCTASection';
import AnimatedStatsSection from '@/components/landing/AnimatedStatsSection';
import AnimatedBlogPreviewSection from '@/components/landing/AnimatedBlogPreviewSection';
import ForJobSeekersSection from '@/components/landing/ForJobSeekersSection';
import ForEmployersSection from '@/components/landing/ForEmployersSection';

// Data fetching functions (assuming these are safe and don't rely on deleted APIs)
import { 
  getFeaturesData, 
  getHowItWorksStepsData, 
  getFeaturedCompaniesData, 
  getTestimonialsData,
  getBlogPreviewData 
} from '@/lib/data/landingContent';
import type { JobCardData } from '@/types'; // Import the type if you use mock data

// export const dynamic = 'force-dynamic';

export default async function HomePage() {
  // Fetch all necessary data concurrently
  // Note: recentJobs is handled separately for now
  const [
    features,
    howItWorksSteps,
    featuredCompanies,
    testimonials,
    blogPosts
  ] = await Promise.all([
    getFeaturesData(),
    getHowItWorksStepsData(),
    getFeaturedCompaniesData(),
    getTestimonialsData(),
    getBlogPreviewData() 
  ]);

  // Placeholder for recentJobs to avoid breaking AnimatedRecentJobsSection prop
  // Replace with actual Supabase fetching later
  const recentJobs: JobCardData[] = [
    // Example mock data - remove or adjust as needed
    // {
    //   id: '1',
    //   title: 'Software Engineer (Frontend)',
    //   companyName: 'Tech Solutions Inc.',
    //   location: 'Remote',
    //   type: 'Full-time',
    //   salary: '$100k - $120k',
    //   postedDate: '2024-07-28',
    //   companyLogo: '/company-logos/placeholder-logo-1.svg',
    //   tags: ['React', 'TypeScript', 'Next.js'],
    //   featured: true,
    // },
    // {
    //   id: '2',
    //   title: 'Product Manager',
    //   companyName: 'Innovate Hub',
    //   location: 'New York, NY',
    //   type: 'Full-time',
    //   salary: '$110k - $130k',
    //   postedDate: '2024-07-27',
    //   companyLogo: '/company-logos/placeholder-logo-2.svg',
    //   tags: ['Agile', 'Roadmap', 'SaaS'],
    //   featured: false,
    // }
  ]; 

  return (
    <>
      <AnimatedHeroSection />
      <AnimatedHowItWorksSection steps={howItWorksSteps} />
      {/* 
        NOTE: These components are now wrapped in <section> tags with IDs.
        This allows the header links to scroll to the correct place on the page.
        */}
      <section id="features-for-seekers">
        <ForJobSeekersSection />
      </section>
      
      <section id="features-for-companies">
        <ForEmployersSection />
      </section>

      <AnimatedFeaturesSection features={features} /> 
      <AnimatedStatsSection /> 
      <AnimatedFeaturedCompanies companies={featuredCompanies} /> 
      <AnimatedTestimonialsSection testimonials={testimonials} /> 
      <AnimatedRecentJobsSection jobs={recentJobs} /> 
      <AnimatedBlogPreviewSection posts={blogPosts} />
      <AnimatedFinalCTASection /> 
    </>
  );
}