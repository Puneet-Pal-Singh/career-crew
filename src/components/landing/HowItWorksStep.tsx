// src/components/landing/HowItWorksStep.tsx
import React from 'react';
import { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface HowItWorksStepProps {
  icon: LucideIcon;
  stepNumber: number;
  title: string;
  description: string;
  isLast?: boolean;
}

export default function HowItWorksStep({ 
  icon: Icon, 
  stepNumber, 
  title, 
  description, 
  isLast = false 
}: HowItWorksStepProps) {
  
  const lineVariants = {
    hidden: { height: 0, opacity: 0 },
    visible: { height: 'calc(100% - 3.5rem)', opacity: 1, transition: { duration: 0.5, ease: "circOut" } }, // 3.5rem is approx icon height
  };

  return (
    <div className="relative flex flex-col items-center text-center md:items-start md:text-left pb-8 md:pb-0 h-full"> {/* Ensure h-full for connector */}
      {/* Connector Line (for desktop, from icon center downwards) */}
      {!isLast && (
        <motion.div
          className="hidden md:block absolute left-[1.75rem] top-[3.5rem] w-px bg-primary/30 dark:bg-primary-dark/30 -z-10" // 1.75rem is half of 3.5rem (h-14 icon container)
          variants={lineVariants}
          // Parent (motion.div in AnimatedHowItWorksSection) will trigger 'initial' and 'animate'
        />
      )}

      <div className="flex items-center mb-4 md:mb-5 relative z-0"> {/* z-0 to be above line */}
        <motion.div 
          className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary dark:bg-primary-dark/20 dark:text-primary-dark shadow-lg border border-primary/20"
          whileHover={{ scale: 1.1, boxShadow: "0px 5px 15px rgba(var(--color-primary-rgb), 0.2)" }} // Use your primary color RGB
          transition={{ type: "spring", stiffness: 300, damping: 10 }}
        >
          <Icon size={28} strokeWidth={1.75} />
        </motion.div>
        <div className="ml-4">
          <h3 className="text-xl font-semibold font-display text-content-light dark:text-content-dark">
            {title}
          </h3>
          <p className="text-xs font-bold uppercase tracking-wider text-primary dark:text-primary-dark opacity-90">
            Step {stepNumber}
          </p>
        </div>
      </div>
      <p className="text-sm text-subtle-light dark:text-subtle-dark leading-relaxed px-2 md:px-0">
        {description}
      </p>
    </div>
  );
}