// src/app/jobs/[jobSlug]/page.tsx
import { getJobDetailsById } from '@/app/actions/query/getJobDetailsByIdAction';
import JobDetailView from '@/components/jobs/JobDetailView';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

interface JobDetailsPageProps {
  params: {
    jobSlug: string; // e.g., "12345-senior-software-engineer"
  };
}

// This function generates metadata for SEO
export async function generateMetadata({ params }: JobDetailsPageProps): Promise<Metadata> {
  // FIX: Extract the ID from the slug. The slug is guaranteed to exist.
  const jobId = params.jobSlug.split('-')[0];
  
  // A defensive check in case the slug is malformed (e.g., just "my-job-title")
  if (!jobId || isNaN(parseInt(jobId, 10))) {
    return { title: 'Invalid Job Post - CareerCrew' };
  }

  const job = await getJobDetailsById(jobId);
  if (!job) {
    return { title: 'Job Not Found - CareerCrew' };
  }
  return { 
    title: `${job.title} at ${job.companyName} - CareerCrew`,
    description: job.description.substring(0, 160),
  };
}

export default async function JobDetailsPage({ params }: JobDetailsPageProps) {
  // FIX: Extract the ID from the slug to fetch the data.
  const jobId = params.jobSlug.split('-')[0];

  // If the extracted part is not a valid number or doesn't exist, it's a 404.
  if (!jobId || isNaN(parseInt(jobId, 10))) {
    notFound();
  }

  const job = await getJobDetailsById(jobId);

  if (!job) {
    notFound();
  }

  return <JobDetailView job={job} />;
}