// src/components/auth/AuthPageLayout.tsx
import React from 'react';

export default function AuthPageLayout({ children }: { children: React.ReactNode }) {
  return (
    // FIX:
    // - `min-h-screen` ensures the container takes up the full viewport height.
    // - `flex` and `items-center` are the keys to perfect vertical centering.
    // - `bg-muted/40` adds a subtle background color for a more professional feel.
    <div className="flex min-h-screen w-full items-center justify-center bg-muted/40 p-4">
      <div className="w-full max-w-md">
      {/* <div className="w-full max-w-sm"> */}
        {children}
      </div>
    </div>
  );
}