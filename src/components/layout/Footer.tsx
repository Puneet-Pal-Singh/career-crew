// src/components/layout/Footer.tsx
"use client";

import Link from 'next/link';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Linkedin, Twitter, Mail, ArrowRight, Sparkles } from 'lucide-react';
import FeedbackModal from '@/components/shared/FeedbackModal';
import ContactModal from '@/components/shared/ContactModal';

const footerLinks = {
  jobSeekers: [
    { name: 'Browse Jobs', href: '/jobs' },
    { name: 'Dashboard', href: '/dashboard' },
  ],
  employers: [
    { name: 'Post a Job', href: '/dashboard/post-job' },
    { name: 'Dashboard', href: '/dashboard' },
  ],
  company: [
    // { name: 'Contact Us', href: '/contact' },
  ],
   legal: [
    { name: 'Privacy Policy', href: '/privacy-policy' },
    { name: 'Terms of Service', href: '/terms' },
  ]
};

const socialLinks = [
  { icon: Linkedin,
    href: 'https://www.linkedin.com/company/career-crew-consultants/',
    label: 'LinkedIn'
  },
  { icon: Twitter,
    href: 'https://x.com/CareerCrewJobs',
    label: 'Twitter'
  },
];

export default function Footer() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const [isFeedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [isContactModalOpen, setContactModalOpen] = useState(false);

  const handleNewsletterSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <>
      <footer className="relative bg-gradient-to-b from-muted/50 via-muted to-muted/80 text-foreground border-t border-border/50 overflow-hidden">
        {/* Subtle decorative gradient orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -left-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-secondary/5 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 container mx-auto px-4 py-16">
          
          {/* Top section with gradient accent line */}
          <div className="flex items-center justify-center mb-12">
            <div className="h-px w-16 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
            <Sparkles className="mx-4 text-primary/60" size={16} />
            <div className="h-px w-16 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
          </div>

          {/* Main grid */}
          <div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-12 gap-10">
              
            {/* --- Brand section --- */}    
            <div className="md:col-span-6 lg:col-span-4">
              <Link href="/" className="inline-flex items-center gap-2 group">
                <span className="text-3xl font-bold bg-gradient-to-r from-primary via-primary/90 to-secondary bg-clip-text text-transparent transition-all duration-300 group-hover:from-secondary group-hover:via-primary group-hover:to-primary">
                  CareerCrew
                </span>
              </Link>
              <p className="mt-4 text-muted-foreground text-sm leading-relaxed max-w-xs">
                Connecting talented professionals with innovative companies worldwide.
              </p>
              <div className="flex space-x-3 mt-6">
                {socialLinks.map(({ icon: Icon, href, label }) => (
                  <Link key={label} href={href} aria-label={label}
                    className="group relative w-10 h-10 rounded-xl bg-background/60 backdrop-blur-sm border border-border/50 flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/30 hover:shadow-[0_0_20px_rgba(42,111,255,0.15)] transition-all duration-300 hover:-translate-y-0.5">
                    <Icon size={18} className="transition-transform duration-300 group-hover:scale-110" />
                  </Link>
                ))}
              </div>
            </div>
              
            {/* --- Link Columns --- */}  
            <div className="md:col-span-2 lg:col-span-2">
              <h4 className="font-semibold text-foreground mb-5 text-xs uppercase tracking-widest">For Job Seekers</h4>
              <ul className="space-y-3">
                {footerLinks.jobSeekers.map(link => (
                  <li key={link.name}>
                    <Link href={link.href} className="group relative text-muted-foreground hover:text-primary text-sm inline-block">
                      {link.name}
                      <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-primary transition-all duration-300 group-hover:w-full" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="md:col-span-2 lg:col-span-2">
              <h4 className="font-semibold text-foreground mb-5 text-xs uppercase tracking-widest">For Employers</h4>
              <ul className="space-y-3">
                {footerLinks.employers.map(link => (
                  <li key={link.name}>
                    <Link href={link.href} className="group relative text-muted-foreground hover:text-primary text-sm inline-block">
                      {link.name}
                      <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-primary transition-all duration-300 group-hover:w-full" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="md:col-span-2 lg:col-span-2">
              <h4 className="font-semibold text-foreground mb-5 text-xs uppercase tracking-widest">Company</h4>
              <ul className="space-y-3">
                <li>
                  <button 
                    onClick={() => setFeedbackModalOpen(true)} 
                    className="group relative text-muted-foreground hover:text-primary text-sm text-left w-full inline-block"
                  >
                    Feature Requests
                    <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-primary transition-all duration-300 group-hover:w-full" />
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => setContactModalOpen(true)} 
                    className="group relative text-muted-foreground hover:text-primary text-sm text-left w-full inline-block"
                  >
                    Contact Us
                    <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-primary transition-all duration-300 group-hover:w-full" />
                  </button>
                </li>
              </ul>
            </div>

            {/* Newsletter Card */}
            <div className="md:col-span-6 lg:col-span-4 lg:col-start-9">
              <div className="relative group h-full">
                {/* Gradient border effect */}
                <div className="absolute -inset-px bg-gradient-to-br from-primary/20 via-transparent to-secondary/20 rounded-2xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative bg-background/60 backdrop-blur-md rounded-2xl p-8 border border-border/60 shadow-lg h-full">
                  <div className="flex items-center gap-4 mb-5">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/15 to-secondary/10 flex items-center justify-center border border-primary/10">
                      <Mail className="text-primary" size={22} />
                    </div>
                    <div>
                      <h4 className="font-bold text-foreground text-lg">Stay Updated</h4>
                      <p className="text-muted-foreground text-xs">Never miss an opportunity</p>
                    </div>
                  </div>
                  {submitted ? (
                    <div className="text-center p-5 rounded-xl bg-gradient-to-br from-green-500/10 to-emerald-500/5 border border-green-500/20" role="status" aria-live="polite">
                      <p className="font-semibold text-green-600 dark:text-green-400 text-sm">🎉 You&apos;re subscribed!</p>
                      <p className="text-green-600/70 dark:text-green-400/70 text-xs mt-1">Check your inbox for a welcome email.</p>
                    </div>
                  ) : (
                    <form onSubmit={handleNewsletterSubmit} className="space-y-4">
                      <label htmlFor="newsletter-email" className="sr-only">Email address</label>  
                      <Input 
                        id="newsletter-email"
                        type="email" 
                        autoComplete="email"
                        placeholder="you@example.com"
                        className="bg-background/50 h-11 border-border/50 focus-visible:ring-primary/30"
                        value={email}
                        aria-describedby="newsletter-help"
                        onChange={(e) => setEmail(e.target.value)}
                        required 
                      />
                      <p id="newsletter-help" className="text-xs text-muted-foreground/70">
                        We&apos;ll send occasional updates. Unsubscribe anytime.
                      </p>
                      <Button type="submit" className="w-full h-11 font-semibold bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-md hover:shadow-lg transition-all duration-300 group/btn">
                        Subscribe 
                        <ArrowRight size={18} className="ml-2 group-hover/btn:translate-x-1 transition-transform" />
                      </Button>
                    </form>
                  )}
                </div>
              </div>
            </div> 

          </div>

          {/* Footer Bottom Bar */}
          <div className="mt-16 pt-8 border-t border-border/50">
            <div className="flex flex-col lg:flex-row justify-between items-center gap-4 text-sm text-muted-foreground/80">
              <p className="flex items-center gap-1.5">
                <span className="inline-block w-2 h-2 rounded-full bg-primary/60" />
                &copy; {new Date().getFullYear()} Career Crew. All rights reserved.
              </p>
              <div className="flex space-x-6">
                {footerLinks.legal.map((link) => (
                  <Link key={link.name} href={link.href} className="group relative hover:text-primary transition-colors">
                    {link.name}
                    <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-primary/50 transition-all duration-300 group-hover:w-full" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </footer>

      <FeedbackModal 
        isOpen={isFeedbackModalOpen} 
        onOpenChange={setFeedbackModalOpen} 
      />

      <ContactModal isOpen={isContactModalOpen} onOpenChange={setContactModalOpen} />
    </>
  );
}
