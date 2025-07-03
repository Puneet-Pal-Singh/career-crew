// src/components/landing/AnimatedFeaturedCompanies.tsx
'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import type { FeaturedCompanyData } from '@/lib/data/landingContent';
import { useEffect, useRef, useState } from 'react';

interface AnimatedFeaturedCompaniesProps {
  companies: FeaturedCompanyData[];
  speedFactor?: number; // Adjust speed: e.g., 1 is normal, 0.5 is slower, 2 is faster
}

export default function AnimatedFeaturedCompanies({ 
  companies, 
  speedFactor = 0.7 // Let's try a slightly slower default
}: AnimatedFeaturedCompaniesProps) {
  const [animationDuration, setAnimationDuration] = useState(30); // Default duration
  const containerRef = useRef<HTMLDivElement>(null); // Ref for the inner container of ONE set
  const outerMarqueeRef = useRef<HTMLDivElement>(null); // Ref for the scrolling motion.div

  useEffect(() => {
    if (containerRef.current && companies.length > 0) {
      const singleSetWidth = containerRef.current.offsetWidth;
      const desiredSpeedPxPerSec = 40 * speedFactor; // Base speed
      
      if (singleSetWidth > 0 && desiredSpeedPxPerSec > 0) {
        const duration = singleSetWidth / desiredSpeedPxPerSec;
        setAnimationDuration(Math.max(10, duration)); // Ensure a minimum duration
      }
    }
  }, [companies, speedFactor]);

  if (!companies || companies.length === 0) {
    return null;
  }

  // Render the original set twice side-by-side
  const renderCompanySet = (keyPrefix: string) => (
    companies.map((company, index) => (
      <div 
        key={`${keyPrefix}-${company.alt}-${index}`} 
        className="flex-shrink-0 w-[160px] sm:w-[180px] md:w-[200px] mx-4 sm:mx-5 md:mx-6 flex items-center justify-center h-20" // Slightly reduced widths
      >
        <Image
          src={company.src}
          alt={company.alt}
          width={130} 
          height={50}
          className="object-contain max-h-10 sm:max-h-12 grayscale opacity-60 group-hover:opacity-40 hover:!opacity-100 hover:!grayscale-0 transition-all duration-300 
                     dark:brightness-0 dark:invert-[0.75] dark:group-hover:opacity-50 dark:hover:!brightness-100 dark:hover:!invert-0"
        />
      </div>
    ))
  );

  return (
    <section id="featured-companies" className="py-16 md:py-24 lg:py-28 bg-background-light dark:bg-background-dark overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-12 md:mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-content-light dark:text-content-dark">
            Trusted by Leading Companies
          </h2>
          <p className="mt-4 sm:mt-5 text-md sm:text-lg text-subtle-light dark:text-subtle-dark max-w-lg lg:max-w-xl mx-auto leading-relaxed">
            Proud to partner with innovative organizations of all sizes.
          </p>
        </motion.div>
      </div>

      <div className="relative flex overflow-x-hidden group py-4">
        <motion.div
          ref={outerMarqueeRef}
          className="flex whitespace-nowrap"
          animate={{ x: [0, -(containerRef.current?.offsetWidth || 0)] }} // Animate by width of ONE set
          transition={{
            x: {
              repeat: Infinity,
              repeatType: 'loop',
              duration: animationDuration,
              ease: 'linear',
            },
          }}
        >
          {/* Render the first set and attach the ref to it */}
          <div ref={containerRef} className="flex flex-shrink-0">
            {renderCompanySet("set1")}
          </div>
          {/* Render the second set for seamless looping */}
          <div className="flex flex-shrink-0">
            {renderCompanySet("set2")}
          </div>
        </motion.div>
        <div className="absolute inset-y-0 left-0 w-12 sm:w-16 md:w-24 bg-gradient-to-r from-background-light dark:from-background-dark to-transparent pointer-events-none z-10"></div>
        <div className="absolute inset-y-0 right-0 w-12 sm:w-16 md:w-24 bg-gradient-to-l from-background-light dark:from-background-dark to-transparent pointer-events-none z-10"></div>
      </div>
    </section>
  );
}