// src/components/landing/FeaturesSection.tsx
import FeatureItem from '@/components/landing/FeatureItem';
import type { FeatureData } from '@/lib/data/landingContent'; // Import type

interface FeaturesSectionProps {
  features: FeatureData[];
}

export default function FeaturesSection({ features }: FeaturesSectionProps) {
  // This section could be a Client Component if you want Framer Motion animations on the section itself or items.
  // For now, assuming it's a Server Component that renders presentational FeatureItem components.
  return (
    <section id="features" className="py-20 md:py-32 bg-gradient-to-b from-surface-light to-background-light dark:from-surface-dark dark:to-background-dark">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 md:mb-20">
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-content-light dark:text-content-dark">
            Why Choose CareerCrew?
          </h2>
          <p className="mt-6 text-lg text-subtle-light dark:text-subtle-dark max-w-xl lg:max-w-2xl mx-auto leading-relaxed">
            We provide a seamless and effective platform for job seekers and employers alike, focusing on quality connections and user experience.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <FeatureItem
              key={feature.title}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
}