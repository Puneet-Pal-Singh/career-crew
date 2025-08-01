// src/components/landing/ForEmployersSection.tsx
'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Users, FilePlus, CheckSquare } from 'lucide-react';

const benefits = [
  { 
    icon: Users, 
    title: "Access Qualified Talent", 
    description: "Connect with a diverse pool of skilled professionals actively seeking new opportunities." 
  },
  { 
    icon: FilePlus, 
    title: "Streamlined Job Posting", 
    description: "Easily create and manage job listings with our intuitive platform to attract the right candidates." 
  },
  { 
    icon: CheckSquare, 
    title: "Efficient Candidate Matching", 
    description: "Our smart tools help you quickly identify and connect with the most suitable applicants." 
  },
];

export default function ForEmployersSection() {
  const sectionContentVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.1 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  };
  const visualVariants = {
    hidden: { opacity: 0, x: 50, scale: 0.85 },
    visible: { opacity: 1, x: 0, scale: 1, transition: { duration: 0.6, delay: 0.2, ease: 'easeOut' } },
  };

  return (
    <section 
      id="for-employers" 
      className="py-16 sm:py-20 md:py-28 lg:py-32 bg-surface-light dark:bg-surface-dark relative overflow-hidden"
    >
      <div 
        aria-hidden="true"
        className="absolute inset-y-0 right-0 w-full sm:w-3/5 md:w-1/2 lg:w-2/5 xl:w-1/3 
                   bg-gradient-to-l from-secondary/[.08] via-secondary/[.03] to-transparent 
                   dark:from-secondary-dark/[.08] dark:via-secondary-dark/[.03] dark:to-transparent 
                   -z-10 pointer-events-none"
      />

      <div className="container mx-auto px-4 relative z-0">
        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          
          <motion.div 
            className="w-full max-w-md lg:max-w-none mx-auto lg:order-1 flex items-center justify-center mb-8 lg:mb-0"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={visualVariants}
          >
            <Image
              src="/illustrations/employer-hiring.svg" 
              alt="Employer finding talent"
              width={480}
              height={480}
              className="object-contain rounded-lg w-full h-auto max-h-[300px] sm:max-h-[350px] md:max-h-[400px] lg:max-h-none"
            />
          </motion.div>

          <motion.div
            className="lg:order-2 text-center lg:text-left"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={sectionContentVariants}
          >
            <motion.p 
              className="text-sm font-semibold uppercase tracking-wider text-secondary dark:text-secondary-dark mb-2"
              variants={itemVariants}
            >
              For Employers
            </motion.p>
            <motion.h2 
              className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-content-light dark:text-content-dark mb-5 md:mb-6"
              variants={itemVariants}
            >
              Build Your <span className="text-primary dark:text-primary-dark">Dream Team</span>, Faster.
            </motion.h2>
            <motion.p 
              className="text-base sm:text-lg text-subtle-light dark:text-subtle-dark mb-6 md:mb-8 leading-relaxed"
              variants={itemVariants}
            >
              CareerCrew provides the tools and reach you need to attract, manage, and hire top-tier talent for your organization.
            </motion.p>
            
            <div className="space-y-5 mb-8 md:mb-10">
              {benefits.map((benefit) => (
                <motion.div 
                  key={benefit.title} 
                  className="flex items-start space-x-3 sm:space-x-4 text-left" 
                  variants={itemVariants}
                >
                  <div className="flex-shrink-0 mt-1 p-2.5 bg-secondary/10 dark:bg-secondary-dark/15 text-secondary dark:text-secondary-dark rounded-lg shadow-sm">
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
                href="/employer/post-job" 
                className="group rounded-lg bg-secondary dark:bg-secondary-dark px-7 py-3.5 sm:px-8 sm:py-4 text-sm sm:text-base md:text-lg font-semibold text-white dark:text-gray-900 shadow-lg hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary transition-all duration-150 transform hover:scale-105 inline-flex items-center gap-2"
              >
                Post a Job Today 
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