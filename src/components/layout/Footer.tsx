// src/components/layout/Footer.tsx
"use client";

import Link from 'next/link';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Linkedin, Twitter, Mail, ArrowRight } from 'lucide-react';
// import { Linkedin, Twitter, Mail, ArrowRight, MapPin, Phone } from 'lucide-react';

const footerLinks = {
  jobSeekers: [
    { name: 'Browse Jobs', href: '/jobs' },
    { name: 'Dashboard', href: '/dashboard' },
  ],
  employers: [
    { name: 'Post a Job', href: '/dashboard/post-job' },
    { name: 'Dashboard', href: '/dashboard' },
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
  // { icon: Github, href: '#', label: 'GitHub' }
];

export default function Footer() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleNewsletterSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // console.log('Newsletter signup for:', email);
    // TODO: send `email` to a server action or API route (e.g., /api/newsletter)
    // setSubmitted(true) should be called after a successful response.
    setSubmitted(true);
  };

  return (
    // ✅ THE FIX: Added a top border and a solid background for consistency.
    <footer className="bg-muted text-foreground border-t border-border">
      <div className="relative z-10 container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <Link href="/" className="text-3xl font-bold text-foreground">
                CareerCrew
              </Link>
              <p className="mt-4 text-muted-foreground text-sm leading-relaxed max-w-xs">
                Connecting talented professionals with innovative companies.
              </p>
              <div className="flex space-x-3 mt-6">
                {socialLinks.map(({ icon: Icon, href, label }) => (
                  <Link key={label} href={href} aria-label={label}
                    className="w-9 h-9 rounded-full bg-background/50 backdrop-blur-sm flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-300">
                    <Icon size={16} />
                  </Link>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-foreground mb-4 text-sm uppercase tracking-wider">For Job Seekers</h4>
              <ul className="space-y-3">
                {footerLinks.jobSeekers.map(link => (
                  <li key={link.name}><Link href={link.href} className="text-muted-foreground hover:text-primary text-sm">{link.name}</Link></li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-foreground mb-4 text-sm uppercase tracking-wider">For Employers</h4>
              <ul className="space-y-3">
                {footerLinks.employers.map(link => (
                  <li key={link.name}><Link href={link.href} className="text-muted-foreground hover:text-primary text-sm">{link.name}</Link></li>
                ))}
              </ul>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="bg-background/50 backdrop-blur-md rounded-2xl p-8 border shadow-lg">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Mail className="text-primary" size={24} />
                </div>
                <h4 className="font-bold text-foreground text-xl">Stay Updated</h4>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                Get exclusive job opportunities and career insights.
              </p>
              {submitted ? (
                <div className="text-center p-4 rounded-lg bg-green-500/10 border border-green-500/20" role="status" aria-live="polite">
                  <p className="font-medium text-green-700 dark:text-green-400">Thank you for subscribing!</p>
                </div>
              ) : (
                <form onSubmit={handleNewsletterSubmit} className="space-y-4">
                <label htmlFor="newsletter-email" className="sr-only">Email address</label>  
                  <Input 
                   id="newsletter-email"
                   type="email" 
                   autoComplete="email"
                   placeholder="Enter your email address"
                   className="bg-background/50 h-11"
                   value={email}
                   aria-describedby="newsletter-help"
                   onChange={(e) => setEmail(e.target.value)}
                   required 
                  />
                  <p id="newsletter-help" className="text-xs text-muted-foreground">
                    We’ll send occasional updates. Unsubscribe anytime.
                  </p>
                  <Button type="submit" className="w-full h-11 font-semibold group">
                    Subscribe <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-border">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-6 text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} Career Crew. All rights reserved.</p>
            <div className="flex flex-wrap items-center gap-6">
              {/* <span className="flex items-center gap-2"><MapPin size={16} />Delhi, India</span>
              <span className="flex items-center gap-2"><Phone size={16} />+91 (555) 123-4567</span> */}
            </div>
            <div className="flex space-x-6">
              {footerLinks.legal.map((link) => (
                <Link key={link.name} href={link.href} className="hover:text-primary">
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}