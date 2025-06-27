// src/components/dashboard/StatCard.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";
// import type { ReactNode } from "react"; // Import ReactNode
import { cn } from "@/lib/utils"; // Import cn for conditional class names
import AnimatedCounter from '@/components/shared/AnimatedCounter'; // <-- Import the new component

interface StatCardProps {
  title: string;
  // Change the type of 'value' to ReactNode to allow passing JSX elements like spinners
  // value: ReactNode; 
  value: number; // Value is now strictly a number for the counter
  icon: LucideIcon;
  description?: string;
  className?: string;
}

export default function StatCard({ title, value, icon: Icon, description, className }: StatCardProps) {
  return (
    <Card className={cn("hover:shadow-lg transition-shadow duration-200", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {/* Use the AnimatedCounter for the value */}
          <AnimatedCounter value={value} />
        </div> 
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}