// src/app/actions/employer/jobs/getEmployerJobByIdForEditAction.ts
"use server";

import { getSupabaseServerClient } from '@/lib/supabase/serverClient';
import { verifyJobOwnership } from '@/app/actions/helpers/jobOwnershipUtils';
import type { JobPostSchemaType } from '@/lib/formSchemas';
// FIX: Import constants from the correct source file.
import { JOB_TYPE_OPTIONS, CURRENCY_OPTIONS } from '@/lib/constants'; 
import type { JobTypeOption } from '@/types';

interface GetJobForEditResult {
  success: boolean;
  job?: JobPostSchemaType;
  error?: string;
}

interface RawJobDataForEdit {
  title: string;
  company_name: string;
  company_logo_url: string | null;
  location: string;
  job_type: string | null;
  description: string;
  requirements: string | null;
  is_remote: boolean;
  salary_min: number | null;
  salary_max: number | null;
  salary_currency: string | null;
  application_email: string | null;
  application_url: string | null;
}

// Create a Set for efficient lookup of valid job type values.
const validJobTypes = new Set(JOB_TYPE_OPTIONS.map(option => option.value));

export async function getEmployerJobByIdForEdit(jobId: string): Promise<GetJobForEditResult> {
  const supabase = await getSupabaseServerClient();
  const actionName = "getEmployerJobByIdForEdit";

  if (!jobId) {
    console.warn(`Server Action (${actionName}): No jobId provided.`);
    return { success: false, error: "Job ID is required to fetch details for editing." };
  }

  try {
    const ownershipResult = await verifyJobOwnership(supabase, jobId);
    if (ownershipResult.error || !ownershipResult.authUser) { 
      return { success: false, error: ownershipResult.error || "User authentication failed for ownership check." };
    }
    const { authUser } = ownershipResult;

    console.log(`Server Action (${actionName}): User ${authUser.id} fetching job ${jobId} for edit.`);

    const { data: jobData, error: fetchError } = await supabase
      .from('jobs')
      .select(
        'title, company_name, company_logo_url, location, job_type, description, ' +
        'requirements, is_remote, salary_min, salary_max, salary_currency, ' +
        'application_email, application_url'
      )
      .eq('id', jobId)
      .eq('employer_id', authUser.id)
      .single<RawJobDataForEdit>();

    if (fetchError) {
      console.error(`Server Action (${actionName}): Supabase error fetching job ${jobId} for user ${authUser.id}. Message:`, fetchError.message);
      if (fetchError.code === 'PGRST116') {
          return { success: false, error: "Job not found or you are not authorized to edit it." };
      }
      return { success: false, error: `Failed to fetch job details: ${fetchError.message}` };
    }

    if (!jobData) {
        console.warn(`Server Action (${actionName}): No job data returned for job ${jobId} (owned by ${authUser.id}), though no explicit Supabase error.`);
        return { success: false, error: "Job details could not be retrieved." };
    }

    const jobFormData: JobPostSchemaType = {
      title: jobData.title,
      company_name: jobData.company_name,
      company_logo_url: jobData.company_logo_url || "",
      location: jobData.location,
      // FIX: Validate against the Set of valid job type values.
      job_type: validJobTypes.has(jobData.job_type as JobTypeOption) 
                  ? jobData.job_type as JobTypeOption 
                  // FIX: Fallback must be a valid value from the options.
                  : JOB_TYPE_OPTIONS[0].value, 
      description: jobData.description,
      requirements: jobData.requirements || "",
      is_remote: jobData.is_remote,
      salary_min: jobData.salary_min ?? undefined,
      salary_max: jobData.salary_max ?? undefined,
      // FIX: Use the imported CURRENCY_OPTIONS for validation.
      salary_currency: (CURRENCY_OPTIONS as readonly string[]).includes(jobData.salary_currency || "")
                        ? jobData.salary_currency as typeof CURRENCY_OPTIONS[number]
                        : "USD",
      application_email: jobData.application_email || "",
      application_url: jobData.application_url || "",
    };
    
    console.log(`Server Action (${actionName}): Successfully fetched job ${jobId} for editing by user ${authUser.id}.`);
    return { success: true, job: jobFormData };

  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "An unexpected error occurred.";
    console.error(`Server Action (${actionName}): Unexpected error for job ${jobId}. Message:`, message, err);
    return { success: false, error: message };
  }
}