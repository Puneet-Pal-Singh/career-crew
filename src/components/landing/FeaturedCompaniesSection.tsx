// src/components/landing/FeaturedCompaniesSection.tsx
import FeaturedCompanyLogo from '@/components/landing/FeaturedCompanyLogo';
import type { FeaturedCompanyData } from '@/lib/data/landingContent'; // Assuming type is here

interface FeaturedCompaniesSectionProps {
  companies: FeaturedCompanyData[];
}

export default function FeaturedCompaniesSection({ companies }: FeaturedCompaniesSectionProps) {
  // TODO: Add "Wow Factor" - e.g., scrolling marquee, hover effects, unique background
  return (
    <section id="featured-companies" className="py-16 md:py-24 bg-white dark:bg-transparent">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10 md:mb-16">
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-content-light dark:text-content-dark">
            Trusted by Leading Companies
          </h2>
          <p className="mt-6 text-lg text-subtle-light dark:text-subtle-dark max-w-xl lg:max-w-2xl mx-auto leading-relaxed">
            Proud to partner with innovative organizations of all sizes.
          </p>
        </div>
        {companies && companies.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 gap-12 md:gap-16 items-center justify-items-center">
            {companies.map((company) => (
              <FeaturedCompanyLogo
                key={company.alt}
                src={company.src}
                alt={company.alt}
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-subtle-light dark:text-subtle-dark">
            Our partners will be featured here soon.
          </p>
        )}
      </div>
    </section>
  );
}