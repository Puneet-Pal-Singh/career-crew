// src/app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { GeistSans } from 'geist/font/sans'; // Correct import for Geist Sans
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ThemeProvider from '@/components/theme/ThemeProvider';

export const metadata: Metadata = {
  title: 'CareerCrew Consulting - Find Your Next Opportunity', // Updated title
  description: 'Connecting top talent with innovative companies. Whether you&apos;re hiring or looking for your next role, we%apso;re here to help you succeed.', // Updated description with escaped apostrophe
};

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

// GeistSans from 'geist/font/sans' is directly the font object
// so 'GeistSans.variable' will provide the CSS variable name.
// No need to call it as a function here like `GeistSans()`.

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${GeistSans.variable}`.trim()} suppressHydrationWarning>
      <body className="font-sans bg-background-light dark:bg-background-dark text-content-light dark:text-content-dark min-h-screen flex flex-col antialiased transition-colors duration-300">
        <ThemeProvider 
          attribute="class" 
          defaultTheme="light" // CHANGED: Default to light mode
          enableSystem={false} // CHANGED: Disable system preference if we force light/dark default, or set to true if you want system to override default ONLY if user hasn't picked
          disableTransitionOnChange
        >
          <Header />
          {/* MODIFIED: Removed container, padding classes from main. It's now full-width. */}
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}