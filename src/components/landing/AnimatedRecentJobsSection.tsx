// src/components/landing/AnimatedRecentJobsSection.tsx
'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import JobCard from '@/components/jobs/JobCard';
import type { JobCardData } from '@/types';

interface AnimatedRecentJobsSectionProps {
  jobs: JobCardData[];
}

export default function AnimatedRecentJobsSection({ jobs }: AnimatedRecentJobsSectionProps) {
  const sectionVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: 'easeOut' } },
  };

  return (
    <section 
      id="recent-jobs" 
      className="py-20 md:py-28 lg:py-32 bg-gradient-to-b from-background-light via-surface-light/20 to-background-light dark:from-background-dark dark:via-surface-dark/20 dark:to-background-dark"
    >
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-16 md:mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-content-light dark:text-content-dark">
            Recent Job Openings
          </h2>
          <p className="mt-6 text-lg text-subtle-light dark:text-subtle-dark max-w-xl lg:max-w-2xl mx-auto leading-relaxed">
            Explore the latest opportunities posted on our platform by leading companies.
          </p>
        </motion.div>

        {jobs && jobs.length > 0 ? (
          <motion.div 
            className="grid grid-cols-1 gap-x-6 gap-y-8 md:grid-cols-2 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-10"
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.05 }} // Trigger when just a bit of the grid is visible
          >
            {jobs.map((job) => (
              <motion.div key={job.id} variants={itemVariants}>
                <JobCard job={job} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <p className="text-center text-subtle-light dark:text-subtle-dark py-10">
            No recent jobs found at the moment. Please check back soon!
          </p>
        )}

        {jobs && jobs.length > 0 && (
          <motion.div 
            className="mt-16 md:mt-20 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5, delay: (jobs.length * 0.1) + 0.3 }} // Delay after cards
          >
            <Link
              href="/jobs"
              className="group rounded-lg bg-primary dark:bg-primary-dark px-8 sm:px-10 py-3.5 sm:py-4 text-base md:text-lg font-semibold text-white dark:text-gray-900 shadow-xl hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-all duration-150 transform hover:scale-105 inline-flex items-center gap-2"
            >
              View All Jobs <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  );
}