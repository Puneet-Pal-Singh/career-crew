// src/app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { GeistSans } from 'geist/font/sans'; // Updated import path for Geist Sans
import './globals.css'; // Your global styles
import Header from '@/components/layout/Header'; // We'll create this
import Footer from '@/components/layout/Footer'; // We'll create this
import ThemeProvider from '@/components/theme/ThemeProvider'; // We'll create this later for theme toggle

export const metadata: Metadata = {
  title: 'Career Crew Consulting', // Update as needed
  description: 'Connecting talent with opportunity.', // Update as needed
};

// Using GeistSans for headings and Inter for body as per your initial spec
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter', // CSS variable for Inter
});

// const geistSans = GeistSans({
//   subsets: ['latin'],
//   variable: '--font-geist-sans', // CSS variable for Geist Sans
// });

const geistSans = GeistSans;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${geistSans.variable}`.trim()} suppressHydrationWarning>
      <body className="font-sans bg-background-light dark:bg-background-dark text-content-light dark:text-content-dark min-h-screen flex flex-col transition-colors duration-300">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <Header />
          <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children} {/* This is where src/app/page.tsx content goes */}
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}