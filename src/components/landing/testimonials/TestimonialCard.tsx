// src/components/landing/TestimonialCard.tsx
import Image from 'next/image';
import { QuoteIcon } from 'lucide-react'; // Using QuoteIcon for a more common quote visual

interface Testimonial {
  quote: string;
  name: string;
  role: string;
  avatarUrl: string;
  companyLogoUrl?: string;
}

interface TestimonialCardProps {
  testimonial: Testimonial;
}

export default function TestimonialCard({ testimonial }: TestimonialCardProps) {
  return (
    <div className="flex flex-col h-full bg-surface-light dark:bg-surface-dark p-6 md:p-8 rounded-xl shadow-lg 
                    border border-border-light dark:border-border-dark 
                    hover:shadow-2xl hover:border-primary/40 dark:hover:border-primary-dark/40 
                    transition-all duration-300 transform hover:-translate-y-1.5">
      <QuoteIcon className="w-10 h-10 text-primary dark:text-primary-dark mb-5 opacity-80" strokeWidth={1.5} />
      
      <blockquote className="flex-grow text-content-light dark:text-content-dark text-base md:text-lg leading-relaxed mb-6 relative">
        {/* Optional: Subtle quote marks background */}
        {/* <span className="absolute -top-2 -left-2 text-6xl text-primary/10 dark:text-primary-dark/10 font-serif select-none">“</span> */}
        <p className="relative">{testimonial.quote}</p>
      </blockquote>
      
      <footer className="flex items-center mt-auto pt-4 border-t border-border-light/50 dark:border-border-dark/50">
        <Image
          src={testimonial.avatarUrl} // Ensure these paths are valid in /public/avatars/
          alt={testimonial.name}
          width={52} // Slightly larger avatar
          height={52}
          className="rounded-full mr-4 object-cover ring-2 ring-primary/20 dark:ring-primary-dark/20"
        />
        <div className="flex-grow">
          <p className="font-semibold text-lg text-content-light dark:text-content-dark">{testimonial.name}</p>
          <p className="text-sm text-subtle-light dark:text-subtle-dark">{testimonial.role}</p>
        </div>
        {testimonial.companyLogoUrl && (
          <div className="ml-4 flex-shrink-0">
            <Image
              src={testimonial.companyLogoUrl} // Ensure paths are valid
              alt={`${testimonial.name}'s company logo`}
              width={80}
              height={32}
              className="object-contain opacity-60 dark:brightness-0 dark:invert-[0.75]"
            />
          </div>
        )}
      </footer>
    </div>
  );
}