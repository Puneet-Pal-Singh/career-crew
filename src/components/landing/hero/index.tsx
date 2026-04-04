// src/components/landing/hero/index.tsx
'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles} from 'lucide-react';
import AnimatedGradientBackground from '@/components/ui/AnimatedGradientBackground';
import FloatingCarousels from './FloatingCarousels';
import { useAuth } from "@/lib/auth/contexts/AuthContext";
import { useEffect, useState } from 'react';

// JSON-LD Structured Data for SEO
const structuredData = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "CareerCrew Consulting",
  "alternateName": "CareerCrew",
  "description": "Connecting top talent with innovative companies. Whether you're hiring or looking for your next role, we're here to help you succeed. 500+ companies trust us with 10,000+ successful placements.",
  "url": "https://careercrewconsulting.com",
  "logo": "https://careercrewconsulting.com/logo.png",
  "foundingDate": "2024",
  "sameAs": [
    "https://linkedin.com/company/careercrewconsulting",
    "https://twitter.com/careercrew"
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "customer service",
    "email": "contact@careercrewconsulting.com"
  },
  "areaServed": {
    "@type": "Country",
    "name": "United States"
  },
  "service": {
    "@type": "Service",
    "name": "Career Consulting",
    "description": "Professional career consulting services connecting talent with opportunities",
    "serviceType": "Career Services",
    "provider": {
      "@type": "Organization",
      "name": "CareerCrew Consulting"
    }
  },
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Career Services",
    "itemListElement": [
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Job Search Assistance",
          "description": "Help job seekers find their ideal career opportunities"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Talent Acquisition",
          "description": "Connect employers with qualified candidates"
        }
      }
    ]
  }
};

export default function ModernHeroSection() {
  const { user } = useAuth();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8
      }
    }
  };

  return (
    <>
      {/* SEO Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <section
        className="relative overflow-hidden flex flex-col justify-center items-center text-center min-h-screen pt-16 md:pt-20 pb-12 md:pb-16"
        aria-label="CareerCrew Consulting - Career Services Platform"
      >
        <AnimatedGradientBackground
          className="hero-modern-bg"
          isHeroBackground={true}
        />

        {/* Floating Carousels */}
        <FloatingCarousels />

        <div className="container mx-auto px-4 relative z-10 max-w-7xl">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={isLoaded ? "visible" : "hidden"}
            className="space-y-6 md:space-y-8 lg:space-y-10"
          >
            {/* Badge */}
            <motion.div variants={itemVariants} className="flex justify-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 dark:bg-slate-800/10 backdrop-blur-md border border-white/20 dark:border-slate-700/20 text-sm font-medium text-content-light dark:text-content-dark">
                <Sparkles size={16} className="text-primary dark:text-primary-dark" />
                <span>Connecting Talent & Opportunity</span>
              </div>
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              variants={itemVariants}
              className="font-display text-5xl font-bold tracking-tight text-content-light dark:text-content-dark sm:text-5xl md:text-6xl lg:text-7xl xl:text-7xl leading-[1.05]"
            >
              <span className="block">
                Find Your{" "}
                <span className="bg-gradient-to-r from-primary via-primary to-secondary dark:from-primary-dark dark:via-primary-dark dark:to-secondary-dark bg-clip-text text-transparent">
                  Dream Team
                </span>
              </span>
              <span className="block">
                or Your Next{" "}
                <span className="bg-gradient-to-r from-secondary via-secondary to-primary dark:from-secondary-dark dark:via-secondary-dark dark:to-primary-dark bg-clip-text text-transparent">
                  Big Opportunity
                </span>
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              variants={itemVariants}
              className="text-lg sm:text-base md:text-lg lg:text-xl leading-relaxed text-subtle-light dark:text-subtle-dark max-w-4xl mx-auto font-light"
            >
              CareerCrew connects <span className="font-semibold text-primary dark:text-primary-dark">top talent</span> with{" "}
              <span className="font-semibold text-secondary dark:text-secondary-dark">innovative companies</span>.
              Whether you&apos;re hiring or looking for your next role, we&apos;re here to help you succeed.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-6 pt-6 md:pt-8"
            >
              <Link
                href="/jobs"
                className="group relative w-full sm:w-auto overflow-hidden rounded-xl bg-gradient-to-r from-primary to-secondary dark:from-primary-dark dark:to-secondary-dark px-5 py-2.5 sm:px-8 sm:py-4 text-sm sm:text-base md:text-lg font-semibold text-white shadow-2xl hover:shadow-primary/25 dark:hover:shadow-primary-dark/25 transition-all duration-300 transform hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  Browse Jobs
                  <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-secondary to-primary dark:from-secondary-dark dark:to-primary-dark opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Link>

              <Link
                href={user ? "/dashboard/post-job" : "/employer/signup"}
                className="group w-full sm:w-auto text-sm sm:text-base md:text-lg font-semibold leading-6 text-content-light dark:text-content-dark hover:text-primary dark:hover:text-primary-dark transition-all duration-300 flex items-center justify-center gap-2 px-5 py-2.5 sm:px-8 sm:py-4 rounded-xl border-2 border-border-light dark:border-border-dark hover:border-primary dark:hover:border-primary-dark bg-white/5 dark:bg-slate-800/5 backdrop-blur-md shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Post a Job
                <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-8 pt-6 md:pt-8 text-sm text-subtle-light dark:text-subtle-dark"
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>500+ Companies Trust Us</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span>10,000+ Successful Placements</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                <span>24/7 Support Available</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
