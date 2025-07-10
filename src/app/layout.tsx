// src/app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { GeistSans } from 'geist/font/sans';
import './globals.css';
import { AppProviders } from '@/components/providers/AppProviders'; // Import AppProviders
import { Toaster } from "@/components/ui/toaster";
import ClientLayout from '@/components/layout/ClientLayout'; // Import the new wrapper
import { getSupabaseServerClient } from '@/lib/supabase/serverClient'; // We need the server client here

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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const supabase = await getSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <html lang="en" className={`${inter.variable} ${geistSansVariable}`.trim()} suppressHydrationWarning>
      <body className="font-sans min-h-screen flex flex-col antialiased">
        {/* Note: Removed theme-specific classes from body as ThemeProvider/AppProviders handle this via html class */}
         <AppProviders>
          {/* ClientLayout now intelligently wraps the children based on the route */}
          <ClientLayout user={user}>
            {children}
          </ClientLayout>
          <Toaster />
        </AppProviders>
      </body>
    </html>
  );
}