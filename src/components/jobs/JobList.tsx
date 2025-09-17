// src/components/jobs/JobList.tsx
"use client";

import type { JobCardData } from '@/types';
import JobCard from '@/components/jobs/JobCard';
import { motion, Variants } from 'framer-motion'; // It's good practice to import the Variants type

interface JobListProps {
  jobs: JobCardData[];
}

export default function JobList({ jobs }: JobListProps) {
  if (!jobs || jobs.length === 0) {
    return (
      <div className="text-center py-10 text-muted-foreground">
        <p>No job listings match your current criteria.</p>
      </div>
    );
  }

  // Explicitly typing the variants can help catch errors sooner
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.07,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20, scale: 0.98 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.4,
        // THE FIX: "easeOut" is a valid value. The error is a TypeScript inference issue.
        // By explicitly typing the variants with the 'Variants' type, we help TypeScript
        // correctly check the properties. The value itself was correct.
        ease: "easeOut",
      },
    },
  };

  return (
    <motion.div 
      className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 py-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {jobs.map((job) => (
        <motion.div key={job.id} variants={itemVariants}>
          <JobCard job={job} />
        </motion.div>
      ))}
    </motion.div>
  );
}