// src/components/landing/AnimatedStatsSection.tsx
'use client';

import { motion } from 'framer-motion';
import StatItem from './StatItem';
import { Briefcase, Building2, Users, Award } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface StatData {
  icon: LucideIcon;
  count: number;
  label: string;
  plusSign?: boolean;
  suffix?: string;
}

const stats: StatData[] = [
  { icon: Briefcase, count: 1250, label: 'Jobs Posted', plusSign: true },
  { icon: Building2, count: 300, label: 'Companies Hiring', plusSign: true },
  { icon: Users, count: 5000, label: 'Active Job Seekers', plusSign: true },
  { icon: Award, count: 95, label: 'Placement Success', suffix: '%' },
];

export default function AnimatedStatsSection() {
  const sectionVariants = { /* ... (same as before) ... */ };
  const itemContainerVariants = { /* ... (same as before) ... */ };

  // Define text colors for this specific section variation
  const headlineColorClass = "text-content-light dark:text-content-dark"; // Black/dark text for headline
  const numberAndLabelColorClass = "text-content-light dark:text-content-dark"; // Black/dark text for numbers & labels
  const iconColorClass = "text-primary dark:text-primary-dark"; // Icons can remain theme primary, or also black if desired
  // If you want icons to also be black:
  // const iconColorClass = "text-content-light dark:text-content-dark";


  return (
    <section 
      id="stats" 
      className="py-20 md:py-28 lg:py-32 
                 bg-gradient-to-r from-primary to-secondary dark:from-primary-dark dark:to-secondary-dark" 
    >
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-16 md:mb-20"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className={`font-display text-4xl sm:text-5xl font-bold mb-4 ${headlineColorClass}`}>
            CareerCrew by the Numbers
          </h2>
          <p className={`text-lg sm:text-xl opacity-90 max-w-xl lg:max-w-2xl mx-auto ${headlineColorClass}`}>
            {/* Subtitle also uses headlineColorClass for consistency with the title */}
            Fueling careers and connecting talent with impactful results.
          </p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {stats.map((stat) => (
            <motion.div key={stat.label} variants={itemContainerVariants}>
              <StatItem 
                icon={stat.icon} 
                count={stat.count} 
                label={stat.label}
                plusSign={stat.plusSign}
                suffix={stat.suffix}
                numberAndLabelColorClass={numberAndLabelColorClass} // Pass black/dark text color
                iconColorClass={iconColorClass} // Pass icon color (e.g., primary or also black)
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}