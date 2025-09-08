// src/components/jobs/ApplicationModal.tsx
"use client";

import React, { useState, useEffect, useTransition, useMemo, useCallback } from 'react';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ApplicationFormSchema, type ApplicationFormSchemaType } from '@/lib/formSchemas';
import { submitApplication } from '@/app/actions/seeker/applications/submitApplicationAction';
import { useAuth } from '@/contexts/AuthContext';
import { useUserProfile } from '@/contexts/UserProfileContext';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, Send, CheckCircle, AlertTriangle } from 'lucide-react';

interface ApplicationModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  jobId: string;
  jobTitle: string;
}

// Define the type for default values more explicitly if needed, but relying on RHF's inference with Zod is usually okay
// type ApplicationFormDefaults = Partial<ApplicationFormSchemaType>;

export default function ApplicationModal({ isOpen, onOpenChange, jobId, jobTitle }: ApplicationModalProps) {
  const { user } = useAuth();
  const { userProfile } = useUserProfile();

  const [isSubmitting, startTransition] = useTransition();
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [submissionSuccess, setSubmissionSuccess] = useState<boolean>(false);
  
  // Memoize defaultValues to stabilize them for react-hook-form and useEffect dependencies.
  // These are the "blank slate" defaults.
  const memoizedDefaultValues = useMemo(() => ({
    fullName: "",
    email: "",
    coverLetterNote: "",
    resumeUrl: "",
    consent: false,
  }), []);

  const form = useForm<ApplicationFormSchemaType>({
    resolver: zodResolver(ApplicationFormSchema),
    defaultValues: memoizedDefaultValues,
  });

  const { register, handleSubmit, control, formState: { errors }, reset } = form;

  // Effect to pre-fill and reset form when modal visibility or user changes
  useEffect(() => {
    if (isOpen) {
      // When modal opens, reset with potentially updated defaults (e.g., user logged in)
      // Pre-fill with user data if available, otherwise use the blank slate defaults.
      reset({
        fullName: userProfile?.full_name || (user?.user_metadata?.full_name) || memoizedDefaultValues.fullName,
        email: user?.email || memoizedDefaultValues.email,
        coverLetterNote: memoizedDefaultValues.coverLetterNote,
        resumeUrl: memoizedDefaultValues.resumeUrl,
        consent: memoizedDefaultValues.consent,
      });
      setSubmissionError(null);
      setSubmissionSuccess(false);
    }
  }, [isOpen, user, userProfile, reset, memoizedDefaultValues]); // Add all stable dependencies


  const onSubmit: SubmitHandler<ApplicationFormSchemaType> = async (formData) => {
    setSubmissionError(null);
    setSubmissionSuccess(false);

    startTransition(async () => {
      console.log("Submitting application for job:", jobId, "Data:", formData);
      const result = await submitApplication(formData, jobId); 
      if (result.success) {
        setSubmissionSuccess(true);
        // Form will be reset by the useEffect when isOpen becomes false after timeout
        setTimeout(() => {
          onOpenChange(false); // Close modal on success
        }, 2500); 
      } else {
        setSubmissionError(result.error || "An unknown error occurred while submitting your application.");
      }
    });
  };

  // This function is called by the Dialog when its open state changes (e.g. overlay click, Esc key)
  const handleExternalOpenChange = useCallback((open: boolean) => {
    onOpenChange(open); // Propagate state up to parent
    if (!open) {
      // If modal is closing (and not due to successful submission which handles its own reset via useEffect on isOpen)
      // Reset form to initial defaults and clear states
      if (!submissionSuccess) { // Only reset if not closed due to success message auto-close
          reset(memoizedDefaultValues);
          setSubmissionError(null);
      }
      // submissionSuccess will be reset by useEffect when isOpen becomes true next time
    }
  }, [onOpenChange, reset, memoizedDefaultValues, submissionSuccess]);

  return (
    <Dialog open={isOpen} onOpenChange={handleExternalOpenChange}>
      <DialogContent className="sm:max-w-lg" onPointerDownOutside={(e) => {
          // Prevent closing if currently submitting to avoid interrupting the submission process.
          if (isSubmitting) e.preventDefault();
      }}>
        <DialogHeader>
          <DialogTitle className="text-2xl">Apply for: {jobTitle}</DialogTitle>
          {!submissionSuccess && ( // Hide description if success message is shown
            <DialogDescription>
              Fill in your details below to submit your application.
            </DialogDescription>
          )}
        </DialogHeader>

        {submissionSuccess ? (
          <div className="py-8 text-center flex flex-col items-center">
            <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
            <h3 className="text-xl font-semibold text-foreground">Application Submitted!</h3>
            <p className="text-muted-foreground mt-2 max-w-sm">
              The employer has received your application. You will be contacted if you are a good fit.
            </p>
            <Button onClick={() => onOpenChange(false)} className="mt-6 w-full sm:w-auto">
              Close
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
            {submissionError && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Application Error</AlertTitle>
                <AlertDescription>{submissionError}</AlertDescription>
              </Alert>
            )}

            <div>
              <Label htmlFor="fullName">Full Name *</Label>
              <Input id="fullName" {...register("fullName")} placeholder="Your full name" autoComplete="name"/>
              {errors.fullName && <p className="text-sm text-destructive mt-1">{errors.fullName.message}</p>}
            </div>

            <div>
              <Label htmlFor="email">Email Address *</Label>
              <Input id="email" type="email" {...register("email")} placeholder="your@email.com" autoComplete="email"/>
              {errors.email && <p className="text-sm text-destructive mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <Label htmlFor="coverLetterNote">Cover Letter Note (Optional)</Label>
              <Textarea 
                id="coverLetterNote" 
                {...register("coverLetterNote")} 
                placeholder="Briefly tell us why you're a good fit for this role..." 
                rows={4} 
              />
              {errors.coverLetterNote && <p className="text-sm text-destructive mt-1">{errors.coverLetterNote.message}</p>}
            </div>

            <div>
              <Label htmlFor="resumeUrl">Resume/Profile URL (Optional)</Label>
              <Input 
                id="resumeUrl" 
                type="url" 
                {...register("resumeUrl")} 
                placeholder="e.g., https://linkedin.com/in/yourprofile" 
              />
              {errors.resumeUrl && <p className="text-sm text-destructive mt-1">{errors.resumeUrl.message}</p>}
            </div>

            <div className="flex items-start space-x-3 pt-2"> {/* Increased space-x for better alignment */}
              <Controller
                  name="consent"
                  control={control}
                  render={({ field }) => (
                      <Checkbox
                          id="consent"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="mt-1 flex-shrink-0" // Prevent checkbox from shrinking
                      />
                  )}
              />
              <div className="grid gap-1.5 leading-none">
                <Label htmlFor="consent" className="cursor-pointer font-normal text-sm">
                  I consent to my application details being shared with the employer for hiring purposes. *
                </Label>
                {errors.consent && <p className="text-xs text-destructive">{errors.consent.message}</p>}
              </div>
            </div>

            <DialogFooter className="pt-6 sm:justify-between">
                <DialogClose asChild>
                    <Button type="button" variant="outline" disabled={isSubmitting} className="w-full sm:w-auto order-last sm:order-first mt-2 sm:mt-0">
                    Cancel
                    </Button>
                </DialogClose>
              <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Submit Application
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}