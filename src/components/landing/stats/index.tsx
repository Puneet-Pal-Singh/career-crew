// src/components/landing/stats/index.tsx
"use client";

import { Briefcase, Building2, Users, Award } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import AnimatedCounter from '@/components/shared/AnimatedCounter';

// --- Sub-component for a single stat item ---
interface StatItemProps {
  icon: LucideIcon;
  count: number;
  label: string;
  plusSign?: boolean;
  suffix?: string;
}

function StatItem({ icon: Icon, count, label, plusSign, suffix }: StatItemProps) {
  return (
    <div className="text-center">
      {/* ✅ DESIGN FIX: Icon is larger and has a subtle background circle for emphasis */}
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
        <Icon className="w-8 h-8 text-primary" />
      </div>
      {/* ✅ DESIGN FIX: Larger, bolder font for the number to create visual hierarchy */}
      <div className="text-4xl md:text-5xl font-bold text-foreground">
        <AnimatedCounter value={count} />
        {plusSign && '+'}
        {suffix}
      </div>
      {/* ✅ DESIGN FIX: Muted color for the label to make the number stand out */}
      <p className="mt-2 text-base text-muted-foreground">{label}</p>
    </div>
  );
}


// --- Main Section Component ---
interface StatData {
  icon: LucideIcon;
  count: number;
  label: string;
  plusSign?: boolean;
  suffix?: string;
}

// ✅ DATA UPDATE: Using the numbers from your new design.
const stats: StatData[] = [
  { icon: Briefcase, count: 50, label: 'Jobs Posted', plusSign: true },
  { icon: Building2, count: 30, label: 'Companies Hiring', plusSign: true },
  { icon: Users, count: 500, label: 'Active Job Seekers', plusSign: true },
  { icon: Award, count: 95, label: 'Placement Success', suffix: '%' },
];

export default function StatsSection() {
  return (
    // ✅ DESIGN FIX: Swapped the boring bg-muted for a subtle, professional gradient.
    <section 
      id="stats" 
      className="py-16 sm:py-24 bg-gradient-to-b from-blue-50/50 to-white dark:from-slate-900/50 dark:to-background"
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            CareerCrew by the Numbers
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Fueling careers and connecting talent with impactful results.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <StatItem 
              key={stat.label}
              icon={stat.icon} 
              count={stat.count} 
              label={stat.label}
              plusSign={stat.plusSign}
              suffix={stat.suffix}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
