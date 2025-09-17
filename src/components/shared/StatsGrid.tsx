// src/components/shared/StatsGrid.tsx
import type { StatItem } from "@/lib/constants"; // Import the type

interface StatsGridProps {
  stats: StatItem[];
}

export default function StatsGrid({ stats }: StatsGridProps) {
  return (
    <div className="grid grid-cols-2 gap-y-6 gap-x-4 text-center">
      {stats.map((stat) => (
        <div key={stat.label}>
          <p className="text-2xl font-bold">{stat.value}</p>
          <p className="text-xs text-muted-foreground">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}