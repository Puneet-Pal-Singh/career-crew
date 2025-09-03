// src/lib/data/landingContent.ts

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
  iconName: 'SearchIconForFeatures' | 'Briefcase' | 'Target' | 'Zap' | string; // Allow specific names or a generic string for flexibility
  title: string;
  description: string;
  // Optional: Add a field for a larger, custom illustration URL if you plan to use those
  illustrationUrl?: string; 
}

// Featured Company type
export interface FeaturedCompanyData {
  src: string;
  alt: string;
}

export interface BlogPreviewData {
  id: string;
  slug: string; // For linking to the full blog post, e.g., /blog/my-post-slug
  title: string;
  imageUrl: string; // Path to a compelling image for the post
  category: string;
  author: string;
  date: string; // e.g., "October 28, 2023"
  snippet: string; // A short excerpt
  readTime?: string; // e.g., "5 min read" (optional)
}

// --- Data Definitions ---

export async function getFeaturesData(): Promise<FeatureData[]> {
  return [
    { iconName: 'SearchIconForFeatures', title: 'Advanced Job Search', description: 'Easily find relevant job openings with our powerful search filters and intuitive interface.' },
    { iconName: 'Briefcase', title: 'Effortless Applications', description: 'Apply to jobs quickly with a streamlined process, getting your profile in front of employers faster.' },
    { iconName: 'Target', title: 'Targeted Connections', description: 'Directly connect with companies looking for talent like yours. Build your network and find your fit.' },
    { iconName: 'Zap', title: 'Career Growth Insights', description: 'Access resources and insights to help you navigate your career path and achieve your professional goals.' },
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
    { quote: "CareerCrew helped me find the perfect frontend role incredibly fast. The platform is intuitive and the opportunities are top-notch!", name: 'Sarah L.', role: 'Senior Frontend Developer', avatarUrl: '/avatars/girl/2.jpeg', companyLogoUrl: '/company-logos/placeholder-logo-1.svg' },
    { quote: "As a recruiter, finding quality candidates used to be a hassle. CareerCrew streamlined our hiring process significantly.", name: 'John B.', role: 'HR Manager at Zenith Solutions', avatarUrl: '/avatars/boy/1.jpeg', companyLogoUrl: '/company-logos/placeholder-logo-2.svg' },
    { quote: "The ease of application and the direct connection with employers made all the difference. Highly recommend!", name: 'Alice W.', role: 'UX Designer at QuantumLeap AI', avatarUrl: '/avatars/girl/3.jpeg', companyLogoUrl: '/company-logos/placeholder-logo-3.svg' },
  ];
}

export async function getBlogPreviewData(): Promise<BlogPreviewData[]> {
  // In a real app, this would fetch from a CMS or your blog API
  // For now, mock data:
  return [
    {
      id: '1',
      slug: 'mastering-the-interview-top-10-tips',
      title: 'Mastering the Interview: Top 10 Tips for Landing Your Dream Job',
      imageUrl: '/blog-images/interview-tips.jpg', // Ensure you have placeholder images
      category: 'Job Seeking',
      author: 'Jane Doe, Career Coach',
      date: 'October 26, 2023',
      snippet: 'Nailing an interview requires more than just good answers. Discover key strategies to impress recruiters and secure offers...',
      readTime: '6 min read',
    },
    {
      id: '2',
      slug: 'remote-work-productivity-hacks',
      title: 'Remote Work Productivity Hacks: Stay Focused and Efficient',
      imageUrl: '/blog-images/remote-work.jpg',
      category: 'Productivity',
      author: 'John Smith, Remote Work Advocate',
      date: 'October 22, 2023',
      snippet: 'Working from home has its perks, but staying productive can be a challenge. Learn effective techniques to maximize your output...',
      readTime: '4 min read',
    },
    {
      id: '3',
      slug: 'building-a-standout-resume-for-tech-roles',
      title: 'Building a Standout Resume for Tech Roles in 2023',
      imageUrl: '/blog-images/tech-resume.jpg',
      category: 'Resume Building',
      author: 'Alex Chen, Tech Recruiter',
      date: 'October 18, 2023',
      snippet: 'Your resume is your first impression. Learn how to tailor your tech resume to catch the eye of hiring managers and pass ATS scans...',
      readTime: '7 min read',
    },
    // Add a fourth one if you want a 2x2 grid possibility
    // {
    //   id: '4',
    //   slug: 'networking-in-the-digital-age',
    //   title: 'Networking in the Digital Age: Strategies for Career Growth',
    //   imageUrl: '/blog-images/networking.jpg',
    //   category: 'Career Development',
    //   author: 'Priya Sharma, LinkedIn Expert',
    //   date: 'October 15, 2023',
    //   snippet: 'Effective networking is key to unlocking opportunities. Explore modern strategies to build meaningful professional connections online...',
    //   readTime: '5 min read',
    // },
  ];
}