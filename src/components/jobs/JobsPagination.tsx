// src/components/jobs/JobsPagination.tsx
"use client";

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';

interface JobsPaginationProps {
  currentPage: number;
  totalPages: number;
  // basePath?: string; // Not strictly needed if using usePathname
}

export default function JobsPagination({ currentPage, totalPages }: JobsPaginationProps) {
  const router = useRouter();
  const pathname = usePathname(); // Gets current path, e.g., "/jobs"
  const searchParams = useSearchParams(); // Gets current search params

  if (totalPages <= 1) {
    return null; // Don't render pagination if only one page or no pages
  }

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(pageNumber));
    return `${pathname}?${params.toString()}`;
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      router.push(createPageURL(newPage));
    }
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5; // Max page numbers to show (e.g., 1 ... 3 4 5 ... 10)
    const halfPagesToShow = Math.floor(maxPagesToShow / 2);

    // Always show first page
    pageNumbers.push(
      <Button
        key={1}
        variant={currentPage === 1 ? 'default' : 'outline'}
        size="sm"
        onClick={() => handlePageChange(1)}
        disabled={currentPage === 1}
        className="mx-1"
      >
        1
      </Button>
    );

    // Ellipsis after first page if needed
    if (currentPage > halfPagesToShow + 2 && totalPages > maxPagesToShow +1) {
      pageNumbers.push(
        <span key="ellipsis-start" className="flex items-center justify-center px-3 py-1.5 mx-1">
          <MoreHorizontal className="h-4 w-4" />
        </span>
      );
    }

    // Calculate range of pages to show around current page
    let startPage = Math.max(2, currentPage - halfPagesToShow);
    let endPage = Math.min(totalPages - 1, currentPage + halfPagesToShow);

    if (currentPage <= halfPagesToShow +1) {
        endPage = Math.min(totalPages -1, maxPagesToShow-1);
    }
    if (currentPage >= totalPages - halfPagesToShow) {
        startPage = Math.max(2, totalPages - maxPagesToShow +2);
    }


    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <Button
          key={i}
          variant={currentPage === i ? 'default' : 'outline'}
          size="sm"
          onClick={() => handlePageChange(i)}
          className="mx-1"
        >
          {i}
        </Button>
      );
    }

    // Ellipsis before last page if needed
    if (currentPage < totalPages - halfPagesToShow -1 && totalPages > maxPagesToShow +1) {
      pageNumbers.push(
        <span key="ellipsis-end" className="flex items-center justify-center px-3 py-1.5 mx-1">
          <MoreHorizontal className="h-4 w-4" />
        </span>
      );
    }
    
    // Always show last page if totalPages > 1
    if (totalPages > 1) {
        pageNumbers.push(
        <Button
            key={totalPages}
            variant={currentPage === totalPages ? 'default' : 'outline'}
            size="sm"
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage === totalPages}
            className="mx-1"
        >
            {totalPages}
        </Button>
        );
    }


    return pageNumbers;
  };

  return (
    <div className="flex items-center justify-center space-x-2 py-8">
      <Button
        variant="outline"
        size="sm"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        aria-label="Previous page"
      >
        <ChevronLeft className="h-4 w-4 mr-1" />
        Previous
      </Button>

      {renderPageNumbers()}

      <Button
        variant="outline"
        size="sm"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        aria-label="Next page"
      >
        Next
        <ChevronRight className="h-4 w-4 ml-1" />
      </Button>
    </div>
  );
}