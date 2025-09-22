import { createPageMetadata } from '@/lib/seo';

export const metadata = createPageMetadata({
  title: 'Terms of Service',
  description: 'Read the terms and conditions for using CareerCrew Consulting services. Understand your rights and responsibilities when using our platform.',
  keywords: 'terms of service, terms and conditions, user agreement, legal terms, career services terms',
});

export default function TermsPage() {
  return (
    <div className="container mx-auto max-w-4xl py-12 px-4">
      <article className="prose dark:prose-invert">
        <h1>Terms of Service</h1>
        <p className="text-muted-foreground">Last updated: August 4, 2025</p>

        <h2>1. Introduction</h2>
        <p>
          Welcome to CareerCrew (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;). By accessing or using our website and services (the &quot;Service&quot;), 
          you agree to be bound by these Terms of Service and our Privacy Policy.
        </p>

        <h2>2. Use of Our Service</h2>
        <p>
          You agree to use our Service only for lawful purposes. You are responsible for any content you post, 
          including job listings and applications, and for ensuring it is accurate and does not violate any laws or third-party rights.
        </p>

        <h2>3. Accounts</h2>
        <p>
          When you create an account with us, you must provide information that is accurate, complete, and current at all times. 
          Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.
        </p>

        <h2>4. Disclaimers</h2>
        <p>
          The Service is provided on an &quot;AS IS&quot; and &quot;AS AVAILABLE&quot; basis. We do not warrant that the service will be uninterrupted, 
          secure, or error-free.
        </p>
        
        <h2>5. Limitation of Liability</h2>
        <p>
          In no event shall CareerCrew, nor its directors, employees, partners, agents, suppliers, or affiliates, 
          be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, 
          loss of profits, data, use, goodwill, or other intangible losses.
        </p>

        <h2>6. Changes</h2>
        <p>
          We reserve the right, at our sole discretion, to modify or replace these Terms at any time. 
          We will provide notice of any changes by posting the new Terms of Service on this page.
        </p>
        
        <h2>7. Contact Us</h2>
        <p>
          If you have any questions about these Terms, please contact us at contact@careercrew.com.
        </p>
      </article>
    </div>
  );
}