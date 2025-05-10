// src/components/landing/AnimatedHeroSection.tsx
'use client'; // VERY IMPORTANT

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import AnimatedGradientBackground from '@/components/ui/AnimatedGradientBackground';

export default function AnimatedHeroSection() {
  return (
    <section className="relative overflow-hidden py-20 md:py-28 lg:py-32 bg-background-light dark:bg-background-dark">
      <AnimatedGradientBackground className="animated-aurora-bg" />
      <div className="container mx-auto text-center px-4 relative z-10">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }} // Changed from whileInView for initial hero load
          transition={{ duration: 0.6, delay: 0.2 }}
          className="font-display text-4xl font-bold tracking-tight text-content-light dark:text-content-dark sm:text-5xl md:text-6xl lg:text-7xl"
        >
          Find Your <span className="text-primary dark:text-primary-dark">Dream Team</span> or
          <br className="hidden sm:block" />
          Your Next <span className="text-secondary dark:text-secondary-dark">Big Opportunity</span>.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-6 text-lg leading-relaxed text-subtle-light dark:text-subtle-dark max-w-2xl mx-auto"
        >
          CareerCrew Consulting connects top talent with innovative companies.
          Whether you&apos;re hiring or looking for your next role, we&apos;re here to help you succeed.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-x-6 gap-y-4"
        >
          <Link
            href="/jobs"
            className="w-full sm:w-auto rounded-md bg-primary dark:bg-primary-dark px-8 py-3.5 text-base font-semibold text-white dark:text-background-dark shadow-lg hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-all duration-150 transform hover:scale-105"
          >
            Browse Jobs
          </Link>
          <Link
            href="/employer/post-job"
            className="w-full sm:w-auto group text-base font-semibold leading-6 text-content-light dark:text-content-dark hover:text-primary dark:hover:text-primary-dark transition-colors duration-150 flex items-center justify-center gap-2 border border-border-light dark:border-border-dark px-8 py-3.5 rounded-md hover:border-primary dark:hover:border-primary-dark hover:shadow-md"
          >
            Post a Job <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}