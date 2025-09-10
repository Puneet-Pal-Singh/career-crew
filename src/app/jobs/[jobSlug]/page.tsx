// src/app/jobs/[jobSlug]/page.tsx
import { getJobDetailsByIdAction } from '@/app/actions/query/getJobDetailsByIdAction';
import JobDetailView from '@/components/jobs/JobDetailView';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getSupabaseServerClient } from '@/lib/supabase/serverClient';

// Updated interface for Next.js 15 - params is now a Promise
interface JobDetailsPageProps {
  params: Promise<{
    jobSlug: string;
  }>;
}

function parseJobIdFromSlug(slug: string): number | null {
  const jobIdStr = slug.split('-')[0];
  if (!jobIdStr) return null;
  const jobId = parseInt(jobIdStr, 10);
  return isNaN(jobId) ? null : jobId;
}

export async function generateMetadata({ params }: JobDetailsPageProps): Promise<Metadata> {
  // Await the params promise
  const { jobSlug } = await params;
  const jobId = parseJobIdFromSlug(jobSlug);
  if (!jobId) return { title: 'Invalid Job - CareerCrew' };

  const result = await getJobDetailsByIdAction(jobId);
  if (!result.success || !result.job) {
    return { title: 'Job Not Found - CareerCrew' };
  }
  return { 
    title: `${result.job.title} at ${result.job.companyName} - CareerCrew`,
    description: result.job.description.substring(0, 160),
  };
}

export default async function JobDetailsPage({ params }: JobDetailsPageProps) {
  // Await the params promise
  const { jobSlug } = await params;
  const jobId = parseJobIdFromSlug(jobSlug);
  if (jobId === null) {
    notFound();
  }
  
  // Fetch job details and the current user's session in parallel for performance.
  const jobResultPromise = getJobDetailsByIdAction(jobId);
  const supabase = await getSupabaseServerClient();
  const userPromise = supabase.auth.getUser();

  const [result, { data: userData }] = await Promise.all([jobResultPromise, userPromise]);

  if (!result.success || !result.job) {
    notFound();
  }

  return <JobDetailView job={result.job} user={userData.user} />;
}