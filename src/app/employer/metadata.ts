// src/app/employer/metadata.ts
import { createPageMetadata } from '@/lib/seo';

export const metadata = createPageMetadata({
  title: 'For Employers',
  description: 'Post jobs and find top talent. Connect with qualified candidates through CareerCrew Consulting.',
  keywords: 'hire talent, post jobs, recruitment, employer services, find candidates',
  openGraph: {
    type: 'website',
  },
});