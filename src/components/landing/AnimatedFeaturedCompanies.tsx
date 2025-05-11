// src/components/landing/AnimatedFeaturedCompanies.tsx
'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import type { FeaturedCompanyData } from '@/lib/data/landingContent';

interface AnimatedFeaturedCompaniesProps {
  companies: FeaturedCompanyData[];
  speed?: number; // Pixels per second, approximately
}

export default function AnimatedFeaturedCompanies({ 
  companies, 
  speed = 40 
}: AnimatedFeaturedCompaniesProps) {
  if (!companies || companies.length === 0) {
    return null; // Or a placeholder message
  }

  // Duplicate the array for a seamless loop effect
  const extendedCompanies = [...companies, ...companies];
  const animationDuration = (companies.length * 150) / speed; // Heuristic: 150px per item width average

  return (
    <section id="featured-companies" className="py-20 md:py-28 lg:py-32 bg-background-light dark:bg-background-dark overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-16 md:mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-content-light dark:text-content-dark">
            Trusted by Leading Companies
          </h2>
          <p className="mt-6 text-lg text-subtle-light dark:text-subtle-dark max-w-xl lg:max-w-2xl mx-auto leading-relaxed">
            Proud to partner with innovative organizations of all sizes, helping them find exceptional talent.
          </p>
        </motion.div>
      </div>

      {/* Marquee Container - no container mx-auto here to allow full-width scroll */}
      <div className="relative flex overflow-x-hidden group">
        <motion.div
          className="flex"
          animate={{ x: ['0%', '-100%'] }} // Animate from start to where the first set is off-screen
          transition={{
            ease: 'linear',
            duration: animationDuration,
            repeat: Infinity,
            repeatType: 'loop',
          }}
        >
          {extendedCompanies.map((company, index) => (
            <div 
              key={`${company.alt}-${index}`} 
              className="flex-shrink-0 w-[180px] sm:w-[200px] md:w-[240px] mx-4 sm:mx-6 md:mx-8 flex items-center justify-center h-20" // Fixed width for items
            >
              <Image
                src={company.src} // Ensure these paths are correct in /public
                alt={company.alt}
                width={150} // Max width within the container
                height={60}  // Max height
                className="object-contain max-h-12 sm:max-h-14 grayscale opacity-70 group-hover:opacity-50 hover:!opacity-100 hover:!grayscale-0 transition-all duration-300 dark:brightness-0 dark:invert-[0.85] dark:hover:!brightness-100 dark:hover:!invert-0"
                // Dark mode: invert for light logos on dark bg initially, then revert on hover.
                // Adjust dark:invert value (0.85 is 85% inverted) or remove if logos are dark-theme friendly.
              />
            </div>
          ))}
        </motion.div>
        {/* Optional: Gradient fade on the edges */}
        <div className="absolute inset-y-0 left-0 w-16 sm:w-24 md:w-32 bg-gradient-to-r from-background-light dark:from-background-dark to-transparent pointer-events-none"></div>
        <div className="absolute inset-y-0 right-0 w-16 sm:w-24 md:w-32 bg-gradient-to-l from-background-light dark:from-background-dark to-transparent pointer-events-none"></div>
      </div>
    </section>
  );
}