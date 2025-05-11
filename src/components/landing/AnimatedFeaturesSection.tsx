// src/components/landing/AnimatedFeaturesSection.tsx
'use client';

import { motion } from 'framer-motion';
// Import the FeatureData type which now should have 'iconName: string'
import type { FeatureData as FeatureDataTypeFromLib } from '@/lib/data/landingContent'; 

// Import ALL Lucide icons that this component might need to render based on iconName strings
import { 
  Search, 
  Briefcase, 
  Target, 
  Zap, 
  LucideIcon, 
  HelpCircle // Fallback icon
} from 'lucide-react';

// Icon Map for Features
// Ensure the keys here match the string values you use for 'iconName' in your data
const featureIconMap: Record<string, LucideIcon> = {
  SearchIconForFeatures: Search, // If "SearchIconForFeatures" is the string name you use
  Briefcase: Briefcase,
  Target: Target,
  Zap: Zap,
  Default: HelpCircle, // Fallback if an iconName doesn't match
};

// Props for the individual animated feature item/row
interface AnimatedFeatureDetailProps {
  iconName: string; // Expecting icon name as a string
  title: string;
  description: string;
  isVisualLeft?: boolean; // To alternate layout
  illustrationUrl?: string; // Optional: For a larger custom illustration
}

function AnimatedFeatureDetail({ 
  iconName, 
  title, 
  description, 
  isVisualLeft = false, 
  illustrationUrl 
}: AnimatedFeatureDetailProps) {
  const textOrder = isVisualLeft ? 'md:order-2' : 'md:order-1';
  const visualOrder = isVisualLeft ? 'md:order-1' : 'md:order-2';

  const itemVariants = {
    hidden: { opacity: 0, x: isVisualLeft ? -50 : 50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  };

  // Resolve the icon component based on the name
  const IconComponent = featureIconMap[iconName] || featureIconMap.Default;

  return (
    <motion.div
      className="grid md:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center py-10 md:py-12"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }} // Trigger animation when 30% of the element is in view
      // Stagger animation of children (text block and visual block)
      variants={{ 
        hidden: { opacity: 0 }, 
        visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.1 } } 
      }}
    >
      {/* Text Content Block */}
      <motion.div className={textOrder} variants={itemVariants}>
        <h3 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-content-light dark:text-content-dark mb-4 md:mb-5">
          {title}
        </h3>
        <p className="text-base sm:text-lg text-subtle-light dark:text-subtle-dark leading-relaxed md:leading-loose">
          {description}
        </p>
        {/* Optional: Add a CTA button related to the feature if desired */}
        {/* 
        <motion.div className="mt-6" variants={itemVariants}>
          <Link href="/some-feature-link" className="text-primary dark:text-primary-dark hover:underline font-medium">
            Learn More <ArrowRight className="inline w-4 h-4" />
          </Link>
        </motion.div> 
        */}
      </motion.div>

      {/* Visual Content Block */}
      <motion.div 
        className={`flex items-center justify-center ${visualOrder} min-h-[200px] md:min-h-[250px]`} // Ensure visual block has some min height
        variants={itemVariants}
      >
        {illustrationUrl ? (
          // If you have custom illustration URLs for each feature
          // eslint-disable-next-line @next/next/no-img-element
          <img 
            src={illustrationUrl} 
            alt={`${title} illustration`} 
            className="w-full max-w-xs sm:max-w-sm h-auto rounded-lg object-contain" 
          />
        ) : (
          // Fallback to using the Lucide icon, but larger
          <div className="p-6 sm:p-8 bg-primary/10 dark:bg-primary-dark/15 rounded-2xl inline-flex shadow-lg">
            <IconComponent 
              className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 text-primary dark:text-primary-dark" 
              strokeWidth={1.5} 
            />
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

// Props for the main AnimatedFeaturesSection component
interface AnimatedFeaturesSectionProps {
  features: FeatureDataTypeFromLib[]; // Uses the imported type which should have iconName
}

export default function AnimatedFeaturesSection({ features }: AnimatedFeaturesSectionProps) {
  return (
    <section 
      id="features" 
      className="py-20 md:py-28 lg:py-32 bg-gradient-to-b from-background-light via-surface-light/50 to-background-light dark:from-background-dark dark:via-surface-dark/50 dark:to-background-dark relative overflow-hidden"
      // Example of a slightly different background for this section
    >
      {/* Optional: Decorative elements for "wow" factor */}
      {/* 
      <div className="absolute inset-0 -z-10 opacity-5 dark:opacity-[0.03]">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="subtleGrid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#subtleGrid)"/>
        </svg>
      </div>
      */}
      
      <div className="container mx-auto px-4 relative z-0">
        <motion.div
          className="text-center mb-16 md:mb-20 lg:mb-24"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-content-light dark:text-content-dark">
            Why Choose CareerCrew?
          </h2>
          <p className="mt-5 sm:mt-6 text-lg sm:text-xl text-subtle-light dark:text-subtle-dark max-w-xl lg:max-w-2xl mx-auto leading-relaxed">
            Unlock features designed for your success, connecting talent and opportunity seamlessly.
          </p>
        </motion.div>

        <div className="space-y-16 md:space-y-20 lg:space-y-24">
          {features.map((feature, index) => (
            <AnimatedFeatureDetail
              key={feature.title}
              iconName={feature.iconName} // Pass the iconName string
              title={feature.title}
              description={feature.description}
              isVisualLeft={index % 2 !== 0} // Alternates layout: 0=text left, 1=visual left, 2=text left...
              illustrationUrl={feature.illustrationUrl} // Pass the optional illustration URL
            />
          ))}
        </div>
      </div>
    </section>
  );
}