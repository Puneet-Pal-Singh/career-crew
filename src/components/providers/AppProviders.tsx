// src/components/providers/AppProviders.tsx
"use client";

import React, { ReactNode } from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes"; // Assuming this is what your ThemeProvider wraps
import type { ThemeProviderProps } from "next-themes";             // Or import your custom ThemeProvider component
import { AuthProvider } from "@/contexts/AuthContext";          // Import our new AuthProvider

// If your "@/components/theme/ThemeProvider" is just a re-export of NextThemesProvider,
// you can use NextThemesProvider directly. If it has custom logic, import that.
// For this example, I'll assume your ThemeProvider is a simple wrapper like you showed.

interface AppProvidersProps {
  children: ReactNode;
  // Pass through ThemeProvider specific props if your "@/components/theme/ThemeProvider" doesn't handle them
  themeProps?: Omit<ThemeProviderProps, 'children'>; 
}

export function AppProviders({ children, themeProps }: AppProvidersProps) {
  // Default themeProps if not provided, matching your layout.tsx setup
  const defaultThemeProps: Omit<ThemeProviderProps, 'children'> = {
    attribute: "class",
    defaultTheme: "light",
    enableSystem: false,
    disableTransitionOnChange: true, // Added from your layout.tsx
    ...themeProps, // Allow overriding via props
  };

  return (
    <NextThemesProvider {...defaultThemeProps}>
      <AuthProvider>{children}</AuthProvider>
    </NextThemesProvider>
  );
}