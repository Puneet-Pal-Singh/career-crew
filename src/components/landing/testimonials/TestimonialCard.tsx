// src/components/landing/testimonials/TestimonialCard.tsx
import Image from 'next/image';

interface Testimonial {
  quote: string;
  name: string;
  role: string;
  avatarUrl: string;
}

interface TestimonialCardProps {
  testimonial: Testimonial;
}

export default function TestimonialCard({ testimonial }: TestimonialCardProps) {
  return (
    // This is the individual slide. It needs to be flexible for the carousel.
    <div className="flex-[0_0_100%]">
      <figure className="flex flex-col items-center justify-center text-center">
        <blockquote className="max-w-2xl mx-auto">
          <p className="text-xl md:text-2xl lg:text-3xl font-medium text-foreground">
            &quot;{testimonial.quote}&quot;
          </p>
        </blockquote>
        <figcaption className="flex items-center justify-center mt-6 space-x-3">
          <Image
            src={testimonial.avatarUrl}
            alt={testimonial.name}
            width={48}
            height={48}
            className="rounded-full"
          />
          <div className="flex items-center divide-x-2 divide-gray-500 dark:divide-gray-400">
            <cite className="pr-3 font-medium text-foreground">{testimonial.name}</cite>
            <cite className="pl-3 text-sm text-muted-foreground">{testimonial.role}</cite>
          </div>
        </figcaption>
      </figure>
    </div>
  );
}