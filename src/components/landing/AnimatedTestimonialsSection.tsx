// src/components/landing/AnimatedTestimonialsSection.tsx
'use client';

import { motion } from 'framer-motion';
import TestimonialCard from '@/components/landing/TestimonialCard'; // Assuming this component doesn't need 'use client' itself

// Define Testimonial type here or import if defined globally
interface Testimonial {
  quote: string;
  name: string;
  role: string;
  avatarUrl: string;
  companyLogoUrl?: string;
}

interface AnimatedTestimonialsSectionProps {
  testimonials: Testimonial[];
}

export default function AnimatedTestimonialsSection({ testimonials }: AnimatedTestimonialsSectionProps) {
  return (
    <section id="testimonials" className="py-16 md:py-24 bg-background-light dark:bg-background-dark">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-content-light dark:text-content-dark">
            Loved by Job Seekers & Employers
          </h2>
          <p className="mt-4 text-md text-subtle-light dark:text-subtle-dark max-w-xl mx-auto leading-relaxed">
            Hear what our users have to say about their experience with CareerCrew.
          </p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <TestimonialCard testimonial={testimonial} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}