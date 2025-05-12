// src/components/landing/AnimatedBlogPreviewSection.tsx
'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import BlogPreviewCard from './BlogPreviewCard';
import type { BlogPreviewData } from '@/lib/data/landingContent';

interface AnimatedBlogPreviewSectionProps {
  posts: BlogPreviewData[];
}

export default function AnimatedBlogPreviewSection({ posts }: AnimatedBlogPreviewSectionProps) {
  if (!posts || posts.length === 0) {
    return null; // Don't render section if no posts
  }

  const sectionHeaderVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  const gridContainerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.2 } },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: 'easeOut' } },
  };

  return (
    <section 
      id="blog-preview" 
      className="py-20 md:py-28 lg:py-32 bg-background-light dark:bg-background-dark"
      // Could use a subtle pattern or slightly different shade like other sections
      // e.g., bg-slate-50 dark:bg-slate-800/30
    >
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-12 md:mb-16 lg:mb-20"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={sectionHeaderVariants}
        >
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-content-light dark:text-content-dark">
            From Our Blog
          </h2>
          <p className="mt-5 sm:mt-6 text-lg sm:text-xl text-subtle-light dark:text-subtle-dark max-w-xl lg:max-w-2xl mx-auto leading-relaxed">
            Insights, tips, and trends to help you navigate your career or find top talent.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
          variants={gridContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.05 }}
        >
          {posts.slice(0, 3).map((post) => ( // Show max 3 posts for preview
            <motion.div key={post.id} variants={cardVariants}>
              <BlogPreviewCard post={post} />
            </motion.div>
          ))}
        </motion.div>

        {posts.length > 3 && ( // Show "View All Posts" button if there are more than 3
          <motion.div
            className="mt-12 md:mt-16 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <Link
              href="/blog" // Assuming your main blog page is at /blog
              className="group rounded-lg bg-primary dark:bg-primary-dark px-8 sm:px-10 py-3.5 sm:py-4 text-base md:text-lg font-semibold text-white dark:text-gray-900 shadow-xl hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-all duration-150 transform hover:scale-105 inline-flex items-center gap-2.5"
            >
              View All Posts <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  );
}