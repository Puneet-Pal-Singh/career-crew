// src/components/jobs/JobList.tsx
"use client"; // Can be a client component if JobCard or animations require it,
              // or a server component if JobCard is compatible.
              // Let's assume JobCard might have client-side aspects or Framer Motion.

import type { JobCardData } from '@/types';
import JobCard from '@/components/jobs/JobCard'; // Assuming this path is correct
import { motion } from 'framer-motion'; // If you want animations for cards appearing

interface JobListProps {
  jobs: JobCardData[];
}

export default function JobList({ jobs }: JobListProps) {
  if (!jobs || jobs.length === 0) {
    // This case should ideally be handled by the parent page (jobs/page.tsx)
    // displaying a more prominent "No jobs found" message.
    // However, as a fallback within this component:
    return (
      <div className="text-center py-10 text-muted-foreground">
        <p>No job listings match your current criteria.</p>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.07, // Small delay between each card animating in
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.98 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
  };

  return (
    <motion.div 
      className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 py-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible" // Animate when the component mounts/data changes
    >
      {jobs.map((job) => (
        <motion.div key={job.id} variants={itemVariants}>
          <JobCard job={job} />
        </motion.div>
      ))}
    </motion.div>
  );
}