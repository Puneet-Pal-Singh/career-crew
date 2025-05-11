// src/components/landing/AnimatedRecentJobsSection.tsx
'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import JobCard from '@/components/jobs/JobCard'; 
import type { JobCardData } from '@/types';    
import { useState, useMemo } from 'react';
// import { useEffect } from 'react';

interface AnimatedRecentJobsSectionProps {
  jobs: JobCardData[];
}

// Define filter categories - these should exactly match what you expect to filter by, or 'All'/'Remote'
const jobFilterCategories = ['All', 'Full-time', 'Contract', 'Remote']; 

export default function AnimatedRecentJobsSection({ jobs = [] }: AnimatedRecentJobsSectionProps) {
  const [activeFilter, setActiveFilter] = useState<string>('All');

  // --- DEBUGGING LOGS (Uncomment to inspect data flow) ---
//   useEffect(() => {
//     console.log('[AnimatedRecentJobsSection] Jobs Prop Received:', JSON.stringify(jobs, null, 2));
//     if (jobs && jobs.length > 0) {
//       const uniqueTypes = new Set(jobs.map(job => job.type?.trim().toLowerCase()).filter(Boolean));
//       console.log('[AnimatedRecentJobsSection] Unique Job Types in Prop:', Array.from(uniqueTypes));
//       const hasRemote = jobs.some(job => job.isRemote);
//       console.log('[AnimatedRecentJobsSection] Has Remote Jobs in Prop:', hasRemote);
//     }
//   }, [jobs]);

//   useEffect(() => {
//     console.log('[AnimatedRecentJobsSection] Active filter changed to:', activeFilter);
//   }, [activeFilter]);
  // --- END DEBUGGING LOGS ---

  const filteredJobs = useMemo(() => {
    // console.log(`[FILTERING] Active Filter: "${activeFilter}"`, "Original Jobs Count:", jobs.length);
    if (!Array.isArray(jobs) || jobs.length === 0) {
        return [];
    }

    if (activeFilter === 'All') {
        return jobs;
    }
    
    if (activeFilter === 'Remote') {
        // Ensure job.isRemote is explicitly true
        return jobs.filter(job => job.isRemote === true); 
    }
    
    // For type-based filtering (e.g., 'Full-time', 'Contract')
    // Ensure case-insensitivity and handle potential undefined/null job.type
    return jobs.filter(job => 
        job.type && job.type.trim().toLowerCase() === activeFilter.trim().toLowerCase()
    );
  }, [jobs, activeFilter]);

  // Animation variants
  const sectionHeaderVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };
  const gridContainerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { staggerChildren: 0.1, delayChildren: 0.2 } 
    },
  };
  const jobCardVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: 'easeOut' } },
  };
  const ctaButtonVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  };
  
  return (
    <section 
      id="recent-jobs" 
      className="py-20 md:py-28 lg:py-32 relative overflow-hidden
                 bg-gradient-to-b from-surface-light/50 via-background-light to-surface-light/50 
                 dark:from-surface-dark/50 dark:via-background-dark dark:to-surface-dark/50"
      // Using a slightly different background to distinguish from pure background-light/dark
    >
      {/* Optional: Subtle background pattern - uncomment and add your pattern if desired */}
      {/* 
      <div className="absolute inset-0 -z-10 opacity-[0.03] dark:opacity-[0.02]">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg"><defs><pattern id="dotPattern" width="20" height="20" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1" fill="currentColor"/></pattern></defs><rect width="100%" height="100%" fill="url(#dotPattern)" className="text-gray-300 dark:text-gray-700"/></svg>
      </div>
      */}

      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-12 md:mb-16 lg:mb-20"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={sectionHeaderVariants}
        >
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-content-light dark:text-content-dark">
            Recent Job Openings
          </h2>
          <p className="mt-5 sm:mt-6 text-lg sm:text-xl text-subtle-light dark:text-subtle-dark max-w-xl lg:max-w-2xl mx-auto leading-relaxed">
            Explore the latest opportunities posted on our platform by leading companies. Your next career move could be here.
          </p>
        </motion.div>

        {jobs && jobs.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-10 md:mb-12 lg:mb-16">
            {jobFilterCategories.map(category => (
              <motion.button
                key={category}
                onClick={() => setActiveFilter(category)}
                className={`px-3.5 py-1.5 sm:px-5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 ease-in-out border
                  ${activeFilter === category 
                    ? 'bg-primary text-white dark:bg-primary-dark dark:text-gray-900 border-primary dark:border-primary-dark shadow-lg scale-105 ring-2 ring-primary/30 dark:ring-primary-dark/30 ring-offset-2 ring-offset-background-light dark:ring-offset-background-dark' 
                    : 'bg-surface-light dark:bg-surface-dark text-content-light dark:text-content-dark border-border-light dark:border-border-dark hover:bg-primary/10 dark:hover:bg-primary-dark/10 hover:border-primary/30 dark:hover:border-primary-dark/30 hover:text-primary dark:hover:text-primary-dark'
                  }`}
                whileHover={{ y: -3, transition: { duration: 0.15 } }}
                whileTap={{ scale: 0.97 }}
              >
                {category}
              </motion.button>
            ))}
          </div>
        )}

        {/* Log filtered jobs for render check - uncomment if needed */}
        {/* {console.log("[RENDER] Displaying filteredJobs count:", filteredJobs.length, "Active Filter:", activeFilter)} */}
        
        {filteredJobs.length > 0 ? ( // Check filteredJobs.length instead of jobs.length here
          <motion.div 
            className="grid grid-cols-1 gap-x-6 gap-y-8 md:grid-cols-2 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-10"
            key={activeFilter} // Add key here to force re-render of children on filter change, helps with animations
            variants={gridContainerVariants}
            initial="hidden"
            whileInView="visible" // Re-trigger animation when it scrolls into view
            viewport={{ once: true, amount: 0.05 }} 
          >
            {filteredJobs.map((job) => (
              <motion.div key={job.id} variants={jobCardVariants}>
                <JobCard job={job} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.p 
            className="text-center text-lg text-subtle-light dark:text-subtle-dark py-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {jobs.length === 0 ? 'No recent jobs found at the moment.' :
             `No recent ${activeFilter.toLowerCase()} jobs found matching your criteria.`
            } 
            Please check back soon or try a different filter!
          </motion.p>
        )}

        {jobs && jobs.length > 0 && ( 
          <motion.div 
            className="mt-16 md:mt-20 text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            variants={ctaButtonVariants}
            transition={{ 
              delay: (filteredJobs && filteredJobs.length > 0 ? filteredJobs.length * 0.05 : 0) + 0.5, 
              duration: 0.5 
            }}
          >
            <Link
              href="/jobs"
              className="group rounded-lg bg-primary dark:bg-primary-dark px-8 sm:px-10 py-3.5 sm:py-4 text-base md:text-lg font-semibold text-white dark:text-gray-900 shadow-xl hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-all duration-150 transform hover:scale-105 inline-flex items-center gap-2.5"
            >
              View All Jobs <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  );
}