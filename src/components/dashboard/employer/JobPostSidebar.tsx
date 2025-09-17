// src/components/dashboard/employer/JobPostSidebar.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Info } from "lucide-react";
import StatsGrid from "@/components/shared/StatsGrid"; // Import the new component
import { PLATFORM_STATS } from "@/lib/constants";

export default function JobPostSidebar() {
  return (
    <aside className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <Info className="mr-2 h-5 w-5 text-primary" />
            Pro Tips
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li className="flex items-start">
              <CheckCircle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0 text-green-500" />
              <span>Include a salary range to get 30% more applications.</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0 text-green-500" />
              <span>Be specific about required skills and experience.</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0 text-green-500" />
              <span>Highlight unique benefits and company culture.</span>
            </li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Why Choose CareerCrew?</CardTitle>
        </CardHeader>
        <CardContent>
          {/* REPLACED the hardcoded grid with our new reusable component */}
          <StatsGrid stats={PLATFORM_STATS} />
        </CardContent>
      </Card>
    </aside>
  );
}