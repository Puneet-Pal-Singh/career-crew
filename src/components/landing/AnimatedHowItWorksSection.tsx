// src/components/landing/AnimatedHowItWorksSection.tsx
'use client';

import { motion, Variants } from 'framer-motion';
import { FileText, Search, UserCheck, LucideIcon, HelpCircle } from 'lucide-react'; 

// Icon mapping for resolving icon names to components
const iconMap: Record<string, LucideIcon> = {
  FileText: FileText,
  Search: Search,
  UserCheck: UserCheck,
  Default: HelpCircle, // Fallback icon
};

// Props for the individual step component (now internal)
interface HowItWorksStepProps {
  icon: LucideIcon;
  stepNumber: number;
  title: string;
  description: string;
  isLast?: boolean;
}

// Internal component for rendering each step with its animated connector
function HowItWorksStepDisplay({ 
  icon: Icon, 
  stepNumber, 
  title, 
  description, 
  isLast = false 
}: HowItWorksStepProps) {
  
  // Variants for the connector line that draws downwards from the icon
  const lineVariants: Variants = {
    hidden: { height: 0, opacity: 0 },
    // Height animates to fill space below the icon within the step item's content area.
    // calc(100% - 3.5rem) roughly accounts for icon container height (h-14 = 3.5rem)
    // This ensures the line doesn't overlap the icon itself.
    visible: { height: 'calc(100% - 3.5rem - 1rem)', opacity: 1, transition: { duration: 0.6, ease: "circOut", delay: 0.3 } }, // Added 1rem for bottom padding of step
  };

  // RGB values for box shadow (ensure these are in your globals.css or similar for CSS variables)
  // Or define them directly if not using CSS variables for this specific shadow.
  const primaryRgbLight = "42, 111, 255"; // For #2A6FFF
  const primaryRgbDark = "90, 159, 255";  // For #5A9FFF

  return (
    // The parent motion.div will pass down 'initial' and 'animate' states
    <div className="relative flex flex-col items-center text-center md:items-start md:text-left pb-4 md:pb-0 h-full">
      {/* Animated Connector Line (for desktop, from icon center downwards) */}
      {!isLast && (
        <motion.div
          className="hidden md:block absolute left-[1.75rem] top-[3.5rem] w-px bg-primary/40 dark:bg-primary-dark/40 -z-10" 
          // left-[1.75rem] is half of h-14 (icon container width/height) to center the line start
          // top-[3.5rem] starts the line just below the icon container
          variants={lineVariants}
        />
      )}

      <div className="flex items-center mb-4 md:mb-5 relative z-0"> {/* z-0 to ensure icon is above the line */}
        <motion.div 
          className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary dark:bg-primary-dark/20 dark:text-primary-dark shadow-lg border border-primary/20"
          whileHover={{ 
            scale: 1.08, 
            boxShadow: `0px 6px 20px rgba(${typeof window !== 'undefined' && document.documentElement.classList.contains('dark') ? primaryRgbDark : primaryRgbLight}, 0.25)` 
          }}
          transition={{ type: "spring", stiffness: 300, damping: 15 }}
        >
          <Icon size={28} strokeWidth={1.75} />
        </motion.div>
        <div className="ml-4">
          <h3 className="text-xl lg:text-2xl font-semibold font-display text-content-light dark:text-content-dark">
            {title}
          </h3>
          <p className="text-xs font-bold uppercase tracking-wider text-primary dark:text-primary-dark opacity-90">
            Step {stepNumber}
          </p>
        </div>
      </div>
      <p className="text-sm lg:text-base text-subtle-light dark:text-subtle-dark leading-relaxed px-2 md:px-0">
        {description}
      </p>
    </div>
  );
}


// Props for the main AnimatedHowItWorksSection component
interface HowItWorksStepClientData {
  iconName: string; // Expecting icon name as a string from page.tsx
  title: string;
  description: string;
}

interface AnimatedHowItWorksSectionProps {
  steps: HowItWorksStepClientData[];
}

export default function AnimatedHowItWorksSection({ steps }: AnimatedHowItWorksSectionProps) {
  // Variants for the section title and paragraph
  const sectionHeaderVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, delay: 0.1, ease: "easeOut" } }
  };

  // Variants for the grid container to stagger its children (the step items)
  const gridContainerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,  // Time between each step item starting its animation
        delayChildren: 0.3,    // Delay before the first step item starts
      },
    },
  };

  // Variants for each individual step item
  const stepItemVariants: Variants = {
    hidden: { opacity: 0, y: 40, scale: 0.9 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: "easeOut" } },
  };

  return (
    <section 
      id="how-it-works" 
      className="py-20 md:py-28 lg:py-32 bg-gradient-to-b from-background-light via-surface-light/40 to-background-light dark:from-background-dark dark:via-surface-dark/40 dark:to-background-dark"
    >
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-16 md:mb-20 lg:mb-24"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }} // Trigger when 30% of this header block is in view
          variants={sectionHeaderVariants}
        >
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-content-light dark:text-content-dark">
            Getting Started is Easy
          </h2>
          <p className="mt-6 text-lg sm:text-xl text-subtle-light dark:text-subtle-dark max-w-xl lg:max-w-2xl mx-auto leading-relaxed">
            Follow these simple steps to connect with opportunities or find the perfect candidate.
          </p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-x-8 lg:gap-x-12 gap-y-16 md:gap-y-10 relative" // Increased mobile gap-y, consistent md gap-y
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }} // Trigger when a small part of the grid is visible
          variants={gridContainerVariants} 
        >
          {steps.map((step, index) => {
            const IconComponent = iconMap[step.iconName] || iconMap.Default; 
            return (
              // This motion.div controls the animation for each step card (including its internal connector line)
              <motion.div key={step.title} variants={stepItemVariants} className="h-full"> {/* Added h-full for consistent line drawing */}
                <HowItWorksStepDisplay
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