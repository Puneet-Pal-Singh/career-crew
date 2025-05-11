// src/components/landing/AnimatedHeroSection.tsx
'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import AnimatedGradientBackground from '@/components/ui/AnimatedGradientBackground';

export default function AnimatedHeroSection() {
  return (
    // MODIFIED: Added min-h-screen and flex to center content vertically
    <section 
      className="relative overflow-hidden flex flex-col justify-center items-center text-center min-h-screen py-16 md:py-20"
      // py-16/20 provides padding if content is taller than screen, but min-h-screen ensures it's at least full height
    >
      <AnimatedGradientBackground className="animated-aurora-bg" />
      
      <div className="container mx-auto px-4 relative z-10"> {/* Max width for content */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          // Adjusted text sizes for potentially larger hero display
          className="font-display text-5xl font-bold tracking-tight text-content-light dark:text-content-dark sm:text-6xl md:text-7xl lg:text-8xl"
        >
          Find Your <span className="text-primary dark:text-primary-dark">Dream Team</span> or
          <br className="hidden md:block" /> {/* md:block for better control on when it breaks */}
          Your Next <span className="text-secondary dark:text-secondary-dark">Big Opportunity</span>.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          // Adjusted text size and max-width
          className="mt-6 text-lg md:text-xl leading-relaxed text-subtle-light dark:text-subtle-dark max-w-3xl mx-auto"
        >
          CareerCrew Consulting connects top talent with innovative companies.
          Whether you&apos;re hiring or looking for your next role, we&apos;re here to help you succeed.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-10 md:mt-12 flex flex-col sm:flex-row items-center justify-center gap-x-6 gap-y-4"
        >
          <Link
            href="/jobs"
            // Slightly larger buttons
            className="w-full sm:w-auto rounded-lg bg-primary dark:bg-primary-dark px-10 py-4 text-base md:text-lg font-semibold text-white dark:text-gray-900 shadow-xl hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-all duration-150 transform hover:scale-105"
          >
            Browse Jobs
          </Link>
          <Link
            href="/employer/post-job"
            className="w-full sm:w-auto group text-base md:text-lg font-semibold leading-6 text-content-light dark:text-content-dark hover:text-primary dark:hover:text-primary-dark transition-colors duration-150 flex items-center justify-center gap-2 border border-border-light dark:border-border-dark bg-white/60 dark:bg-slate-800/60 backdrop-blur-md px-10 py-4 rounded-lg hover:border-primary dark:hover:border-primary-dark shadow-lg hover:shadow-xl"
          >
            Post a Job <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

// `'` can be escaped with `&apos;`,