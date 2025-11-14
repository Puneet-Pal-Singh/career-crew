// src/components/dashboard/seeker/my-applications/NoApplicationsFound.tsx
import { Search } from "lucide-react";

export function NoApplicationsFound() {
  return (
    <div className="text-center py-16">
      <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
        <Search className="w-8 h-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-1">No Applications Found</h3>
      <p className="text-sm text-muted-foreground">Try adjusting your search or filter criteria.</p>
    </div>
  );
}