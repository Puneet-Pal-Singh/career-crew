// src/components/dashboard/employer/PostJobForm.tsx
"use client";

import React, { useState, useTransition } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form'; // Added Controller
import { zodResolver } from '@hookform/resolvers/zod';
import { JobPostSchema, type JobPostSchemaType } from '@/lib/formSchemas'; // Using simplified schema
import { createJobPost } from '@/app/actions/employer/createJobPostAction';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, Briefcase, CheckCircle, AlertTriangle } from 'lucide-react';

import JobPrimaryDetailsFields from './form-fields/JobPrimaryDetailsFields';
import JobDescriptionFields from './form-fields/JobDescriptionFields';
import JobSalaryFields from './form-fields/JobSalaryFields';
import JobApplicationFields from './form-fields/JobApplicationFields';

// These defaultValues MUST match the simplified JobPostSchemaType perfectly
const defaultFormValues: JobPostSchemaType = {
  title: "",
  company_name: "",
  company_logo_url: "", // Zod: .string().url().optional().or(z.literal(''))
  location: "",
  job_type: "FULL_TIME",  // Zod: .enum(jobTypeOptions) - must be one of the options
  description: "",
  requirements: "",    // Zod: .string().optional().or(z.literal(''))
  is_remote: false,      // Zod: .boolean()
  salary_min: undefined, // Zod: .number().optional()
  salary_max: undefined, // Zod: .number().optional()
  salary_currency: "USD", // Zod: .enum(currencyOptions)
  application_email: "", // Zod: .string().email().optional().or(z.literal(''))
  application_url: "",   // Zod: .string().url().optional().or(z.literal(''))
};

export default function PostJobForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [submissionSuccess, setSubmissionSuccess] = useState<string | null>(null);

  const form = useForm<JobPostSchemaType>({
    resolver: zodResolver(JobPostSchema), // Using simplified JobPostSchema
    defaultValues: defaultFormValues,
  });

  const { 
    control, 
    register, 
    handleSubmit, 
    formState: { errors, isSubmitting }, 
    setError: setFormError, 
    reset 
  } = form;

  const onSubmit: SubmitHandler<JobPostSchemaType> = async (data) => {
    setSubmissionError(null);
    setSubmissionSuccess(null);

    // Data here has passed client-side Zod validation based on the simplified schema.
    // `valueAsNumber: true` in JobSalaryFields should have converted salary inputs.
    // Zod's .optional() for numbers handles cases where `valueAsNumber` results in `NaN` (by making it undefined).

    startTransition(async () => {
      console.log("Form Data Submitted to Server Action:", data);
      const result = await createJobPost(data); 
      
      if (result.success && result.jobId) {
        setSubmissionSuccess(`Job "${data.title}" posted successfully! (ID: ${result.jobId})`);
        reset(); 
        setTimeout(() => {
            router.push('/dashboard');
        }, 2500);
      } else {
        setSubmissionError(result.error || "An unknown error occurred.");
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
  
  return ( 
    <Card className="w-full max-w-3xl mx-auto my-8">
      <CardHeader>
        <CardTitle className="flex items-center text-2xl font-bold">
          <Briefcase className="mr-3 h-7 w-7 text-primary" />
          Create New Job Posting
        </CardTitle>
        <CardDescription>
          Provide the details for your new job opening.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-8 pt-6">
          {submissionError && (
            <Alert variant="destructive" className="mb-6">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Error Posting Job</AlertTitle>
              <AlertDescription>{submissionError}</AlertDescription>
            </Alert>
          )}
          {submissionSuccess && (
            <div role="alert" className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-md flex items-start">
              <CheckCircle className="h-5 w-5 mr-3 flex-shrink-0" />
              <div>
                <p className="font-bold">Job Posted Successfully!</p>
                <p>{submissionSuccess}</p>
              </div>
            </div>
          )}

          <JobPrimaryDetailsFields control={control} register={register} errors={errors} />
          <JobDescriptionFields register={register} errors={errors} />
          <JobSalaryFields control={control} register={register} errors={errors} />
          <JobApplicationFields register={register} errors={errors} />
        </CardContent>
        <CardFooter className="flex justify-end pt-8">
          <Button type="submit" disabled={isPending || isSubmitting} size="lg">
            {(isPending || isSubmitting) ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Briefcase className="mr-2 h-4 w-4" />
            )}
            {isPending || isSubmitting ? 'Submitting...' : 'Post Job Listing'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}