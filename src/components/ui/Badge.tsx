// src/components/ui/Badge.tsx
import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'default' | 'success' | 'warning' | 'danger';
  className?: string;
  size?: 'sm' | 'md';
}

export function Badge({ children, variant = 'default', className = '', size = 'sm' }: BadgeProps) {
  const baseClasses = "inline-flex items-center rounded-full font-medium whitespace-nowrap";
  
  const sizeClasses = {
    sm: "px-2.5 py-0.5 text-xs",
    md: "px-3 py-1 text-sm",
  };

  // Adjusted for your theme colors
  const variantClasses = {
    default: "bg-surface-dark/50 dark:bg-surface-light/10 text-subtle-dark dark:text-subtle-light border border-transparent",
    primary: "bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary border border-transparent",
    secondary: "bg-secondary/10 text-secondary dark:bg-secondary/20 dark:text-secondary border border-transparent",
    success: "bg-green-500/10 text-green-700 dark:bg-green-500/20 dark:text-green-400 border border-transparent",
    warning: "bg-yellow-500/10 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400 border border-transparent",
    danger: "bg-red-500/10 text-red-700 dark:bg-red-500/20 dark:text-red-400 border border-transparent",
  };

  return (
    <span className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}>
      {children}
    </span>
  );
}