// src/components/jobs/JobListItem.tsx
"use client";

import type { JobCardData } from '@/types';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { MapPin, Clock, Star, TrendingUp } from 'lucide-react';
import { generateJobSlug, formatDatePosted } from '@/lib/utils';

interface JobListItemProps {
  job: JobCardData;
  featured?: boolean;
}

export default function JobListItem({ job, featured = false }: JobListItemProps) {
  const slug = generateJobSlug(job.id, job.title);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ scale: 1.01 }}
      className="group"
    >
      <Link href={`/jobs/${slug}`} className="block">
        <div className={`
          relative p-6 rounded-xl border bg-white dark:bg-card
          hover:shadow-xl hover:shadow-primary/5 dark:hover:shadow-primary-dark/5
          transition-all duration-300 group-hover:border-primary/30 dark:group-hover:border-primary-dark/30
          ${featured ? 'ring-1 ring-primary/20 dark:ring-primary-dark/20 bg-gradient-to-r from-primary/5 to-secondary/5 dark:from-primary-dark/5 dark:to-secondary-dark/5' : ''}
        `}>

          {/* Featured Badge */}
          {featured && (
            <div className="absolute -top-2 -right-2 z-10">
              <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-primary to-secondary dark:from-primary-dark dark:to-secondary-dark text-white text-xs font-medium shadow-lg">
                <Star size={12} fill="currentColor" />
                <span>Featured</span>
              </div>
            </div>
          )}

          {/* Background Gradient on Hover */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5 dark:from-primary-dark/5 dark:to-secondary-dark/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />

          <div className="relative flex items-start gap-4">
            {/* Company Logo */}
            <div className="relative flex-shrink-0">
              <div className="w-14 h-14 rounded-xl border-2 border-border-light dark:border-border-dark bg-white dark:bg-slate-800 flex items-center justify-center overflow-hidden group-hover:border-primary/30 dark:group-hover:border-primary-dark/30 transition-colors duration-300">
                <Image
                  src={job.companyLogoUrl || '/company-logos/default-company-logo.svg'}
                  alt={`${job.companyName} logo`}
                  width={36}
                  height={36}
                  className="rounded-lg object-contain"
                />
              </div>
              {/* Company logo glow effect */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 dark:from-primary-dark/20 dark:to-secondary-dark/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-sm" />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              {/* Header */}
              <div className="mb-3">
                <h3 className="text-lg font-semibold text-foreground group-hover:text-primary dark:group-hover:text-primary-dark transition-colors duration-300 leading-tight">
                  {job.title}
                </h3>
                <p className="text-sm text-muted-foreground font-medium mt-1">{job.companyName}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Clock size={14} className="text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">{formatDatePosted(job.postedDate)}</span>
                </div>
              </div>

              {/* Job Details */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-3">
                <div className="flex items-center gap-2">
                  <MapPin size={16} className="flex-shrink-0" />
                  <span>{job.location}</span>
                </div>
                {job.jobType && (
                  <div className="px-2 py-1 rounded-md bg-primary/10 dark:bg-primary-dark/10 text-primary dark:text-primary-dark text-xs font-medium">
                    {job.jobType}
                  </div>
                )}
              </div>

              {/* Skills Tags */}
              {job.tags && job.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {job.tags.slice(0, 4).map((tag, idx) => (
                    <span
                      key={`${slug}-tag-${idx}`}
                      className="px-2 py-1 text-xs font-medium rounded-md bg-secondary/10 dark:bg-secondary-dark/10 text-secondary dark:text-secondary-dark border border-secondary/20 dark:border-secondary-dark/20"
                    >
                      {tag}
                    </span>
                  ))}
                  {job.tags.length > 4 && (
                    <span className="px-2 py-1 text-xs text-muted-foreground font-medium">
                      +{job.tags.length - 4} more
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Hover Arrow */}
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex-shrink-0">
              <div className="w-10 h-10 rounded-full bg-primary dark:bg-primary-dark flex items-center justify-center text-white shadow-lg">
                <motion.div
                  initial={{ x: 0 }}
                  whileHover={{ x: 3 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <TrendingUp size={18} />
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}