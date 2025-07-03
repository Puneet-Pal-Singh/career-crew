// src/components/landing/FeatureItem.tsx
import React from 'react';
import { 
  LucideIcon, 
  Search, 
  Briefcase, 
  Target, 
  Zap, 
  HelpCircle // Fallback
} from 'lucide-react';

// Icon Map for FeatureItem
const featureItemIconMap: Record<string, LucideIcon> = {
  SearchIconForFeatures: Search, // Assuming this is the string you use
  Briefcase: Briefcase,
  Target: Target,
  Zap: Zap,
  Default: HelpCircle,
};

interface FeatureItemProps {
  iconName: string; // Changed from icon: LucideIcon
  title: string;
  description: string;
}

export default function FeatureItem({ iconName, title, description }: FeatureItemProps) {
  const IconComponent = featureItemIconMap[iconName] || featureItemIconMap.Default;

  return (
    <div className="flex flex-col items-center text-center p-6 bg-surface-light dark:bg-surface-dark rounded-xl shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-1.5 border border-border-light dark:border-border-dark">
      <div className="mb-5 p-4 rounded-full bg-primary/10 dark:bg-primary-dark/20 text-primary dark:text-primary-dark inline-flex">
        <IconComponent size={28} strokeWidth={1.75} />
      </div>
      <h3 className="mb-2 text-xl font-semibold font-display text-content-light dark:text-content-dark">{title}</h3>
      <p className="text-sm text-subtle-light dark:text-subtle-dark leading-relaxed">{description}</p>
    </div>
  );
}