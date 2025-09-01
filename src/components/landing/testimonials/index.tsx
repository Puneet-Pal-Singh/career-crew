// src/components/landing/AnimatedTestimonialsSection.tsx
'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import TestimonialCard from '@/components/landing/testimonials/TestimonialCard'; 
import type { TestimonialData as Testimonial } from '@/lib/data/landingContent'; 
import { useRef, type RefObject } from 'react'; // Import RefObject

interface AnimatedTestimonialsSectionProps {
  testimonials: Testimonial[];
}

// Simple Blob component for background decoration with parallax
interface BackgroundParallaxBlobProps {
  className: string;
  initialY: string | number;
  finalY: string | number;
  // Correctly type the ref to accept a div element or null
  scrollTargetRef: RefObject<HTMLDivElement | null>; 
}

function BackgroundParallaxBlob({ 
  className, 
  initialY, 
  finalY,
  scrollTargetRef 
}: BackgroundParallaxBlobProps) {
  const { scrollYProgress } = useScroll({
    target: scrollTargetRef, 
    offset: ["start end", "end start"] 
  });

  const y = useTransform(scrollYProgress, [0, 1], [initialY, finalY]);

  return (
    <motion.div 
      className={`absolute rounded-full filter blur-3xl opacity-25 dark:opacity-20 -z-10 ${className}`}
      style={{ y }} 
    />
  );
}

export default function AnimatedTestimonialsSection({ testimonials }: AnimatedTestimonialsSectionProps) {
  // Initialize the ref with the correct type for a div element
  const sectionRef = useRef<HTMLDivElement>(null); 

  const sectionHeaderVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } }
  };
  
  const gridContainerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { staggerChildren: 0.15, delayChildren: 0.2 } 
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] } },
  };

  return (
    <section 
      ref={sectionRef} 
      id="testimonials" 
      className="py-20 md:py-28 lg:py-32 relative overflow-hidden
                 bg-primary/5 dark:bg-slate-800" 
    >
      <BackgroundParallaxBlob 
        scrollTargetRef={sectionRef} // Pass the correctly typed ref
        className="w-72 h-72 sm:w-96 sm:h-96 bg-secondary/20 dark:bg-secondary-dark/15 top-[5%] left-[-15%]" 
        initialY="-50px" 
        finalY="50px" 
      />
      <BackgroundParallaxBlob 
        scrollTargetRef={sectionRef} // Pass the correctly typed ref
        className="w-60 h-60 sm:w-80 sm:h-80 bg-accent1/20 dark:bg-accent1-dark/15 bottom-[5%] right-[-10%]" 
        initialY="50px" 
        finalY="-50px" 
      />
      
      <div className="container mx-auto px-4 relative z-0">
        <motion.div
          className="text-center mb-16 md:mb-20"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={sectionHeaderVariants}
        >
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-content-light dark:text-content-dark">
            Loved by Job Seekers & Employers
          </h2>
          <p className="mt-6 text-lg sm:text-xl text-subtle-light dark:text-subtle-dark max-w-xl lg:max-w-2xl mx-auto leading-relaxed">
            Hear what our users have to say about their experience with CareerCrew.
          </p>
        </motion.div>
        {testimonials && testimonials.length > 0 ? (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10"
            variants={gridContainerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
          >
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name + index}
                variants={cardVariants}
                whileHover={{ y: -10, scale: 1.03, transition: { duration: 0.25, ease: "backOut" } }}
              >
                <TestimonialCard testimonial={testimonial} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <p className="text-center text-lg text-subtle-light dark:text-subtle-dark">Testimonials are on their way!</p>
        )}
      </div>
    </section>
  );
}