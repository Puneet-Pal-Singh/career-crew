// src/components/dashboard/employer/all-applications/ApplicationPagination.tsx
"use client";

import React from 'react';
import { Button } from '@/components/ui/button';

interface ApplicationPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (newPage: number) => void;
  isPending: boolean;
}

export const ApplicationPagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange,
  isPending 
}: ApplicationPaginationProps) => {
  if (totalPages <= 1) {
    return null; // Don't render pagination if there's only one page
  }

  return (
    <div className="flex items-center justify-between p-4 border-t bg-muted/50">
      <div className="text-sm text-muted-foreground">
        Page {currentPage} of {totalPages}
      </div>
      <div className="flex items-center space-x-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => onPageChange(currentPage - 1)} 
          disabled={currentPage <= 1 || isPending}
        >
          Previous
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => onPageChange(currentPage + 1)} 
          disabled={currentPage >= totalPages || isPending}
        >
          Next
        </Button>
      </div>
    </div>
  );
};