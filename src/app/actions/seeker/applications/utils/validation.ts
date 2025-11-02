// src/app/actions/seeker/applications/utils/validation.ts
import type { SupabaseClient } from '@supabase/supabase-js';
import * as z from "zod";

const MAX_RESUME_SIZE_BYTES = 5 * 1024 * 1024; // 5MB
const ACCEPTED_RESUME_MIME_TYPES = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
]);

const applicationPayloadSchema = z.object({
  jobId: z.number(),
  coverLetter: z.string().optional(),
  linkedinUrl: z.string().optional(),
  resumeFile: z
    .instanceof(File)
    .refine((file) => file.size > 0, "A resume file is required.")
    .refine((file) => file.size <= MAX_RESUME_SIZE_BYTES, `Max file size is 5MB.`)
    .refine((file) => ACCEPTED_RESUME_MIME_TYPES.has(file.type), "Only .pdf, .doc, and .docx formats are supported."),
});

export type ValidatedApplicationPayload = z.infer<typeof applicationPayloadSchema>;

/**
 * Validates the raw FormData from the application form.
 * Throws an error if validation fails.
 */
export function validateApplicationPayload(formData: FormData): ValidatedApplicationPayload {
  const jobIdString = formData.get('jobId') as string;
  const jobId = parseInt(jobIdString, 10);

  if (isNaN(jobId)) {
    throw new Error("Invalid Job ID format.");
  }

  const result = applicationPayloadSchema.safeParse({
    jobId,
    // THE DEFINITIVE FIX: Coalesce null/undefined to an empty string for optional fields.
    coverLetter: (formData.get('coverLetter') as string | null) ?? '',
    linkedinUrl: (formData.get('linkedinUrl') as string | null) ?? '',
    resumeFile: formData.get('resumeFile') as File,
  });

  if (!result.success) {
    const firstError = result.error.flatten().fieldErrors;
    const errorMessage = Object.values(firstError)[0]?.[0] || "Invalid application data.";
    // This is where "Expected string, received null" was being generated.
    console.error("Zod Validation Error:", result.error.flatten());
    throw new Error(errorMessage);
  }
  return result.data;
}

/**
 * Performs all business logic checks before submission.
 * Returns an error string if any check fails, otherwise returns null.
 */
export async function runBusinessLogicChecks(
  jobId: number, 
  userId: string, 
  supabase: SupabaseClient
): Promise<string | null> {
  const [jobResult, existingApplicationResult] = await Promise.all([
    supabase.from('jobs').select('status, employer_id').eq('id', jobId).single(),
    supabase.from('applications').select('id', { count: 'exact', head: true }).eq('job_id', jobId).eq('seeker_id', userId)
  ]);

  const { data: jobData, error: jobError } = jobResult;
  if (jobError || !jobData) return "This job posting could not be found.";
  if (jobData.status !== 'APPROVED') return "This job is no longer accepting applications.";
  if (jobData.employer_id === userId) return "You cannot apply to your own job posting.";

  const { count: existingCount, error: checkError } = existingApplicationResult;
  if (checkError) throw checkError;
  if (existingCount !== null && existingCount > 0) return "You have already applied for this job.";

  return null; // All checks passed
}