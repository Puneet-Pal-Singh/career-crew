import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { GeistSans } from 'geist/font/sans';
import './globals.css';
import { AppProviders } from '@/components/providers/AppProviders';
import { Toaster } from "@/components/ui/toaster";
import ClientLayout from '@/components/layout/ClientLayout';
import { getSupabaseServerClient } from '@/lib/supabase/serverClient';

// --- FIX: Force dynamic rendering for the entire app ---
// This tells Next.js not to attempt static generation, as this layout
// depends on request-time cookies to fetch the user session.
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'CareerCrew Consulting - Find Your Next Opportunity',
  description: "Connecting top talent with innovative companies. Whether you're hiring or looking for your next role, we're here to help you succeed.",
};

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const geistSansVariable = GeistSans.variable;

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  let user = null;
  try {
    const supabase = await getSupabaseServerClient();
    const { data: { user: fetchedUser } } = await supabase.auth.getUser();
    user = fetchedUser;
  } catch (error) {
    console.error('Failed to fetch user in root layout:', error);
    // The app will continue with user = null, showing the public state.
  }

  return (
    <html lang="en" className={`${inter.variable} ${geistSansVariable}`.trim()} suppressHydrationWarning>
      <body className="font-sans min-h-screen flex flex-col antialiased">
         <AppProviders>
          <ClientLayout user={user}>
            {children}
          </ClientLayout>
          <Toaster />
        </AppProviders>
      </body>
    </html>
  );
}