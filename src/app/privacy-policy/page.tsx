import { createPageMetadata } from '@/lib/seo';

export const metadata = createPageMetadata({
  title: 'Privacy Policy',
  description: 'Learn how CareerCrew Consulting protects your privacy and handles your personal information when using our career services platform.',
  keywords: 'privacy policy, data protection, personal information, career services privacy',
});

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto max-w-4xl py-12 px-4">
      <article className="prose dark:prose-invert">
        <h1>Privacy Policy</h1>
        <p className="text-muted-foreground">Last updated: August 4, 2025</p>

        <h2>1. Information We Collect</h2>
        <p>
          We collect information you provide directly to us when you create an account, post a job, or apply for a position. 
          This may include your name, email address, resume, and other professional information.
        </p>

        <h2>2. How We Use Your Information</h2>
        <p>
          We use the information we collect to operate, maintain, and provide you with the features and functionality of the Service, 
          as well as to communicate directly with you, such as to send you email messages.
        </p>

        <h2>3. Sharing of Your Information</h2>
        <p>
          We do not sell or rent your personal information to third parties. We may share your information with potential employers 
          when you apply for a job, or with job seekers when you post a listing, as necessary to provide the Service.
        </p>
        
        <h2>4. Data Security</h2>
        <p>
          We use commercially reasonable safeguards to help keep the information collected through the Service secure. 
          However, no security system is impenetrable, and we cannot guarantee the security of our systems 100%.
        </p>

        <h2>5. Contact Us</h2>
        <p>
          If you have any questions about this Privacy Policy, please contact us at contact@careercrew.com.
        </p>
      </article>
    </div>
  );
}