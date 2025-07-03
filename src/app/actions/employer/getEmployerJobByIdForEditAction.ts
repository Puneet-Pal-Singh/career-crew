// src/app/actions/employer/getEmployerJobByIdForEditAction.ts
"use server";

import { getSupabaseServerClient } from '@/lib/supabase/serverClient';
import { verifyJobOwnership } from '@/app/actions/helpers/jobOwnershipUtils';
import type { JobPostSchemaType } from '@/lib/formSchemas';
// We need JobTypeOption and CurrencyOption if we are casting from strings from DB
import { jobTypeOptions, currencyOptions } from '@/lib/formSchemas'; 
import type { JobTypeOption } from '@/types'; // Assuming currencyOptions is similar

interface GetJobForEditResult {
  success: boolean;
  job?: JobPostSchemaType;
  error?: string;
}

// Define a more specific type for the raw data we expect from the 'jobs' table for editing
// This should mirror the fields selected in the query.
interface RawJobDataForEdit {
  title: string;
  company_name: string;
  company_logo_url: string | null;
  location: string;
  job_type: string | null; // This comes from DB, might not be strictly JobTypeOption yet
  description: string;
  requirements: string | null;
  is_remote: boolean;
  salary_min: number | null;
  salary_max: number | null;
  salary_currency: string | null; // This comes from DB
  application_email: string | null;
  application_url: string | null;
}


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
      .eq('employer_id', authUser.id) // Ensured by verifyJobOwnership, but good for query integrity
      .single<RawJobDataForEdit>(); // Use the specific raw type here

    if (fetchError) {
      console.error(`Server Action (${actionName}): Supabase error fetching job ${jobId} for user ${authUser.id}. Message:`, fetchError.message);
      if (fetchError.code === 'PGRST116') {
          return { success: false, error: "Job not found or you are not authorized to edit it." };
      }
      return { success: false, error: `Failed to fetch job details: ${fetchError.message}` };
    }

    // If .single() was used and fetchError is null, jobData should be an object (RawJobDataForEdit), not null.
    // However, a defensive check is good.
    if (!jobData) {
        console.warn(`Server Action (${actionName}): No job data returned for job ${jobId} (owned by ${authUser.id}), though no explicit Supabase error.`);
        return { success: false, error: "Job details could not be retrieved." };
    }

    // Map raw database data to the JobPostSchemaType structure
    // Ensure type compatibility and provide defaults for the form where Zod schema expects them.
    const jobFormData: JobPostSchemaType = {
      title: jobData.title,
      company_name: jobData.company_name,
      company_logo_url: jobData.company_logo_url || "",
      location: jobData.location,
      // Validate and cast job_type from DB string to the specific enum type
      job_type: jobTypeOptions.includes(jobData.job_type as JobTypeOption) 
                  ? jobData.job_type as JobTypeOption 
                  : jobTypeOptions[0], // Fallback to first option if invalid, or handle error
      description: jobData.description,
      requirements: jobData.requirements || "",
      is_remote: jobData.is_remote,
      salary_min: jobData.salary_min ?? undefined,
      salary_max: jobData.salary_max ?? undefined,
      // Validate and cast salary_currency from DB string
      salary_currency: currencyOptions.includes(jobData.salary_currency as typeof currencyOptions[number])
                        ? jobData.salary_currency as typeof currencyOptions[number]
                        : "USD", // Default if invalid or not set
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