// src/lib/seo.ts
import { Metadata } from 'next';

type TitleObject = {
  absolute?: string;
  template?: string;
};

export const BASE_URL = 'https://careercrewconsulting.com';

export const defaultMetadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'CareerCrew Consulting - Find Your Dream Team or Next Big Opportunity',
    template: '%s | CareerCrew Consulting'
  },
  description: "Connecting top talent with innovative companies. Whether you're hiring or looking for your next role, we're here to help you succeed. 500+ companies trust us with 10,000+ successful placements.",
  keywords: 'career consulting, job search, hiring, recruitment, talent acquisition, career opportunities, job placement',
  authors: [{ name: 'CareerCrew Consulting' }],
  creator: 'CareerCrew Consulting',
  publisher: 'CareerCrew Consulting',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'CareerCrew Consulting',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'CareerCrew Consulting - Career Services Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    creator: '@careercrew',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export function createPageMetadata(overrides: Partial<Metadata> = {}): Metadata {
  // Handle title correctly for both string and object cases
  const baseTitleStr = overrides.title && typeof overrides.title === 'string'
    ? overrides.title
    : (overrides.title && typeof overrides.title === 'object' && 'absolute' in overrides.title)
      ? (overrides.title as TitleObject).absolute
      : defaultMetadata.title?.toString() || 'CareerCrew Consulting';

  const fallbackTitle = defaultMetadata.title?.toString() || 'CareerCrew Consulting';

  return {
    ...defaultMetadata,
    ...overrides,
    title: overrides.title || defaultMetadata.title,
    openGraph: {
      ...defaultMetadata.openGraph,
      ...overrides.openGraph,
      title: overrides.openGraph?.title || baseTitleStr || fallbackTitle,
    },
    twitter: {
      ...defaultMetadata.twitter,
      ...overrides.twitter,
      title: overrides.twitter?.title || baseTitleStr || fallbackTitle,
    },
  };
}

export function generateJobMetadata(job: {
  title: string;
  company: string;
  location: string;
  description: string;
}): Metadata {
  const jobTitle = `${job.title} at ${job.company}`;
  const jobDescription = `${job.description} - ${job.location}`;

  return createPageMetadata({
    title: jobTitle,
    description: jobDescription,
    openGraph: {
      title: jobTitle,
      description: jobDescription,
      type: 'website',
    },
  });
}

export function generateStructuredData(data: Record<string, unknown>) {
  return {
    '@context': 'https://schema.org',
    ...data,
  };
}