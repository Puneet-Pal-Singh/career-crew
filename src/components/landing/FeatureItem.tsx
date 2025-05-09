// src/components/landing/FeatureItem.tsx
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface FeatureItemProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export default function FeatureItem({ icon: Icon, title, description }: FeatureItemProps) {
  return (
    <div className="flex flex-col items-center text-center p-6 bg-background-light dark:bg-background-dark rounded-lg shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border border-surface-light dark:border-surface-dark">
      <div className="mb-5 p-4 rounded-full bg-primary/10 dark:bg-primary/20 text-primary inline-flex">
        <Icon size={28} strokeWidth={1.75} />
      </div>
      <h3 className="mb-2 text-xl font-semibold font-display text-content-light dark:text-content-dark">{title}</h3>
      <p className="text-sm text-subtle-light dark:text-subtle-dark leading-relaxed">{description}</p>
    </div>
  );
}