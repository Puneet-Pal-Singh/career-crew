// src/components/jobs/application-form/ApplicationForm.tsx
"use client";

import React, { useTransition, useEffect } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useUserProfile } from '@/contexts/UserProfileContext';
import { submitApplicationAction } from '@/app/actions/seeker/applications/submitApplicationAction';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Upload, FileText, Send, Loader2 } from 'lucide-react';
// import { toast } from 'sonner';

// Define props for the new component
// Update the props to include the new error callback
interface ApplicationFormProps {
  jobId: string;
  onApplicationSuccess: () => void;
  onApplicationError: (message: string) => void; // <-- NEW PROP
  onCancel: () => void;
}

// Keep constants and schema co-located with the form
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_FILE_TYPES = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];

const applicationSchema = z.object({
  fullName: z.string().min(2, "Full name is required."),
  email: z.string().email("Please enter a valid email address."),
  linkedinUrl: z.string().url("Please enter a valid URL.").optional().or(z.literal('')),
  resumeFile: z
    .instanceof(File, { message: "A resume file is required." })
    .refine((file) => file.size <= MAX_FILE_SIZE, `Max file size is 5MB.`)
    .refine((file) => ACCEPTED_FILE_TYPES.includes(file.type), "Only .pdf, .doc, and .docx formats are supported."),
  coverLetter: z.string().max(1000, "Note cannot exceed 1000 characters.").optional(),
});

type ApplicationFormValues = z.infer<typeof applicationSchema>;

export default function ApplicationForm({ jobId, onApplicationSuccess, onApplicationError, onCancel }: ApplicationFormProps) {
  const [isPending, startTransition] = useTransition();
  const { userProfile } = useUserProfile();

  const form = useForm<ApplicationFormValues>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      fullName: "",
      email: "",
      coverLetter: "",
      linkedinUrl: ""
    },
  });

  // IMPROVEMENT 3: Pre-fill user data when the profile is available.
  useEffect(() => {
    if (userProfile) {
      form.reset({
        fullName: userProfile.full_name || "",
        email: userProfile.email || "",
      });
    }
  }, [userProfile, form]);

  const onSubmit = (values: ApplicationFormValues) => {
    const formData = new FormData();
    formData.append('jobId', jobId);
    if (values.resumeFile) formData.append('resumeFile', values.resumeFile);
    if (values.coverLetter) formData.append('coverLetter', values.coverLetter);
    if (values.linkedinUrl) formData.append('linkedinUrl', values.linkedinUrl);
    // Note: We no longer send fullName and email in FormData as they are derived from the authenticated user on the server.
    
    startTransition(() => {
      // We no longer use toast here
      submitApplicationAction(formData).then(result => {
        if (result.success) {
          onApplicationSuccess(); // Notify parent of success
        } else {
          // THE FIX: Notify the parent of the specific error
          onApplicationError(result.error);
        }
      });
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" id="applicationForm">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField name="fullName" control={form.control} render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name *</FormLabel>
              <FormControl><Input {...field} readOnly /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField name="email" control={form.control} render={({ field }) => (
            <FormItem>
              <FormLabel>Email Address *</FormLabel>
              <FormControl><Input type="email" {...field} readOnly /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
        </div>

        <FormField name="linkedinUrl" control={form.control} render={({ field }) => (
          <FormItem>
            <FormLabel>LinkedIn Profile</FormLabel>
            <FormControl><Input {...field} placeholder="https://linkedin.com/in/..." /></FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <FormField 
          name="resumeFile" 
          control={form.control} 
          render={({ field: { onChange, value, ...rest } }) => (
            <FormItem>
              <FormLabel>Resume (PDF, DOCX up to 5MB) *</FormLabel>
              <FormControl>
                <div className="relative border-2 border-dashed rounded-lg p-6 text-center hover:border-primary transition-colors">
                  <label htmlFor="resume-upload" className="flex flex-col items-center justify-center gap-2 text-muted-foreground cursor-pointer">
                    {value?.name ? (
                      <div className="flex items-center justify-center gap-2 text-primary font-medium">
                        <FileText className="h-5 w-5" />
                        <span>{value.name}</span>
                      </div>
                    ) : (
                      <>
                        <Upload className="h-8 w-8" />
                        <span>Click or drag & drop to upload</span>
                      </>
                    )}
                  </label>
                  <Input 
                    id="resume-upload"
                    type="file" 
                    className="hidden"
                    accept={ACCEPTED_FILE_TYPES.join(",")}
                    {...rest}
                    onChange={(e) => onChange(e.target.files?.[0])}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )} 
        />

        <FormField name="coverLetter" control={form.control} render={({ field }) => (
          <FormItem>
            <FormLabel>Cover Letter Note</FormLabel>
            <FormControl><Textarea {...field} rows={3} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />

        {/* The action buttons are now part of the form itself */}
        <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 gap-2 pt-4">
          <Button type="button" variant="ghost" onClick={onCancel} disabled={isPending}>Cancel</Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...</> : <><Send className="mr-2 h-4 w-4" /> Submit Application</>}
          </Button>
        </div>
      </form>
    </Form>
  );
}