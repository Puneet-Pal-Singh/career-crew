import { getJobDetailsById } from '@/app/actions/query/getJobDetailsByIdAction';
import JobDetailView from '@/components/jobs/JobDetailView';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

interface JobDetailsPageProps {
  params: Promise<{
    jobSlug: string;
  }>;
}

// Helper function to safely parse the job ID from the slug
function parseJobIdFromSlug(slug: string): number | null {
  const jobIdStr = slug.split('-')[0];
  if (!jobIdStr) return null;

  const jobId = parseInt(jobIdStr, 10);
  return isNaN(jobId) ? null : jobId;
}

export async function generateMetadata({ params: paramsPromise }: JobDetailsPageProps): Promise<Metadata> {
  const params = await paramsPromise;
  // FIX: Use the helper to get a number or null
  const jobId = parseJobIdFromSlug(params.jobSlug);

  if (jobId === null) {
    return { title: 'Invalid Job Post - CareerCrew' };
  }

  // The server action now receives the correct type (number)
  const job = await getJobDetailsById(jobId);

  if (!job) {
    return { title: 'Job Not Found - CareerCrew' };
  }
  return { 
    title: `${job.title} at ${job.companyName} - CareerCrew`,
    description: job.description.substring(0, 160),
  };
}

export default async function JobDetailsPage({ params: paramsPromise }: JobDetailsPageProps) {
  const params = await paramsPromise;
  // FIX: Use the helper to get a number or null
  const jobId = parseJobIdFromSlug(params.jobSlug);

  if (jobId === null) {
    notFound();
  }

  // The server action now receives the correct type (number)
  const job = await getJobDetailsById(jobId);

  if (!job) {
    notFound();
  }

  return <JobDetailView job={job} />;
}