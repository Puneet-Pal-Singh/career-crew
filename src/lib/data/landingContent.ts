// src/lib/data/landingContent.ts
import { Briefcase, Search as SearchIconForFeatures, Zap, Target } from 'lucide-react';
import type { LucideIcon as LucideIconType } from 'lucide-react';

// Testimonial type
export interface TestimonialData {
  quote: string;
  name: string;
  role: string;
  avatarUrl: string;
  companyLogoUrl?: string;
}

// HowItWorks step type
export interface HowItWorksStepData {
  iconName: 'FileText' | 'Search' | 'UserCheck';
  title: string;
  description: string;
}

// Feature type
export interface FeatureData {
  icon: LucideIconType; // Keep icon component for direct use if FeatureItem is server-rendered within FeaturesSection
  title: string;
  description: string;
}

// Featured Company type
export interface FeaturedCompanyData {
  src: string;
  alt: string;
}

// --- Data Definitions ---

export async function getFeaturesData(): Promise<FeatureData[]> {
  // This could also fetch from a CMS or API in the future
  return [
    { icon: SearchIconForFeatures, title: 'Advanced Job Search', description: 'Easily find relevant job openings with our powerful search filters and intuitive interface.' },
    { icon: Briefcase, title: 'Effortless Applications', description: 'Apply to jobs quickly with a streamlined process, getting your profile in front of employers faster.' },
    { icon: Target, title: 'Targeted Connections', description: 'Directly connect with companies looking for talent like yours. Build your network and find your fit.' },
    { icon: Zap, title: 'Career Growth Insights', description: 'Access resources and insights to help you navigate your career path and achieve your professional goals.' },
  ];
}

export async function getHowItWorksStepsData(): Promise<HowItWorksStepData[]> {
  return [
    { iconName: 'FileText', title: 'Create Profile / Post Job', description: 'Sign up in minutes. Job seekers build a compelling profile; employers post detailed job openings.' },
    { iconName: 'Search', title: 'Discover & Connect', description: 'Seekers browse relevant jobs and apply. Employers review qualified candidates.' },
    { iconName: 'UserCheck', title: 'Get Hired / Make the Hire', description: 'Secure your next role or welcome a new member to your team. Success awaits!' },
  ];
}

export async function getFeaturedCompaniesData(): Promise<FeaturedCompanyData[]> {
  // Ensure these paths are correct in your /public folder
  return [
    { src: '/company-logos/placeholder-logo-1.svg', alt: 'Nova Dynamics' }, // Use actual or better placeholders
    { src: '/company-logos/placeholder-logo-2.svg', alt: 'Zenith Solutions' },
    { src: '/company-logos/placeholder-logo-3.svg', alt: 'QuantumLeap AI' },
    { src: '/company-logos/placeholder-logo-4.svg', alt: 'Cybernetics Corp' },
    { src: '/company-logos/placeholder-logo-5.svg', alt: 'EcoInnovate Hub' },
  ];
}

export async function getTestimonialsData(): Promise<TestimonialData[]> {
  // Use actual or better placeholders for avatars and company logos
  return [
    { quote: "CareerCrew helped me find the perfect frontend role incredibly fast. The platform is intuitive and the opportunities are top-notch!", name: 'Sarah L.', role: 'Senior Frontend Developer', avatarUrl: '/avatars/avatar-1.jpg', companyLogoUrl: '/company-logos/placeholder-logo-1.svg' },
    { quote: "As a recruiter, finding quality candidates used to be a hassle. CareerCrew streamlined our hiring process significantly.", name: 'John B.', role: 'HR Manager at Zenith Solutions', avatarUrl: '/avatars/avatar-2.jpg', companyLogoUrl: '/company-logos/placeholder-logo-2.svg' },
    { quote: "The ease of application and the direct connection with employers made all the difference. Highly recommend!", name: 'Alice W.', role: 'UX Designer at QuantumLeap AI', avatarUrl: '/avatars/avatar-3.jpg', companyLogoUrl: '/company-logos/placeholder-logo-3.svg' },
  ];
}