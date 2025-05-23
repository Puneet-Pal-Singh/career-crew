// src/app/actions/helpers/jobOwnershipUtils.ts
"use server";

import type { SupabaseClient, User as AuthUser } from '@supabase/supabase-js';

/**
 * Verifies that the currently authenticated user is the owner of the specified job.
 * This function is intended for use within server actions.
 * 
 * @param supabase - The Supabase client instance.
 * @param jobId - The ID of the job to check ownership for.
 * @returns {Promise<{ authUser: AuthUser; error?: undefined } | { authUser?: undefined; error: string }>} 
 *          An object with the authenticated user if successful and ownership is confirmed, 
 *          or an object with an error message if authentication fails, job is not found, or user is not the owner.
 */
export async function verifyJobOwnership(
    supabase: SupabaseClient, 
    jobId: string
): Promise<{ authUser: AuthUser; error?: undefined } | { authUser?: undefined; error: string }> {
    
    if (!jobId) { // Basic input validation
        console.error("verifyJobOwnership: No jobId provided.");
        return { error: "Job ID is required for ownership verification." };
    }

    const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();

    if (authError || !authUser) {
        console.error("verifyJobOwnership: Authentication error or no user session.", authError);
        return { error: "Authentication required to perform this action." };
    }
    
    const { data: jobData, error: jobError } = await supabase
        .from('jobs')
        .select('employer_id') // Only select the employer_id for the ownership check
        .eq('id', jobId)
        .single(); // Expect one job or an error if not found

    if (jobError) {
        console.error(`verifyJobOwnership: Error fetching job ${jobId}. Message:`, jobError.message);
        // Distinguish between "not found" and other DB errors if possible
        if (jobError.code === 'PGRST116') { // PostgREST error for "0 rows" with .single()
            return { error: "Job not found." };
        }
        return { error: "Database error while fetching job information." };
    }

    if (!jobData) { // Should be caught by jobError with .single(), but as a safeguard
        console.error(`verifyJobOwnership: No job data returned for job ${jobId}, though no explicit DB error.`);
        return { error: "Job not found." };
    }

    if (jobData.employer_id !== authUser.id) {
        console.warn(`verifyJobOwnership: User ${authUser.id} attempted to access/modify job ${jobId} owned by ${jobData.employer_id}. Access denied.`);
        return { error: "You are not authorized to perform this action on this job posting." };
    }
    
    // console.log(`verifyJobOwnership: User ${authUser.id} confirmed as owner of job ${jobId}.`);
    return { authUser }; // Ownership confirmed, return the authenticated user
}