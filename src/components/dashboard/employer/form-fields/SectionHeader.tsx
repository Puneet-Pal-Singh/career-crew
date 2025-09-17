// src/components/dashboard/employer/form-fields/SectionHeader.tsx
import { LucideIcon } from 'lucide-react';
import React from 'react';

interface SectionHeaderProps {
  Icon: LucideIcon;
  title: string;
  description: string;
}

export default function SectionHeader({ Icon, title, description }: SectionHeaderProps) {
  return (
    <div className="flex items-start space-x-4">
      <div className="flex-shrink-0">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
          <Icon className="h-6 w-6 text-primary" />
        </div>
      </div>
      <div>
        <h3 className="text-xl font-semibold tracking-tight">{title}</h3>
        <p className="text-muted-foreground text-sm">{description}</p>
      </div>
    </div>
  );
}