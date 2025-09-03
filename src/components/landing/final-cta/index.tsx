// src/components/landing/AnimatedFinalCTASection.tsx
'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export default function AnimatedFinalCTASection() {
  return (
    <section id="final-cta" className="relative overflow-hidden py-16 md:py-24">
      <div className="absolute inset-0 -z-10 
                     bg-gradient-to-br from-primary via-accent1 to-secondary
                     dark:from-primary-dark dark:via-accent1-dark dark:to-secondary-dark 
                     opacity-80 dark:opacity-60 blur-xl"></div>
      <div className="absolute inset-0 -z-20 
                     bg-gradient-to-tr from-secondary via-primary to-accent1
                     dark:from-secondary-dark dark:via-primary-dark dark:to-accent1-dark 
                     opacity-60 dark:opacity-40 blur-2xl animate-pulse"
           style={{ animationDuration: '10s' }}></div>

      <div className="container mx-auto text-center px-4 relative z-10">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
          className="font-display text-3xl sm:text-4xl font-bold text-white dark:text-content-dark"
        >
          Ready to Take the Next Step?
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-4 text-md text-white/90 dark:text-subtle-dark max-w-xl mx-auto leading-relaxed"
        >
          Join CareerCrew today and unlock a world of opportunities or find the perfect talent for your team.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-x-6 gap-y-4"
        >
          <Link
            href="/jobs/signup"
            className="w-full sm:w-auto rounded-md bg-white dark:bg-surface-dark px-8 py-3.5 text-base font-semibold text-primary dark:text-primary-dark shadow-lg hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white transition-all duration-150 transform hover:scale-105"
          >
            I&apos;m Looking for a Job
          </Link>
          <Link
            href="/employer/signup"
            className="w-full sm:w-auto group text-base font-semibold leading-6 text-white dark:text-content-dark hover:opacity-90 transition-colors duration-150 flex items-center justify-center gap-2 border border-white/80 dark:border-border-dark px-8 py-3.5 rounded-md hover:border-white dark:hover:border-white/70 hover:shadow-md"
          >
            I&apos;m Hiring <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}