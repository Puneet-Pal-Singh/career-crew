// src/lib/actions/admin-job-actions.ts

'use server';

import { createSupabaseServerClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

// We will expand on this schema later for the edit form.
const JobSchema = z.object({
  // ... schema properties will go here
});

/**
 * Fetches all jobs from the database using the secure RPC function.
 * Intended to be called from the main '/dashboard/admin/jobs' page.
 */
export async function getAllJobsForAdmin() {
  const supabase = await createSupabaseServerClient();
  const { data: jobs, error } = await supabase.rpc('get_all_jobs_for_admin');

  if (error) {
    console.error('Database Error:', error.message);
    throw new Error('Failed to fetch jobs for admin.');
  }

  return jobs;
}

/**
 * Fetches a single job by its ID.
 * This does not need a special RPC function if we assume the admin
 * can read all jobs anyway once validated by the page's access control.
 * We will add RLS for this later if needed.
 */
export async function getJobByIdForAdmin(jobId: string) {
  const supabase = await createSupabaseServerClient();
  const { data: job, error } = await supabase
    .from('jobs')
    .select('*')
    .eq('id', jobId)
    .single();

  if (error) {
    console.error('Database Error:', error.message);
    throw new Error('Failed to fetch job data for editing.');
  }

  return job;
}

/**
 * Updates a job record in the database.
 * Called from the 'Edit Job' form.
 */
export async function updateJobByAdmin(jobId: string, formData: FormData) {
  // TODO: Validate formData against JobSchema
  // TODO: Perform the database update operation

  console.log('Updating job', jobId, 'with data:', formData);

  // Revalidate the path to ensure the jobs table shows the updated data.
  revalidatePath('/dashboard/admin/jobs');

  // TODO: Add redirect back to the jobs table.
}