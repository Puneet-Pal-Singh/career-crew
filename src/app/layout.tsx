// src/app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { GeistSans } from 'geist/font/sans';
import './globals.css';
import { getSupabaseServerClient } from '@/lib/supabase/serverClient';
import { defaultMetadata } from '@/lib/seo';
import { SpeedInsights } from "@vercel/speed-insights/next";
import MainLayout from '@/components/layout/MainLayout'; // ✅ Import our new component

export const dynamic = 'force-dynamic';
export const metadata: Metadata = defaultMetadata;

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

  // Server-side data fetching remains here.
  let user = null;
  let userRole = null;

  try {
    const supabase = await getSupabaseServerClient();
    const { data: { user: fetchedUser } } = await supabase.auth.getUser();
    user = fetchedUser;
    if (user) {
      userRole = user.app_metadata?.role;
    }
  } catch (error) {
    console.error('Failed to fetch user in root layout:', error);
  }

  return (
    <html lang="en" className={`${inter.variable} ${geistSansVariable}`.trim()} suppressHydrationWarning>
      <body className="font-sans min-h-screen flex flex-col antialiased">
        
        {/* ✅ THE DEFINITIVE FIX:
            We now render the MainLayout client component and pass the
            server-fetched data and children down to it. This correctly
            separates the server and client concerns.
        */}
        <MainLayout user={user} userRole={userRole}>
          {children}
        </MainLayout>

        <SpeedInsights />
      </body>
    </html>
  );
}