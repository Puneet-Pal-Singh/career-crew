// src/app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { GeistSans } from 'geist/font/sans';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { AppProviders } from '@/components/providers/AppProviders'; // Import AppProviders

export const metadata: Metadata = {
  title: 'CareerCrew Consulting - Find Your Next Opportunity',
  description: "Connecting top talent with innovative companies. Whether you're hiring or looking for your next role, we're here to help you succeed.",
};

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

// GeistSans from 'geist/font/sans' is directly the font object
const geistSansVariable = GeistSans.variable; // Get variable name

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${geistSansVariable}`.trim()} suppressHydrationWarning>
      <body className="font-sans min-h-screen flex flex-col antialiased">
        {/* Note: Removed theme-specific classes from body as ThemeProvider/AppProviders handle this via html class */}
        <AppProviders
        // Props for ThemeProvider are now set inside AppProviders by default
        // or can be passed via themeProps if needed for more flexibility
        >
          <Header />
          <main className="flex-grow">{children}</main>
          <Footer />
        </AppProviders>
      </body>
    </html>
  );
}