"use client";

import Image from 'next/image';
import { useMemo } from 'react';
import { cn } from '@/lib/utils';

interface JobLogoProps {
  src?: string | null;
  alt: string;
  title: string; // Job title used for fallback initials
  width?: number;
  height?: number;
  className?: string;
}

export default function JobLogo({ src, alt, title, width = 40, height = 40, className }: JobLogoProps) {
  // Generate initials from the first two words of the title
  const initials = useMemo(() => {
    if (!title) return '??';
    const words = title.trim().split(/\s+/).filter(w => w.length > 0);
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return title.slice(0, 2).toUpperCase();
  }, [title]);

  // Check if src is valid (and not the deleted default file)
  const isValidSrc = src && src !== '' && src !== '/company-logos/default-company-logo.svg';

  if (isValidSrc) {
    return (
      <Image
        src={src!}
        alt={alt}
        width={width}
        height={height}
        className={cn("rounded object-contain", className)}
      />
    );
  }

  // Fallback: Initials
  // We use a div with flexbox to center the initials
  return (
    <div 
      className={cn(
        "rounded flex items-center justify-center bg-primary/10 text-primary font-bold text-sm select-none", 
        className
      )}
      style={{ width, height }}
      aria-label={`${title} placeholder logo`}
    >
      {initials}
    </div>
  );
}
