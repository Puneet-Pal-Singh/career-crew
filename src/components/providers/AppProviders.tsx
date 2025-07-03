// src/components/providers/AppProviders.tsx
"use client";

import React, { ReactNode } from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ThemeProviderProps } from "next-themes";
import { AuthProvider } from "@/contexts/AuthContext"; // Core Auth
import { UserProfileProvider } from "@/contexts/UserProfileContext"; // NEW: Profile Data

interface AppProvidersProps {
  children: ReactNode;
  themeProps?: Omit<ThemeProviderProps, 'children'>; 
}

export function AppProviders({ children, themeProps }: AppProvidersProps) {
  const defaultThemeProps: Omit<ThemeProviderProps, 'children'> = {
    attribute: "class",
    defaultTheme: "light",
    enableSystem: false,
    disableTransitionOnChange: true,
    ...themeProps,
  };

  return (
    <NextThemesProvider {...defaultThemeProps}>
      <AuthProvider> {/* AuthProvider is outermost of these two */}
        <UserProfileProvider> {/* UserProfileProvider needs access to AuthContext */}
          {children}
        </UserProfileProvider>
      </AuthProvider>
    </NextThemesProvider>
  );
}