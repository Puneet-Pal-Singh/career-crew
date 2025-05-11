// src/app/api/jobs/recent/route.ts
import { NextResponse } from 'next/server';
import type { JobCardData } from '@/types';

export async function GET() {
  const mockJobs: JobCardData[] = [
    {
      id: '1',
      title: 'Senior Frontend Engineer',
      companyName: 'Innovatech Solutions',
      companyLogoUrl: '/company-logos/placeholder-logo-1.svg', // Ensure these exist or use your actual ones
      location: 'San Francisco, CA',
      isRemote: false,
      salary: '$120k - $150k',
      postedDate: 'Posted 2 days ago',
      type: 'Full-time',
      tags: ['React', 'TypeScript', 'Frontend', 'Remote-Friendly'], // Added example tags
    },
    {
      id: '2',
      title: 'Product Marketing Manager',
      companyName: 'MarketBoost Inc.',
      companyLogoUrl: '/company-logos/placeholder-logo-2.svg',
      location: 'New York, NY',
      isRemote: true,
      salary: '$100k - $130k',
      postedDate: 'Posted 5 days ago',
      type: 'Full-time',
      tags: ['Marketing', 'SaaS', 'Growth'], // Added example tags
    },
    {
      id: '3',
      title: 'UX/UI Designer',
      companyName: 'Creative Visions LLC',
      companyLogoUrl: '/company-logos/placeholder-logo-3.svg',
      location: 'Remote',
      isRemote: true,
      // salary: null, // Example of job without salary explicitly listed
      postedDate: 'Posted 1 week ago',
      type: 'Contract',
      tags: ['UX Design', 'UI Design', 'Figma', 'Remote'], // Added example tags
    },
  ];

  try {
    await new Promise(resolve => setTimeout(resolve, 300));
    return NextResponse.json(mockJobs);
  } catch (error) {
    console.error('Error fetching recent jobs:', error);
    return NextResponse.json({ message: 'Error fetching recent jobs' }, { status: 500 });
  }
}