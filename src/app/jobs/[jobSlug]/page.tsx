// src/app/jobs/[jobSlug]/page.tsx
import { getJobDetailsById } from '@/app/actions/query/getJobDetailsByIdAction';
import JobDetailView from '@/components/jobs/JobDetailView';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getSupabaseServerClient } from '@/lib/supabase/serverClient'; // Import the client

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
  const jobId = parseJobIdFromSlug(params.jobSlug);

  if (jobId === null) {
    notFound();
  }
  
  // FIX: Use the server client to fetch job details and user data
  const supabase = await getSupabaseServerClient();
  const jobPromise = getJobDetailsById(jobId);
  const userPromise = supabase.auth.getUser();

  // Await both promises in parallel.
  const [job, { data: userData }] = await Promise.all([jobPromise, userPromise]);

  if (!job) {
    notFound();
  }

  // ✅ Pass the session (which can be null for logged-out users) as a prop.
  return <JobDetailView job={job} user={userData.user} />;
}