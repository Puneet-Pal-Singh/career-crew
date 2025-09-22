// src/components/jobs/JobCard.tsx
"use client";

import type { JobCardData } from '@/types';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { MapPin, DollarSign, Clock, Star } from 'lucide-react';
import { generateJobSlug, formatDatePosted } from '@/lib/utils';

// Helper to format salary into the "$120k - $160k" format
const formatSalary = (min?: number | null, max?: number | null): string | null => {
  if (!min || !max) return null;
  const minK = Math.round(min / 1000);
  const maxK = Math.round(max / 1000);
  return `$${minK}k - $${maxK}k`;
};

interface JobCardProps {
  job: JobCardData;
  featured?: boolean;
}

export default function JobCard({ job, featured = false }: JobCardProps) {
  const slug = generateJobSlug(job.id, job.title);
  const salaryDisplay = formatSalary(job.salaryMin, job.salaryMax);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -4 }}
      className="group h-full"
    >
      <Link href={`/jobs/${slug}`} className="block h-full">
        <div className={`
          relative overflow-hidden rounded-xl border bg-white dark:bg-card
          hover:shadow-2xl hover:shadow-primary/10 dark:hover:shadow-primary-dark/10
          transition-all duration-500 group-hover:border-primary/30 dark:group-hover:border-primary-dark/30
          ${featured ? 'ring-2 ring-primary/20 dark:ring-primary-dark/20' : ''}
          backdrop-blur-sm h-full flex flex-col
        `}>
          {/* Featured Badge */}
          {featured && (
            <div className="absolute top-3 right-3 z-10">
              <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-gradient-to-r from-primary to-secondary dark:from-primary-dark dark:to-secondary-dark text-white text-xs font-medium">
                <Star size={12} fill="currentColor" />
                <span>Featured</span>
              </div>
            </div>
          )}

          {/* Background Gradient on Hover */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 dark:from-primary-dark/5 dark:to-secondary-dark/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          <div className="relative p-4 flex flex-col h-full">
            {/* Header Section */}
            <div className="flex items-start gap-3 mb-3">
              <div className="relative flex-shrink-0">
                <div className="w-10 h-10 rounded-lg border-2 border-border-light dark:border-border-dark bg-white dark:bg-slate-800 flex items-center justify-center overflow-hidden group-hover:border-primary/30 dark:group-hover:border-primary-dark/30 transition-colors duration-300">
                  <Image
                    src={job.companyLogoUrl || '/company-logos/default-company-logo.svg'}
                    alt={`${job.companyName} logo`}
                    width={24}
                    height={24}
                    className="rounded object-contain"
                  />
                </div>
                {/* Company logo glow effect on hover */}
                <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 dark:from-primary-dark/20 dark:to-secondary-dark/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-sm" />
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-base leading-tight text-foreground group-hover:text-primary dark:group-hover:text-primary-dark transition-colors duration-300 line-clamp-2">
                  {job.title}
                </h3>
                <p className="text-sm text-muted-foreground mt-1 font-medium truncate">{job.companyName}</p>
                <div className="flex items-center gap-1 mt-1">
                  <Clock size={12} className="text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">{formatDatePosted(job.postedDate)}</span>
                </div>
              </div>
            </div>

            {/* Job Details */}
            <div className="space-y-2 mb-3 flex-1">
              <div className="flex items-center gap-2 text-sm">
                <div className="flex items-center gap-1 text-muted-foreground">
                  <MapPin size={14} className="flex-shrink-0" />
                  <span className="truncate">{job.location}</span>
                </div>
                {job.jobType && (
                  <div className="px-2 py-0.5 rounded-md bg-primary/10 dark:bg-primary-dark/10 text-primary dark:text-primary-dark text-xs font-medium">
                    {job.jobType}
                  </div>
                )}
              </div>

              {salaryDisplay && (
                <div className="flex items-center gap-1 text-sm">
                  <DollarSign size={14} className="text-green-600 dark:text-green-400 flex-shrink-0" />
                  <span className="font-semibold text-green-600 dark:text-green-400">{salaryDisplay}</span>
                </div>
              )}
            </div>

            {/* Skills Tags */}
            {job.tags && job.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-auto">
                {job.tags.slice(0, 3).map((tag, idx) => (
                  <span
                    key={`${slug}-tag-${idx}`}
                    className="px-2 py-0.5 text-xs font-medium rounded-md bg-secondary/10 dark:bg-secondary-dark/10 text-secondary dark:text-secondary-dark border border-secondary/20 dark:border-secondary-dark/20"
                  >
                    {tag}
                  </span>
                ))}
                {job.tags.length > 3 && (
                  <span className="px-2 py-0.5 text-xs text-muted-foreground font-medium">
                    +{job.tags.length - 3}
                  </span>
                )}
              </div>
            )}

            {/* Hover Action Indicator */}
            <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="w-6 h-6 rounded-full bg-primary dark:bg-primary-dark flex items-center justify-center text-white shadow-lg">
                <motion.div
                  initial={{ x: 0 }}
                  whileHover={{ x: 1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  →
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}