// src/app/auth/template.tsx
import { createPageMetadata } from '@/lib/seo';

export const metadata = createPageMetadata({
  title: 'Authentication',
  description: 'Sign in or create an account to access CareerCrew Consulting services.',
  robots: {
    index: false, // Don't index auth pages
    follow: false,
  },
});

export default function AuthTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}