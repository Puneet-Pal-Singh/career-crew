// src/app/api/jobs/recent/route.ts
import { NextResponse } from 'next/server';
import type { JobCardData } from '@/types';

export async function GET() {
  const mockJobs: JobCardData[] = [
    {
      id: '1',
      title: 'Senior Frontend Engineer',
      companyName: 'Innovatech Solutions',
      companyLogoUrl: '/placeholder-logo.svg', // We'll create this
      location: 'San Francisco, CA',
      isRemote: false,
      salary: '$120k - $150k',
      postedDate: 'Posted 2 days ago',
      type: 'Full-time',
    },
    {
      id: '2',
      title: 'Product Marketing Manager',
      companyName: 'MarketBoost Inc.',
      companyLogoUrl: '/placeholder-logo.svg',
      location: 'New York, NY',
      isRemote: true,
      salary: '$100k - $130k',
      postedDate: 'Posted 5 days ago',
      type: 'Full-time',
    },
    {
      id: '3',
      title: 'UX/UI Designer',
      companyName: 'Creative Visions LLC',
      companyLogoUrl: '/placeholder-logo.svg',
      location: 'Remote',
      isRemote: true,
      postedDate: 'Posted 1 week ago',
      type: 'Contract',
    },
  ];

  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return NextResponse.json(mockJobs);
  } catch (error) {
    console.error('Error fetching recent jobs:', error);
    return NextResponse.json({ message: 'Error fetching recent jobs' }, { status: 500 });
  }
}