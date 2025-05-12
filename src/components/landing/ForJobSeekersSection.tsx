// src/components/landing/ForJobSeekersSection.tsx
'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Search, UserPlus, BellRing } from 'lucide-react'; // Example icons

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
  // { 
  //   icon: TrendingUp, 
  //   title: "Career Growth Resources", 
  //   description: "Access insights and tools to help you advance your career and achieve your goals." 
  // },
];

export default function ForJobSeekersSection() {
  const sectionVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2, delayChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  };

  return (
    <section 
      id="for-job-seekers" 
      className="py-20 md:py-28 lg:py-32 bg-gradient-to-br from-primary/5 via-accent1/5 to-background-light dark:from-primary-dark/5 dark:via-accent1-dark/5 dark:to-background-dark relative overflow-hidden"
      // Example of a soft, optimistic gradient
    >
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Text Content Column */}
          <motion.div
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
              className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-content-light dark:text-content-dark mb-6"
              variants={itemVariants}
            >
              Find Your <span className="text-secondary dark:text-secondary-dark">Next Big</span> Opportunity.
            </motion.h2>
            <motion.p 
              className="text-lg sm:text-xl text-subtle-light dark:text-subtle-dark mb-8 leading-relaxed"
              variants={itemVariants}
            >
              CareerCrew empowers you to discover exciting roles, simplify your job search, and take control of your professional journey.
            </motion.p>
            
            <div className="space-y-5 mb-10">
              {benefits.map((benefit) => (
                <motion.div key={benefit.title} className="flex items-start space-x-4" variants={itemVariants}>
                  <div className="flex-shrink-0 mt-1 p-2.5 bg-primary/10 dark:bg-primary-dark/15 text-primary dark:text-primary-dark rounded-lg">
                    <benefit.icon size={22} strokeWidth={2} />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-content-light dark:text-content-dark">{benefit.title}</h4>
                    <p className="text-sm text-subtle-light dark:text-subtle-dark">{benefit.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div variants={itemVariants}>
              <Link
                href="/jobs"
                className="group rounded-lg bg-primary dark:bg-primary-dark px-8 py-4 text-base md:text-lg font-semibold text-white dark:text-gray-900 shadow-lg hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-all duration-150 transform hover:scale-105 inline-flex items-center gap-2"
              >
                Browse Open Roles <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.div>
          </motion.div>

          {/* Visual Column (Placeholder - replace with a compelling image/illustration) */}
          <motion.div 
            className="hidden lg:flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, delay: 0.3, ease: 'easeOut' }}
          >
            <Image
              src="/illustrations/job-seeker-focus.svg" // CREATE THIS ILLUSTRATION/IMAGE
              alt="Job seeker finding opportunities"
              width={500}
              height={500}
              className="object-contain rounded-lg" 
              // Example: max-w-md lg:max-w-lg
            />
            {/* Or a more abstract visual */}
            {/* <div className="w-full h-[400px] bg-gradient-to-tr from-accent1 to-secondary rounded-xl shadow-2xl flex items-center justify-center">
              <TrendingUp size={100} className="text-white opacity-30" />
            </div> */}
          </motion.div>
        </div>
      </div>
    </section>
  );
}