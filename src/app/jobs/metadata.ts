// src/app/jobs/metadata.ts
import { createPageMetadata } from '@/lib/seo';

export const metadata = createPageMetadata({
  title: 'Jobs',
  description: 'Find your next career opportunity. Browse thousands of job listings from top companies on CareerCrew Consulting.',
  keywords: 'jobs, career opportunities, job search, employment, hiring, job listings',
  openGraph: {
    type: 'website',
  },
});