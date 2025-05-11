// src/components/landing/AnimatedHowItWorksSection.tsx
'use client';

import { motion } from 'framer-motion';
// Import ALL Lucide icons that this component might need to render based on iconName strings
import { FileText, Search, UserCheck, LucideIcon, HelpCircle // HelpCircle as a default/fallback
} from 'lucide-react'; 
import HowItWorksStep from '@/components/landing/HowItWorksStep'; // This receives the resolved IconComponent

// Define a mapping from string names to actual icon components
const iconMap: Record<string, LucideIcon> = {
  FileText: FileText,
  Search: Search,
  UserCheck: UserCheck,
  Default: HelpCircle, // A default icon if an iconName doesn't match
};

// Interface for the props received by this client component
interface HowItWorksStepClientData {
  iconName: string; // Expecting icon name as a string from page.tsx
  title: string;
  description: string;
}

interface AnimatedHowItWorksSectionProps {
  steps: HowItWorksStepClientData[];
}

export default function AnimatedHowItWorksSection({ steps }: AnimatedHowItWorksSectionProps) {
  const sectionVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2, 
        delayChildren: 0.2, // Small delay before children start animating
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 }, // Start slightly lower
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  return (
    <section 
      id="how-it-works" 
      className="py-20 md:py-32 bg-background-light dark:bg-background-dark"
    >
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-16 md:mb-20"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }} // Trigger when 30% of element is in view
          variants={sectionVariants} 
        >
          <motion.h2 
            variants={itemVariants} 
            className="font-display text-4xl sm:text-5xl font-bold text-content-light dark:text-content-dark"
          >
            Getting Started is Easy
          </motion.h2>
          <motion.p 
            variants={itemVariants} 
            className="mt-6 text-lg text-subtle-light dark:text-subtle-dark max-w-xl lg:max-w-2xl mx-auto leading-relaxed"
          >
            Follow these simple steps to connect with opportunities or find the perfect candidate.
          </motion.p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 gap-12 md:grid-cols-3 md:gap-8 relative"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={sectionVariants} 
        >
          {steps.map((step, index) => {
            const IconComponent = iconMap[step.iconName] || iconMap.Default; 
            return (
              <motion.div key={step.title} variants={itemVariants}>
                <HowItWorksStep
                  icon={IconComponent} 
                  stepNumber={index + 1}
                  title={step.title}
                  description={step.description}
                  isLast={index === steps.length - 1}
                />
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}