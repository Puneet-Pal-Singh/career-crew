// src/app/page.tsx
import Link from 'next/link';
// Import only the icons that might be used directly in THIS Server Component (e.g., for FeatureItem if it's not client)
// For icons passed as *names* to client components, those client components will import the actual icon components.
import {
  ArrowRight, Briefcase, Search as SearchIconForFeatures, Zap, Target, // Used in features array
  // FileText, UserCheck, Search are now handled by names for HowItWorks
  // LucideIcon is a type, not needed for direct rendering here unless used as a type.
} from 'lucide-react';


// Non-animated components (can be server-rendered)
import FeatureItem from '@/components/landing/FeatureItem';
import JobCard from '@/components/jobs/JobCard';
import FeaturedCompanyLogo from '@/components/landing/FeaturedCompanyLogo';
// HowItWorksStep is used inside AnimatedHowItWorksSection

// Client components for animated sections
import AnimatedHeroSection from '@/components/landing/AnimatedHeroSection';
import AnimatedFinalCTASection from '@/components/landing/AnimatedFinalCTASection';
import AnimatedTestimonialsSection from '@/components/landing/AnimatedTestimonialsSection';
import AnimatedHowItWorksSection from '@/components/landing/AnimatedHowItWorksSection';

// Types
import type { JobCardData } from '@/types';
import type { LucideIcon as LucideIconType } from 'lucide-react'; // For typing the features array

// Testimonial type (ensure this matches what AnimatedTestimonialsSection expects)
interface TestimonialDataForPage {
  quote: string;
  name: string;
  role: string;
  avatarUrl: string;
  companyLogoUrl?: string;
}

// Interface for data passed from server to client for HowItWorks
interface HowItWorksStepDataForPage {
  iconName: 'FileText' | 'Search' | 'UserCheck'; // Pass icon names as strings
  title: string;
  description: string;
}

// Interface for features data (if icon is passed directly to FeatureItem and FeatureItem is not client)
interface FeatureData {
  icon: LucideIconType;
  title: string;
  description: string;
}


async function getRecentJobs(): Promise<JobCardData[]> {
  try {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const res = await fetch(`${appUrl}/api/jobs/recent`, {
      cache: 'no-store',
    });
    if (!res.ok) {
      console.error("Failed to fetch recent jobs:", res.status, await res.text());
      return [];
    }
    return res.json();
  } catch (error) {
    console.error("Error in getRecentJobs:", error);
    return [];
  }
}

export default async function HomePage() {
  const recentJobs = await getRecentJobs();

  const features: FeatureData[] = [ // Typed this array
    { icon: SearchIconForFeatures, title: 'Advanced Job Search', description: 'Easily find relevant job openings with our powerful search filters and intuitive interface.' },
    { icon: Briefcase, title: 'Effortless Applications', description: 'Apply to jobs quickly with a streamlined process, getting your profile in front of employers faster.' },
    { icon: Target, title: 'Targeted Connections', description: 'Directly connect with companies looking for talent like yours. Build your network and find your fit.' },
    { icon: Zap, title: 'Career Growth Insights', description: 'Access resources and insights to help you navigate your career path and achieve your professional goals.' },
  ];

  // CORRECTED: Use string literals for iconName
  const howItWorksStepsData: HowItWorksStepDataForPage[] = [
    { iconName: 'FileText', title: 'Create Profile / Post Job', description: 'Sign up in minutes. Job seekers build a compelling profile; employers post detailed job openings.' },
    { iconName: 'Search', title: 'Discover & Connect', description: 'Seekers browse relevant jobs and apply. Employers review qualified candidates.' },
    { iconName: 'UserCheck', title: 'Get Hired / Make the Hire', description: 'Secure your next role or welcome a new member to your team. Success awaits!' },
  ];

  const featuredCompanies = [
    { src: '/company-logos/nova-dynamics.svg', alt: 'Nova Dynamics' },
    { src: '/company-logos/zenith-solutions.svg', alt: 'Zenith Solutions' },
    { src: '/company-logos/quantum-leap-ai.svg', alt: 'QuantumLeap AI' },
    { src: '/company-logos/cybernetics-corp.svg', alt: 'Cybernetics Corp' },
    { src: '/company-logos/eco-innovate.svg', alt: 'EcoInnovate Hub' },
  ];

  const testimonialsData: TestimonialDataForPage[] = [
    { quote: "CareerCrew helped me find the perfect frontend role incredibly fast. The platform is intuitive and the opportunities are top-notch!", name: 'Sarah L.', role: 'Senior Frontend Developer', avatarUrl: '/avatars/sarah-l.jpg', companyLogoUrl: '/company-logos/nova-dynamics.svg' },
    { quote: "As a recruiter, finding quality candidates used to be a hassle. CareerCrew streamlined our hiring process significantly.", name: 'John B.', role: 'HR Manager at Zenith Solutions', avatarUrl: '/avatars/john-b.jpg', companyLogoUrl: '/company-logos/zenith-solutions.svg' },
    { quote: "The ease of application and the direct connection with employers made all the difference. Highly recommend!", name: 'Alice W.', role: 'UX Designer at QuantumLeap AI', avatarUrl: '/avatars/alice-w.jpg', companyLogoUrl: '/company-logos/quantum-leap-ai.svg' },
  ];

  return (
    <>
      <AnimatedHeroSection />

      <AnimatedHowItWorksSection steps={howItWorksStepsData} />

      {/* Features Section */}
      {/* If FeatureItem itself contains client-side logic/hooks or Framer Motion, then this whole
          section might need to become an AnimatedFeaturesSection client component,
          passing 'features' data similarly to how 'steps' or 'testimonials' are passed.
          For now, assuming FeatureItem is a simple presentational component.
      */}
      <section id="features" className="py-20 md:py-32 bg-gradient-to-b from-surface-light to-background-light dark:from-surface-dark dark:to-background-dark">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 md:mb-20">
            <h2 className="font-display text-4xl sm:text-5xl font-bold text-content-light dark:text-content-dark">
              Why Choose CareerCrew?
            </h2>
            <p className="mt-6 text-lg text-subtle-light dark:text-subtle-dark max-w-xl lg:max-w-2xl mx-auto leading-relaxed">
              We provide a seamless and effective platform for job seekers and employers alike, focusing on quality connections and user experience.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <FeatureItem
                key={feature.title}
                icon={feature.icon} // Passing the icon component directly here IS FINE if FeatureItem is NOT a client component and this section is server-rendered
                title={feature.title}
                description={feature.description}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Companies Section */}
      <section id="featured-companies" className="py-20 md:py-32 bg-background-light dark:bg-background-dark">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 md:mb-20">
            <h2 className="font-display text-4xl sm:text-5xl font-bold text-content-light dark:text-content-dark">
              Trusted by Leading Companies
            </h2>
            <p className="mt-6 text-lg text-subtle-light dark:text-subtle-dark max-w-xl lg:max-w-2xl mx-auto leading-relaxed">
              Proud to partner with innovative organizations of all sizes.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8 items-center">
            {featuredCompanies.map((company) => (
              <FeaturedCompanyLogo
                key={company.alt}
                src={company.src}
                alt={company.alt}
              />
            ))}
          </div>
        </div>
      </section>
      
      <AnimatedTestimonialsSection testimonials={testimonialsData} />

      {/* Recent Jobs Section */}
      <section id="recent-jobs" className="py-20 md:py-32 bg-gradient-to-b from-surface-light to-background-light dark:from-surface-dark dark:to-background-dark">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 md:mb-20">
            <h2 className="font-display text-4xl sm:text-5xl font-bold text-content-light dark:text-content-dark">
              Recent Job Openings
            </h2>
            <p className="mt-6 text-lg text-subtle-light dark:text-subtle-dark max-w-xl lg:max-w-2xl mx-auto leading-relaxed">
              Explore the latest opportunities posted on our platform by leading companies.
            </p>
          </div>
          {recentJobs && recentJobs.length > 0 ? (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {recentJobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          ) : (
            <p className="text-center text-subtle-light dark:text-subtle-dark py-10">
              No recent jobs found at the moment. Please check back soon!
            </p>
          )}
          {recentJobs && recentJobs.length > 0 && (
            <div className="mt-16 text-center"> {/* Increased margin */}
              <Link
                href="/jobs"
                className="group rounded-lg bg-primary dark:bg-primary-dark px-10 py-4 text-base md:text-lg font-semibold text-white dark:text-gray-900 shadow-xl hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-all duration-150 transform hover:scale-105 inline-flex items-center gap-2"
              >
                View All Jobs <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          )}
        </div>
      </section>
      
      <AnimatedFinalCTASection />
    </>
  );
}