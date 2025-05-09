// src/app/page.tsx
import Link from 'next/link';
import { ArrowRight, Briefcase, Search, Zap, Target } from 'lucide-react';
import FeatureItem from '@/components/landing/FeatureItem';
import JobCard from '@/components/jobs/JobCard';
import type { JobCardData } from '@/types';

async function getRecentJobs(): Promise<JobCardData[]> {
  try {
    // For Server Components, fetch needs the full URL if hitting its own API route.
    // Ensure NEXT_PUBLIC_APP_URL is set in your .env.local (e.g., NEXT_PUBLIC_APP_URL=http://localhost:3000)
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const res = await fetch(`${appUrl}/api/jobs/recent`, {
      cache: 'no-store', // For development, no-store is fine. For production, consider revalidation.
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
      icon: Target, // Changed from Users for more variety
      title: 'Targeted Connections',
      description: 'Directly connect with companies looking for talent like yours. Build your network and find your fit.',
    },
     {
      icon: Zap,
      title: 'Career Growth Insights',
      description: 'Access resources and insights to help you navigate your career path and achieve your professional goals.',
    },
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="py-20 md:py-28 lg:py-32 bg-gradient-to-br from-background-light via-surface-light/30 to-background-light dark:from-background-dark dark:via-surface-dark/20 dark:to-background-dark">
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
              className="w-full sm:w-auto rounded-md bg-primary px-8 py-3.5 text-base font-semibold text-background-dark shadow-md hover:bg-primary/85 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-all duration-150 transform hover:scale-105"
            >
              Browse Jobs
            </Link>
            <Link
              href="/employer/post-job" // Update this link if it changes
              className="w-full sm:w-auto group text-base font-semibold leading-6 text-content-light dark:text-content-dark hover:text-primary dark:hover:text-primary transition-colors duration-150 flex items-center justify-center gap-2 border border-surface-dark/50 dark:border-surface-light/20 px-8 py-3.5 rounded-md hover:border-primary/50 dark:hover:border-primary/50"
            >
              Post a Job <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
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

      {/* Recent Jobs Section */}
      <section id="recent-jobs" className="py-16 md:py-24 bg-background-light dark:bg-background-dark">
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
                className="group rounded-md bg-primary px-8 py-3.5 text-base font-semibold text-background-dark shadow-md hover:bg-primary/85 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-all duration-150 transform hover:scale-105 inline-flex items-center gap-2"
              >
                View All Jobs <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          )}
        </div>
      </section>
    </>
  );
}