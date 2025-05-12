// src/components/landing/FeaturesSection.tsx
import FeatureItem from '@/components/landing/FeatureItem';
// Ensure FeatureData is imported correctly and matches the one with iconName
import type { FeatureData } from '@/lib/data/landingContent'; 

interface FeaturesSectionProps {
  features: FeatureData[]; // This FeatureData should have iconName: string
}

export default function FeaturesSection({ features }: FeaturesSectionProps) {
  // This section can remain a Server Component.
  // FeatureItem itself now handles resolving the iconName.
  return (
    <section 
      id="features" 
      className="py-20 md:py-28 lg:py-32 bg-gradient-to-b from-surface-light/70 via-background-light to-surface-light/70 dark:from-surface-dark/70 dark:via-background-dark dark:to-surface-dark/70"
      // Slightly adjusted background for visual difference
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 md:mb-20">
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-content-light dark:text-content-dark">
            Why Choose CareerCrew?
          </h2>
          <p className="mt-6 text-lg sm:text-xl text-subtle-light dark:text-subtle-dark max-w-xl lg:max-w-2xl mx-auto leading-relaxed">
            We provide a seamless and effective platform for job seekers and employers alike, focusing on quality connections and user experience.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {features.map((feature) => (
            <FeatureItem
              key={feature.title}
              iconName={feature.iconName} // Pass iconName instead of icon
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
}