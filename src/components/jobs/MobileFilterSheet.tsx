// src/components/jobs/MobileFilterSheet.tsx
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { SlidersHorizontal } from 'lucide-react';
import JobFilterSidebar from './JobFilterSidebar';

// 1. DEFINE props for this component
interface MobileFilterSheetProps {
  locations: string[];
}

export default function MobileFilterSheet({ locations }: MobileFilterSheetProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="w-full flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4" />
          <span>Filters</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0">
        <SheetHeader className="p-4 border-b">
          <SheetTitle>Filter Jobs</SheetTitle>
        </SheetHeader>
        {/* Pass a function to the onClose prop to close the sheet */}
        <JobFilterSidebar onClose={() => setIsOpen(false)} locations={locations} />
      </SheetContent>
    </Sheet>
  );
}