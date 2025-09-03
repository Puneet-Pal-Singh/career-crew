// src/components/landing/ForJobSeekersSection.tsx
'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Search, UserPlus, BellRing } from 'lucide-react';

const benefits = [
  { 
    icon: Search, 
    title: "Discover Top Opportunities", 
    description: "Access a curated list of jobs from innovative companies and industry leaders." 
  },
  { 
    icon: UserPlus, 
    title: "Effortless Application", 
    description: "Apply to jobs seamlessly with our streamlined process, getting noticed faster." 
  },
  { 
    icon: BellRing, 
    title: "Personalized Job Alerts", 
    description: "Never miss out. Get notified about new roles that match your skills and preferences." 
  },
];

export default function ForJobSeekersSection() {
  const sectionVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  };

  const visualVariants = {
    hidden: { opacity: 0, scale: 0.85 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.6, delay: 0.2, ease: 'easeOut' } },
  };

  return (
    <section 
      id="for-job-seekers" 
      className="py-16 sm:py-20 md:py-28 lg:py-32 bg-gradient-to-br from-primary/10 via-accent1/5 to-background-light dark:from-primary-dark/10 dark:via-accent1-dark/5 dark:to-background-dark relative overflow-hidden"
    >
      <div 
        aria-hidden="true"
        className="absolute inset-y-0 left-0 w-full sm:w-3/5 md:w-1/2 lg:w-2/5 xl:w-1/3 
                   bg-gradient-to-r from-primary/[.07] via-primary/[.02] to-transparent 
                   dark:from-primary-dark/[.07] dark:via-primary-dark/[.02] dark:to-transparent 
                   -z-10 opacity-80 dark:opacity-60 pointer-events-none"
      />

      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          
          <motion.div 
            className="w-full max-w-md lg:max-w-none mx-auto lg:order-2 flex items-center justify-center mb-8 lg:mb-0" 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={visualVariants}
          >
            <Image
              src="/illustrations/rocket.svg" 
              alt="Job seeker actively finding opportunities"
              width={480}
              height={480}
              className="object-contain rounded-lg w-full h-auto max-h-[300px] sm:max-h-[350px] md:max-h-[400px] lg:max-h-none" 
            />
          </motion.div>

          <motion.div
            className="lg:order-1 text-center lg:text-left" 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={sectionVariants}
          >
            <motion.p 
              className="text-sm font-semibold uppercase tracking-wider text-primary dark:text-primary-dark mb-2"
              variants={itemVariants}
            >
              For Job Seekers
            </motion.p>
            <motion.h2 
              className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-content-light dark:text-content-dark mb-5 md:mb-6"
              variants={itemVariants}
            >
              Find Your <span className="text-secondary dark:text-secondary-dark">Next Big</span> Opportunity.
            </motion.h2>
            <motion.p 
              className="text-base sm:text-lg text-subtle-light dark:text-subtle-dark mb-6 md:mb-8 leading-relaxed"
              variants={itemVariants}
            >
              CareerCrew empowers you to discover exciting roles, simplify your job search, and take control of your professional journey.
            </motion.p>
            
            <div className="space-y-5 mb-8 md:mb-10">
              {benefits.map((benefit) => (
                <motion.div 
                  key={benefit.title} 
                  className="flex items-start space-x-3 sm:space-x-4 text-left" 
                  variants={itemVariants}
                >
                  <div className="flex-shrink-0 mt-1 p-2.5 bg-primary/10 dark:bg-primary-dark/15 text-primary dark:text-primary-dark rounded-lg">
                    {/* CORRECTED ICON SIZING */}
                    <benefit.icon size={22} strokeWidth={2} /> 
                  </div>
                  <div>
                    <h4 className="text-md sm:text-lg font-semibold text-content-light dark:text-content-dark">{benefit.title}</h4>
                    <p className="text-xs sm:text-sm text-subtle-light dark:text-subtle-dark">{benefit.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div variants={itemVariants}>
              <Link
                href="/jobs"
                className="group rounded-lg bg-primary dark:bg-primary-dark px-7 py-3.5 sm:px-8 sm:py-4 text-sm sm:text-base md:text-lg font-semibold text-white dark:text-gray-900 shadow-lg hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-all duration-150 transform hover:scale-105 inline-flex items-center gap-2"
              >
                Browse Open Roles 
                {/* CORRECTED ICON SIZING */}
                <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" /> 
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}