// src/components/landing/AnimatedTestimonialsSection.tsx
'use client';

import { motion } from 'framer-motion';
import TestimonialCard from '@/components/landing/TestimonialCard';
import type { TestimonialData as Testimonial } from '@/lib/data/landingContent'; // Use imported type

interface AnimatedTestimonialsSectionProps {
  testimonials: Testimonial[];
}

export default function AnimatedTestimonialsSection({ testimonials }: AnimatedTestimonialsSectionProps) {
  return (
    <section 
      id="testimonials" 
      // Example: Slightly different background using a subtle texture or gradient combination
      className="py-20 md:py-28 lg:py-32 bg-gradient-to-br from-background-light via-primary/5 to-accent1/5 dark:from-background-dark dark:via-primary-dark/5 dark:to-accent1-dark/5 relative overflow-hidden"
    >
      {/* Optional: Add some decorative abstract shapes */}
      {/* 
      <div className="absolute -top-20 -left-20 w-72 h-72 bg-secondary/10 dark:bg-secondary-dark/10 rounded-full filter blur-2xl opacity-50 -z-10"></div>
      <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-accent1/10 dark:bg-accent1-dark/10 rounded-tl-full filter blur-2xl opacity-40 -z-10"></div>
      */}

      <div className="container mx-auto px-4 relative z-0">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16 md:mb-20"
        >
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-content-light dark:text-content-dark">
            Loved by Job Seekers & Employers
          </h2>
          <p className="mt-6 text-lg text-subtle-light dark:text-subtle-dark max-w-xl lg:max-w-2xl mx-auto leading-relaxed">
            Hear what our users have to say about their experience with CareerCrew.
          </p>
        </motion.div>
        {testimonials && testimonials.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name + index} // Ensure unique key if names can repeat
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }} // Trigger a bit earlier
                transition={{ duration: 0.6, delay: index * 0.15, ease: "easeOut" }}
              >
                <TestimonialCard testimonial={testimonial} />
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="text-center text-subtle-light dark:text-subtle-dark">Testimonials coming soon!</p>
        )}
      </div>
    </section>
  );
}