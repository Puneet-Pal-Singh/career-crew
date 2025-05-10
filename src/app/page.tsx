// src/app/page.tsx
import Link from 'next/link';
import {
  ArrowRight, Briefcase, Search, Zap, Target,
  FileText, UserCheck // New icons for HowItWorks
} from 'lucide-react';
import FeatureItem from '@/components/landing/FeatureItem';
import JobCard from '@/components/jobs/JobCard';
import HowItWorksStep from '@/components/landing/HowItWorksStep';
import FeaturedCompanyLogo from '@/components/landing/FeaturedCompanyLogo';
import type { JobCardData } from '@/types';

async function getRecentJobs(): Promise<JobCardData[]> {
  try {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const res = await fetch(`${appUrl}/api/jobs/recent`, { cache: 'no-store' });
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

  const features = [ /* ... same as before ... */
    {
      icon: Search,
      title: 'Advanced Job Search',
      description: 'Easily find relevant job openings with our powerful search filters and intuitive interface.',
    },
    {
      icon: Briefcase,
      title: 'Effortless Applications',
      description: 'Apply to jobs quickly with a streamlined process, getting your profile in front of employers faster.',
    },
    {
      icon: Target,
      title: 'Targeted Connections',
      description: 'Directly connect with companies looking for talent like yours. Build your network and find your fit.',
    },
     {
      icon: Zap,
      title: 'Career Growth Insights',
      description: 'Access resources and insights to help you navigate your career path and achieve your professional goals.',
    },
  ];

  const howItWorksSteps = [
    {
      icon: FileText,
      title: 'Create Your Profile / Post a Job',
      description: 'Sign up in minutes. Job seekers build a compelling profile; employers post detailed job openings.',
    },
    {
      icon: Search, // Reusing Search icon, can be different
      title: 'Discover & Connect',
      description: 'Seekers browse relevant jobs and apply. Employers review qualified candidates.',
    },
    {
      icon: UserCheck, // Changed from Award
      title: 'Get Hired / Make the Hire',
      description: 'Secure your next role or welcome a new member to your team. Success awaits!',
    },
  ];

  const featuredCompanies = [
    { src: '/placeholder-logo-1.svg', alt: 'Company One' },
    { src: '/placeholder-logo-2.svg', alt: 'Company Two' },
    { src: '/placeholder-logo-3.svg', alt: 'Company Three' },
    { src: '/placeholder-logo-4.svg', alt: 'Company Four' },
    { src: '/placeholder-logo-5.svg', alt: 'Company Five' },
  ];

  return (
    <>
      {/* Hero Section (same as before, with slight styling adjustments) */}
      <section className="py-20 md:py-28 lg:py-32 bg-gradient-to-br from-background-light via-surface-light/30 to-background-light dark:from-background-dark dark:via-surface-dark/10 dark:to-background-dark">
        <div className="container mx-auto text-center px-4">
          <h1 className="font-display text-4xl font-bold tracking-tight text-content-light dark:text-content-dark sm:text-5xl md:text-6xl lg:text-7xl">
            Find Your <span className="text-primary">Dream Team</span> or
            <br className="hidden sm:block" />
            Your Next <span className="text-secondary">Big Opportunity</span>.
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-subtle-light dark:text-subtle-dark max-w-2xl mx-auto">
            CareerCrew Consulting connects top talent with innovative companies.
            Whether you&apos;re hiring or looking for your next role, we&apos;re here to help you succeed.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-x-6 gap-y-4">
            <Link
              href="/jobs"
              className="w-full sm:w-auto rounded-md bg-primary px-8 py-3.5 text-base font-semibold text-background-dark shadow-lg hover:bg-primary/85 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-all duration-150 transform hover:scale-105"
            >
              Browse Jobs
            </Link>
            <Link
              href="/employer/post-job"
              className="w-full sm:w-auto group text-base font-semibold leading-6 text-content-light dark:text-content-dark hover:text-primary dark:hover:text-primary transition-colors duration-150 flex items-center justify-center gap-2 border border-borderDark-DEFAULT/50 dark:border-borderDark-DEFAULT px-8 py-3.5 rounded-md hover:border-primary/50 dark:hover:border-primary/50 hover:shadow-md"
            >
              Post a Job <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

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

      {/* Features Section (same as before) */}
      <section id="features" className="py-16 md:py-24 bg-surface-light dark:bg-surface-dark">
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

      {/* Recent Jobs Section (same as before) */}
      <section id="recent-jobs" className="py-16 md:py-24 bg-surface-light dark:bg-surface-dark">
        {/* ... content from previous version for recent jobs ... */}
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
                className="group rounded-md bg-primary px-8 py-3.5 text-base font-semibold text-background-dark shadow-lg hover:bg-primary/85 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-all duration-150 transform hover:scale-105 inline-flex items-center gap-2"
              >
                View All Jobs <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Final CTA Section */}
      <section id="final-cta" className="py-16 md:py-24 bg-gradient-to-tr from-primary/80 via-secondary/70 to-primary/80 dark:from-primary/40 dark:via-secondary/30 dark:to-primary/40">
         <div className="container mx-auto text-center px-4">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-background-dark dark:text-content-dark">
            Ready to Take the Next Step?
          </h2>
          <p className="mt-4 text-md text-background-dark/80 dark:text-subtle-dark max-w-xl mx-auto leading-relaxed">
            Join CareerCrew today and unlock a world of opportunities or find the perfect talent for your team.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-x-6 gap-y-4">
            <Link
              href="/register?role=seeker" // Example: direct to seeker registration
              className="w-full sm:w-auto rounded-md bg-background-light dark:bg-surface-dark px-8 py-3.5 text-base font-semibold text-primary dark:text-primary shadow-lg hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-background-light transition-all duration-150 transform hover:scale-105"
            >
              I&apos;m Looking for a Job
            </Link>
            <Link
              href="/register?role=employer" // Example: direct to employer registration
              className="w-full sm:w-auto group text-base font-semibold leading-6 text-background-light dark:text-content-dark hover:opacity-90 transition-colors duration-150 flex items-center justify-center gap-2 border border-background-light/80 dark:border-borderDark-DEFAULT px-8 py-3.5 rounded-md hover:border-background-light dark:hover:border-white hover:shadow-md"
            >
              I&apos;m Hiring <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}