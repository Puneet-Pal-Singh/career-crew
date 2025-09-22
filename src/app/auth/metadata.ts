// src/app/auth/metadata.ts
import { createPageMetadata } from '@/lib/seo';

export const metadata = createPageMetadata({
  title: 'Authentication',
  description: 'Sign in or create an account to access CareerCrew Consulting services.',
  robots: { index: false, follow: false },
});