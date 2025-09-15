// src/components/dashboard/employer/JobEditorForm.tsx
"use client";

import React, { useState, useTransition, useEffect } from 'react';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { JobPostSchema, type JobPostSchemaType } from '@/lib/formSchemas';
// Import specific actions
import { createJobPost } from '@/app/actions/employer/jobs/createJobPostAction';
import { updateJobPost } from '@/app/actions/employer/jobs/updateJobPostAction';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, Briefcase, CheckCircle, AlertTriangle, Edit3 } from 'lucide-react'; // Added Edit3

// Import fieldset sub-components
import JobPrimaryDetailsFields from './form-fields/JobPrimaryDetailsFields';
import JobDescriptionFields from './form-fields/JobDescriptionFields';
import JobSalaryFields from './form-fields/JobSalaryFields';
import JobApplicationFields from './form-fields/JobApplicationFields';
import SkillsInput from './form-fields/SkillsInput';

interface JobEditorFormProps {
  mode: 'create' | 'edit';
  jobId?: string; // Required for 'edit' mode
  initialData?: Partial<JobPostSchemaType>; // For pre-filling in 'edit' mode
}

// Define blank/default values outside or memoize if they don't depend on props that change frequently
const BLANK_FORM_VALUES: JobPostSchemaType = {
  title: "",
  company_name: "",
  company_logo_url: "",
  location: "",
  job_type: "FULL_TIME", // A valid default for the enum
  description: "",
  requirements: "",
  is_remote: false,
  salary_min: undefined,
  salary_max: undefined,
  salary_currency: "USD", // A valid default for the enum
  application_email: "",
  application_url: "",
};

export default function JobEditorForm({ mode, jobId, initialData }: JobEditorFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  // Consolidated submission status
  const [submissionStatus, setSubmissionStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const form = useForm<JobPostSchemaType>({
    resolver: zodResolver(JobPostSchema),
    defaultValues: mode === 'edit' && initialData 
        ? { ...BLANK_FORM_VALUES, ...initialData } // Merge, ensuring all fields present
        : BLANK_FORM_VALUES,
  });

  const { 
    control, 
    register, 
    handleSubmit, 
    formState: { errors, isSubmitting }, 
    setError: setFormError, 
    reset 
  } = form;

  // Effect to reset form when initialData changes for 'edit' mode or when mode changes
  useEffect(() => {
    if (mode === 'edit' && initialData) {
      console.log("JobEditorForm: Resetting form with initialData for edit mode:", initialData);
      reset({ ...BLANK_FORM_VALUES, ...initialData });
    } else if (mode === 'create') {
      console.log("JobEditorForm: Resetting form to blank for create mode.");
      reset(BLANK_FORM_VALUES);
    }
  }, [mode, initialData, reset]);


  const onSubmit: SubmitHandler<JobPostSchemaType> = async (formData) => {
    setSubmissionStatus(null); // Clear previous status

    startTransition(async () => {
      let result;
      if (mode === 'edit') {
        if (!jobId) {
          console.error("JobEditorForm (edit mode): Job ID is missing.");
          setSubmissionStatus({ type: 'error', message: 'Cannot update job: Job ID is missing.' });
          return;
        }
        console.log("JobEditorForm: Submitting update for job ID:", jobId, "Data:", formData);
        result = await updateJobPost(jobId, formData);
      } else { // mode === 'create'
        console.log("JobEditorForm: Submitting new job. Data:", formData);
        result = await createJobPost(formData);
      }
      
      if (result.success) {
        const successMessage = mode === 'edit' 
          ? `Job "${formData.title}" has been updated successfully.`
          : `Job "${formData.title}" has been posted successfully and is pending approval. (ID: ${result.jobId || 'N/A'})`;
        setSubmissionStatus({ type: 'success', message: successMessage });
        
        if (mode === 'create') {
            reset(BLANK_FORM_VALUES); // Only fully reset for create mode
        }
        // For both create and edit, redirect to the job listings page
        setTimeout(() => {
            router.push('/dashboard/my-jobs'); // Or your chosen path for employer's job list
            router.refresh(); // Trigger a server-side data re-fetch for the target page
        }, 2000); // Delay to allow user to read success message
      } else {
        setSubmissionStatus({ type: 'error', message: result.error || "An unknown error occurred." });
        if (result.errorDetails) {
          result.errorDetails.forEach(errDetail => {
            if (errDetail.field) {
              setFormError(errDetail.field as keyof JobPostSchemaType, { 
                type: 'server', 
                message: errDetail.message 
              });
            }
          });
        }
      }
    });
  };
  
  const cardTitleText = mode === 'edit' ? "Edit Job Posting" : "Create New Job Posting";
  const submitButtonText = mode === 'edit' ? "Save Changes" : "Post Job Listing";
  const TitleIcon = mode === 'edit' ? Edit3 : Briefcase;

  return ( 
    <Card className="w-full max-w-3xl mx-auto my-8 border-none shadow-none"> {/* Optional: remove border/shadow for an even cleaner integration into the dashboard */}
      <CardHeader>
        <CardTitle className="flex items-center text-2xl font-bold">
          {/* Using a generic icon now, as the title is more direct */}
          <Briefcase className="mr-3 h-7 w-7 text-primary" />
          {cardTitleText}
        </CardTitle>
        <CardDescription>
          {mode === 'edit' 
            ? 'Modify the details of your job opening below.' 
            : 'Fill in the details below. Fields marked with an asterisk (*) are required.'}
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-10 pt-6">
          {submissionStatus?.type === 'error' && (
            <Alert variant="destructive" className="mb-6">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Operation Failed</AlertTitle>
              <AlertDescription>{submissionStatus.message}</AlertDescription>
            </Alert>
          )}
          {submissionStatus?.type === 'success' && (
            <div role="alert" className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-md flex items-start">
              <CheckCircle className="h-5 w-5 mr-3 flex-shrink-0" />
              <div>
                <p className="font-bold">Success!</p>
                <p>{submissionStatus.message}</p>
              </div>
            </div>
          )}

          {/* Fieldset Sub-components */}
          {/* Section 1: Primary Details */}
          <div className="space-y-2">
            <h3 className="text-xl font-semibold tracking-tight">Primary Details</h3>
            <p className="text-muted-foreground text-sm">
              Core information about the job role and your company.
            </p>
            <div className="pt-4">
              <JobPrimaryDetailsFields control={control} register={register} errors={errors} />
            </div>
          </div>

          {/* --- NEW SECTION: Skills --- */}
          <div className="space-y-2">
            <h3 className="text-xl font-semibold tracking-tight">Skills</h3>
            <p className="text-muted-foreground text-sm">
              Add up to 5 key skills or technologies. This helps candidates find your job.
            </p>
            <div className="pt-4">
              <Controller
                name="skills"
                control={control}
                render={({ field }) => (
                  <SkillsInput
                    {...field}
                    placeholder="e.g., React, Node.js, TypeScript..."
                  />
                )}
              />
              {errors.skills && (
                <p className="text-sm text-destructive mt-1">
                  {/* This will show errors like "Max 5 skills" */}
                  {errors.skills.message} 
                  {/* This will show errors for individual items if any */}
                  {Array.isArray(errors.skills) && errors.skills.map((err, i) => (
                    <span key={i}>{err?.message}</span>
                  ))}
                </p>
              )}
            </div>
          </div>
          {/* --- END OF NEW SECTION --- */}

          {/* Section 2: Description & Requirements */}
          <div className="space-y-2">
            <h3 className="text-xl font-semibold tracking-tight">Job Description</h3>
            <p className="text-muted-foreground text-sm">
              Provide a detailed description and key requirements for the role.
            </p>
            <div className="pt-4">
              <JobDescriptionFields register={register} errors={errors} />
            </div>
          </div>
          
          {/* Section 3: Salary Information */}
          <div className="space-y-2">
            <h3 className="text-xl font-semibold tracking-tight">Salary (Optional)</h3>
            <p className="text-muted-foreground text-sm">
              Provide a salary range to attract more candidates.
            </p>
            <div className="pt-4">
              <JobSalaryFields control={control} register={register} errors={errors} />
            </div>
          </div>

          {/* Section 4: Application Method */}
          <div className="space-y-2">
            <h3 className="text-xl font-semibold tracking-tight">Application Method *</h3>
            <p className="text-muted-foreground text-sm">
              How should candidates apply? Provide an external URL or an email address.
            </p>
            <div className="pt-4">
              <JobApplicationFields register={register} errors={errors} />
            </div>
          </div>

        </CardContent>
        <CardFooter className="flex justify-end pt-8">
          <Button type="submit" disabled={isPending || isSubmitting} size="lg">
            {(isPending || isSubmitting) ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              // Using TitleIcon for consistency with card title, or use a generic Save/Post icon
              <TitleIcon className="mr-2 h-4 w-4" /> 
            )}
            {isPending || isSubmitting ? 'Submitting...' : submitButtonText}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}