// src/components/landing/AnimatedFeaturedCompanies.tsx
'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import type { FeaturedCompanyData } from '@/lib/data/landingContent';
import { useEffect, useRef, useState } from 'react'; // Import useRef and useState

interface AnimatedFeaturedCompaniesProps {
  companies: FeaturedCompanyData[];
  speedFactor?: number; // Higher is faster, lower is slower. Default 1.
}

export default function AnimatedFeaturedCompanies({ 
  companies, 
  speedFactor = 0.8 // Adjusted for a moderate default speed
}: AnimatedFeaturedCompaniesProps) {
  const [animationDuration, setAnimationDuration] = useState(20); // Default duration
  const marqueeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (marqueeRef.current && companies.length > 0) {
      // Calculate width of a single set of items
      // This assumes all items have roughly the same effective width due to fixed w- class and margins
      const firstChild = marqueeRef.current.firstChild as HTMLElement;
      if (firstChild) {
        const itemWidthWithMargin = firstChild.offsetWidth + (parseFloat(getComputedStyle(firstChild).marginLeft) + parseFloat(getComputedStyle(firstChild).marginRight));
        const singleSetWidth = itemWidthWithMargin * companies.length;
        
        // Duration = Distance / Speed. Let's define speed in px/sec
        const desiredSpeedPxPerSec = 50 * speedFactor; // e.g., 50px per second
        if (singleSetWidth > 0 && desiredSpeedPxPerSec > 0) {
          setAnimationDuration(singleSetWidth / desiredSpeedPxPerSec);
        }
      }
    }
  }, [companies, speedFactor]);


  if (!companies || companies.length === 0) {
    return null;
  }

  // We need to render at least two sets for a smooth loop if the content is narrow
  // If content is already wider than screen, one duplication might be enough.
  // For robustness, always duplicate once.
  const duplicatedCompanies = [...companies, ...companies];

  return (
    <section id="featured-companies" className="py-20 md:py-28 lg:py-32 bg-background-light dark:bg-background-dark overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div /* ... section header ... */ 
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

      <div className="relative flex overflow-x-hidden group py-4"> {/* Added py-4 for some vertical breathing room */}
        <motion.div
          ref={marqueeRef} // Add ref here
          className="flex whitespace-nowrap" // Ensure items don't wrap
          animate={{ x: [0, - (marqueeRef.current?.scrollWidth || 0) / 2] }} // Animate by half of the total width of duplicated items
          transition={{
            x: {
              repeat: Infinity,
              repeatType: 'loop',
              duration: animationDuration,
              ease: 'linear',
            },
          }}
        >
          {duplicatedCompanies.map((company, index) => (
            <div 
              key={`${company.alt}-${index}`} 
              className="flex-shrink-0 w-[160px] sm:w-[180px] md:w-[220px] mx-4 sm:mx-5 md:mx-6 flex items-center justify-center h-20"
            >
              <Image
                src={company.src}
                alt={company.alt}
                width={140} 
                height={55}
                className="object-contain max-h-12 sm:max-h-14 grayscale opacity-70 group-hover:opacity-50 hover:!opacity-100 hover:!grayscale-0 transition-all duration-300 dark:brightness-0 dark:invert-[0.85] dark:hover:!brightness-100 dark:hover:!invert-0"
              />
            </div>
          ))}
        </motion.div>
        <div className="absolute inset-y-0 left-0 w-16 sm:w-24 md:w-32 bg-gradient-to-r from-background-light dark:from-background-dark to-transparent pointer-events-none z-10"></div>
        <div className="absolute inset-y-0 right-0 w-16 sm:w-24 md:w-32 bg-gradient-to-l from-background-light dark:from-background-dark to-transparent pointer-events-none z-10"></div>
      </div>
    </section>
  );
}