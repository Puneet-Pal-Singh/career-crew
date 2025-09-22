// src/app/dashboard/metadata.ts
import { createPageMetadata } from '@/lib/seo';

export const metadata = createPageMetadata({
  title: 'Dashboard',
  description: 'Manage your career opportunities and applications on CareerCrew Consulting.',
  robots: {
    index: false, // Don't index dashboard pages
    follow: false,
  },
});