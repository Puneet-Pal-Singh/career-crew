// src/components/landing/TestimonialCard.tsx
import Image from 'next/image';
import { Quote } from 'lucide-react'; // Icon for quote

interface Testimonial {
  quote: string;
  name: string;
  role: string;
  avatarUrl: string; // URL to an avatar image
  companyLogoUrl?: string; // Optional company logo
}

interface TestimonialCardProps {
  testimonial: Testimonial;
}

export default function TestimonialCard({ testimonial }: TestimonialCardProps) {
  return (
    <div className="flex flex-col h-full bg-surface-light dark:bg-surface-dark p-6 md:p-8 rounded-xl shadow-lg border border-transparent hover:border-primary/30 dark:hover:border-primary-dark/30 transition-all duration-300 transform hover:-translate-y-1">
      <Quote className="w-8 h-8 text-primary dark:text-primary-dark mb-4" strokeWidth={1.5} />
      <blockquote className="flex-grow text-content-light dark:text-content-dark text-base md:text-lg leading-relaxed mb-6">
        “{testimonial.quote}”
      </blockquote>
      <footer className="flex items-center">
        <Image
          src={testimonial.avatarUrl}
          alt={testimonial.name}
          width={48}
          height={48}
          className="rounded-full mr-4 object-cover"
        />
        <div>
          <p className="font-semibold text-content-light dark:text-content-dark">{testimonial.name}</p>
          <p className="text-sm text-subtle-light dark:text-subtle-dark">{testimonial.role}</p>
        </div>
        {testimonial.companyLogoUrl && (
          <Image
            src={testimonial.companyLogoUrl}
            alt="Company logo"
            width={80}
            height={32}
            className="ml-auto object-contain opacity-70 dark:invert-[0.8]" // Dark mode invert for light logos
          />
        )}
      </footer>
    </div>
  );
}