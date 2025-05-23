// src/app/jobs/[jobId]/page.tsx
import { getJobDetailsById } from '@/app/actions/query/getJobDetailsByIdAction';
import type { JobDetailData } from '@/types';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import JobDetailView from '@/components/jobs/JobDetailView'; // Your Client Component for UI

// Define props for the Page Server Component, acknowledging params is a Promise
interface AsyncPageProps {
  params: Promise<{ jobId: string }>; // params is now a Promise
  // searchParams?: Promise<{ [key: string]: string | string[] | undefined }>; // If using searchParams
}

// generateMetadata: params object here also needs to be awaited
export async function generateMetadata(
  { params: paramsPromise }: AsyncPageProps, // Destructure and rename for clarity
//   _parent: ResolvingMetadata // Prefix if not used
): Promise<Metadata> {
  const params = await paramsPromise; // Await the params promise
  const jobId = params.jobId; 
  const job = await getJobDetailsById(jobId);

  if (!job) {
    return {
      title: 'Job Not Found - CareerCrew',
    };
  }
  return {
    title: `${job.title} at ${job.companyName} - CareerCrew`,
    description: job.description.substring(0, 160),
  };
}

// This is the main Page Server Component
export default async function JobDetailPage({ params: paramsPromise }: AsyncPageProps) { // Destructure and rename
  const params = await paramsPromise; // Await the params promise
  const jobId = params.jobId; 
  
  const job: JobDetailData | null = await getJobDetailsById(jobId);

  if (!job) {
    notFound(); 
  }

  // Pass the resolved job data to the Client Component
  return <JobDetailView job={job} />;
}