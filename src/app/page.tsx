// src/app/page.tsx
import Link from 'next/link';
import {
  ArrowRight, Briefcase, Search, Zap, Target,
  FileText, UserCheck // Icons for HowItWorks
} from 'lucide-react';

// Non-animated components (can be server-rendered)
import FeatureItem from '@/components/landing/FeatureItem';
import JobCard from '@/components/jobs/JobCard';
import HowItWorksStep from '@/components/landing/HowItWorksStep';
import FeaturedCompanyLogo from '@/components/landing/FeaturedCompanyLogo';

// Client components for animated sections
import AnimatedHeroSection from '@/components/landing/AnimatedHeroSection';
import AnimatedFinalCTASection from '@/components/landing/AnimatedFinalCTASection';
import AnimatedTestimonialsSection from '@/components/landing/AnimatedTestimonialsSection';

// Types
import type { JobCardData } from '@/types';

// Testimonial type (ensure this matches what AnimatedTestimonialsSection expects)
interface TestimonialDataForPage {
  quote: string;
  name: string;
  role: string;
  avatarUrl: string;
  companyLogoUrl?: string;
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

  const features = [
    { icon: Search, title: 'Advanced Job Search', description: 'Easily find relevant job openings with our powerful search filters and intuitive interface.' },
    { icon: Briefcase, title: 'Effortless Applications', description: 'Apply to jobs quickly with a streamlined process, getting your profile in front of employers faster.' },
    { icon: Target, title: 'Targeted Connections', description: 'Directly connect with companies looking for talent like yours. Build your network and find your fit.' },
    { icon: Zap, title: 'Career Growth Insights', description: 'Access resources and insights to help you navigate your career path and achieve your professional goals.' },
  ];

  const howItWorksSteps = [
    { icon: FileText, title: 'Create Profile / Post Job', description: 'Sign up in minutes. Job seekers build a compelling profile; employers post detailed job openings.' },
    { icon: Search, title: 'Discover & Connect', description: 'Seekers browse relevant jobs and apply. Employers review qualified candidates.' },
    { icon: UserCheck, title: 'Get Hired / Make the Hire', description: 'Secure your next role or welcome a new member to your team. Success awaits!' },
  ];

  const featuredCompanies = [
    { src: '/placeholder-logo-1.svg', alt: 'Company One' },
    { src: '/placeholder-logo-2.svg', alt: 'Company Two' },
    { src: '/placeholder-logo-3.svg', alt: 'Company Three' },
    { src: '/placeholder-logo-4.svg', alt: 'Company Four' },
    { src: '/placeholder-logo-5.svg', alt: 'Company Five' },
  ];

  const testimonialsData: TestimonialDataForPage[] = [ // Using the defined type
    { quote: "CareerCrew helped me find the perfect frontend role incredibly fast. The platform is intuitive and the opportunities are top-notch!", name: 'Sarah L.', role: 'Senior Frontend Developer', avatarUrl: '/avatars/sarah.jpg', companyLogoUrl: '/placeholder-logo-1.svg' },
    { quote: "As a recruiter, finding quality candidates used to be a hassle. CareerCrew streamlined our hiring process significantly.", name: 'John B.', role: 'HR Manager at Tech Solutions Inc.', avatarUrl: '/avatars/john.jpg' },
    { quote: "The ease of application and the direct connection with employers made all the difference. Highly recommend!", name: 'Alice W.', role: 'UX Designer', avatarUrl: '/avatars/alice.jpg', companyLogoUrl: '/placeholder-logo-2.svg' },
  ];

  return (
    <>
      {/* Hero Section */}
      <AnimatedHeroSection />

      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 md:py-24 bg-background-light dark:bg-background-dark">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-content-light dark:text-content-dark">
              Getting Started is Easy
            </h2>
            <p className="mt-4 text-md text-subtle-light dark:text-subtle-dark max-w-xl mx-auto leading-relaxed">
              Follow these simple steps to connect with opportunities or find the perfect candidate.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-12 md:grid-cols-3 md:gap-8 relative">
            {howItWorksSteps.map((step, index) => (
              <HowItWorksStep
                key={step.title}
                icon={step.icon}
                stepNumber={index + 1}
                title={step.title}
                description={step.description}
                isLast={index === howItWorksSteps.length - 1}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 md:py-24 bg-gradient-to-b from-surface-light to-background-light dark:from-surface-dark dark:to-background-dark">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-content-light dark:text-content-dark">
              Why Choose CareerCrew?
            </h2>
            <p className="mt-4 text-md text-subtle-light dark:text-subtle-dark max-w-xl mx-auto leading-relaxed">
              We provide a seamless and effective platform for job seekers and employers alike, focusing on quality connections and user experience.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <FeatureItem
                key={feature.title}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Companies Section */}
      <section id="featured-companies" className="py-16 md:py-24 bg-background-light dark:bg-background-dark">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-content-light dark:text-content-dark">
              Trusted by Leading Companies
            </h2>
            <p className="mt-4 text-md text-subtle-light dark:text-subtle-dark max-w-xl mx-auto leading-relaxed">
              (Placeholder: We&apos;re proud to partner with innovative organizations of all sizes.)
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
      
      {/* Testimonials Section */}
      <AnimatedTestimonialsSection testimonials={testimonialsData} /> {/* Corrected prop name */}

      {/* Recent Jobs Section */}
      <section id="recent-jobs" className="py-16 md:py-24 bg-gradient-to-b from-surface-light to-background-light dark:from-surface-dark dark:to-background-dark">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-content-light dark:text-content-dark">
              Recent Job Openings
            </h2>
            <p className="mt-4 text-md text-subtle-light dark:text-subtle-dark max-w-xl mx-auto leading-relaxed">
              Explore the latest opportunities posted on our platform by leading companies.
            </p>
          </div>
          {recentJobs && recentJobs.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {recentJobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          ) : (
            <p className="text-center text-subtle-light dark:text-subtle-dark py-8">
              No recent jobs found at the moment. Please check back soon!
            </p>
          )}
          {recentJobs && recentJobs.length > 0 && (
            <div className="mt-12 text-center">
              <Link
                href="/jobs"
                className="group rounded-md bg-primary dark:bg-primary-dark px-8 py-3.5 text-base font-semibold text-white dark:text-background-dark shadow-lg hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-all duration-150 transform hover:scale-105 inline-flex items-center gap-2"
              >
                View All Jobs <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          )}
        </div>
      </section>
      
      {/* Final CTA Section */}
      <AnimatedFinalCTASection />
    </>
  );
}