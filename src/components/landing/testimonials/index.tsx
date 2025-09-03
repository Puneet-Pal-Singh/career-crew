// src/components/landing/testimonials/index.tsx
"use client"; // ✅ THE FIX: This directive MUST be at the top of this file.

import React, { useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import TestimonialCard from './TestimonialCard';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface Testimonial {
  quote: string;
  name: string;
  role: string;
  avatarUrl: string;
}

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
}

export default function TestimonialsSection({ testimonials }: TestimonialsSectionProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true }, 
    [Autoplay({ delay: 5000, stopOnInteraction: true })]
  );

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  if (!testimonials || testimonials.length === 0) {
    return null;
  }

  return (
    <section id="testimonials" className="py-20 md:py-28 bg-white dark:bg-slate-900/50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-12 items-center">
          
          <div className="lg:col-span-1 text-center lg:text-left">
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground">
              From our community.
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Here&apos;s what other professionals had to say about their experience with CareerCrew.
            </p>
            <div className="hidden lg:flex items-center gap-4 mt-8">
              <Button variant="outline" size="icon" onClick={scrollPrev} aria-label="Previous testimonial">
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={scrollNext} aria-label="Next testimonial">
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="lg:col-span-2 mt-12 lg:mt-0">
            <div className="overflow-hidden" ref={emblaRef}>
              <div className="flex">
                {testimonials.map((testimonial, idx) => (
                  <TestimonialCard key={`${testimonial.name}-${idx}`} testimonial={testimonial} />
                ))}
              </div>
            </div>
          </div>

          <div className="lg:hidden flex items-center justify-center gap-4 mt-8">
            <Button variant="outline" size="icon" onClick={scrollPrev} aria-label="Previous testimonial">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={scrollNext} aria-label="Next testimonial">
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
          
        </div>
      </div>
    </section>
  );
}