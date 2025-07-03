// src/components/auth/AuthPageLayout.tsx
import React from 'react';

export default function AuthPageLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-[calc(100vh-160px)] items-center justify-center p-4">
      <div className="w-full max-w-md">
        {children}
      </div>
    </div>
  );
}