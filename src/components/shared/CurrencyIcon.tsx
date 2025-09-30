// src/components/shared/CurrencyIcon.tsx
"use client";

import { DollarSign, Euro, PoundSterling, IndianRupee, JapaneseYen, TrendingUp } from 'lucide-react';

interface CurrencyIconProps {
  currencyCode?: string | null;
  className?: string;
  size?: number;
}

/**
 * A dynamic component that renders a specific Lucide icon based on a currency code.
 */
export default function CurrencyIcon({ currencyCode, className, size = 14 }: CurrencyIconProps) {
  const iconProps = {
    size: size,
    className: className || "text-green-600 dark:text-green-400 flex-shrink-0",
  };

  switch (currencyCode?.toUpperCase()) {
    case 'USD':
      return <DollarSign {...iconProps} />;
    case 'INR':
      return <IndianRupee {...iconProps} />;
    case 'EUR':
      return <Euro {...iconProps} />;
    case 'GBP':
      return <PoundSterling {...iconProps} />;
    case 'JPY':
      return <JapaneseYen {...iconProps} />;
    default:
      // Fallback to a generic icon if the currency is unknown or not set
      return <TrendingUp {...iconProps} />;
  }
}