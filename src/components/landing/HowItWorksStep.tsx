// src/components/landing/HowItWorksStep.tsx
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface HowItWorksStepProps {
  icon: LucideIcon;
  stepNumber: number;
  title: string;
  description: string;
  isLast?: boolean;
}

export default function HowItWorksStep({ icon: Icon, stepNumber, title, description, isLast = false }: HowItWorksStepProps) {
  return (
    <div className="relative flex flex-col items-center text-center md:items-start md:text-left">
      <div className="flex items-center mb-4 md:mb-6">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 dark:bg-primary/20 text-primary">
          <Icon size={24} strokeWidth={2} />
        </div>
        <div className="ml-4">
          <h3 className="text-lg font-semibold font-display text-content-light dark:text-content-dark">
            {title}
          </h3>
          <p className="text-sm text-subtle-light dark:text-subtle-dark">Step {stepNumber}</p>
        </div>
      </div>
      <p className="text-sm text-subtle-light dark:text-subtle-dark leading-relaxed">{description}</p>
      
      {/* Connector line for larger screens, not for the last item */}
      {!isLast && (
        <div className="hidden md:block absolute top-6 left-6 h-full w-px -translate-x-1/2 translate-y-6 bg-borderDark-DEFAULT/50 dark:bg-borderDark-DEFAULT/30" />
      )}
    </div>
  );
}