// src/components/landing/ForEmployersSection.tsx
'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Users, FilePlus, CheckSquare } from 'lucide-react'; // Example icons

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
  // { 
  //   icon: Building, 
  //   title: "Boost Your Employer Brand", 
  //   description: "Showcase your company culture and attract top talent by enhancing your visibility." 
  // },
];

export default function ForEmployersSection() {
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
      id="for-employers" 
      className="py-20 md:py-28 lg:py-32 bg-surface-light dark:bg-surface-dark relative overflow-hidden"
      // Example: Using surface color for a clean, professional look
    >
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Visual Column (Placeholder - replace) - Order changed for alternation */}
          <motion.div 
            className="flex items-center justify-center lg:order-1" // Visual first on desktop
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, delay: 0.3, ease: 'easeOut' }}
          >
            <Image
              src="/illustrations/employer-hiring.svg" // CREATE THIS ILLUSTRATION/IMAGE
              alt="Employer finding talent"
              width={500}
              height={500}
              className="object-contain rounded-lg"
            />
          </motion.div>

          {/* Text Content Column */}
          <motion.div
            className="lg:order-2" // Text second on desktop
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={sectionVariants}
          >
            <motion.p 
              className="text-sm font-semibold uppercase tracking-wider text-secondary dark:text-secondary-dark mb-2" // Using secondary color for accent
              variants={itemVariants}
            >
              For Employers
            </motion.p>
            <motion.h2 
              className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-content-light dark:text-content-dark mb-6"
              variants={itemVariants}
            >
              Build Your <span className="text-primary dark:text-primary-dark">Dream Team</span>, Faster.
            </motion.h2>
            <motion.p 
              className="text-lg sm:text-xl text-subtle-light dark:text-subtle-dark mb-8 leading-relaxed"
              variants={itemVariants}
            >
              CareerCrew provides the tools and reach you need to attract, manage, and hire top-tier talent for your organization.
            </motion.p>
            
            <div className="space-y-5 mb-10">
              {benefits.map((benefit) => (
                <motion.div key={benefit.title} className="flex items-start space-x-4" variants={itemVariants}>
                  <div className="flex-shrink-0 mt-1 p-2.5 bg-secondary/10 dark:bg-secondary-dark/15 text-secondary dark:text-secondary-dark rounded-lg">
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
                href="/employer/post-job" // Or a general employer dashboard/signup
                className="group rounded-lg bg-secondary dark:bg-secondary-dark px-8 py-4 text-base md:text-lg font-semibold text-white dark:text-gray-900 shadow-lg hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary transition-all duration-150 transform hover:scale-105 inline-flex items-center gap-2"
              >
                Post a Job Today <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}