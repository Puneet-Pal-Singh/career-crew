// src/components/dashboard/employer/form-fields/JobApplicationFields.tsx
"use client";

import React from 'react';
import { FieldErrors, UseFormRegister } from 'react-hook-form';
import { JobPostSchemaType } from '@/lib/formSchemas';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface JobApplicationFieldsProps {
  register: UseFormRegister<JobPostSchemaType>;
  errors: FieldErrors<JobPostSchemaType>;
}

export default function JobApplicationFields({ register, errors }: JobApplicationFieldsProps) {
  return (
    <fieldset className="space-y-4 border p-4 rounded-md">
      <legend className="text-lg font-semibold px-1">Application Method *</legend>
      <p className="text-xs text-muted-foreground px-1">Provide at least one method for candidates to apply.</p>
      <div>
        <Label htmlFor="application_email">Application Email</Label>
        <Input id="application_email" type="email" {...register("application_email")} placeholder="e.g., careers@example.com" />
        {/* Display general application_email errors if not a custom refine error */}
        {errors.application_email && errors.application_email.type !== 'custom' && (
            <p className="text-sm text-destructive mt-1">{errors.application_email.message}</p>
        )}
      </div>
      <div>
        <Label htmlFor="application_url">Application URL (External Link)</Label>
        <Input id="application_url" type="url" {...register("application_url")} placeholder="https://example.com/apply/job-id" />
        {errors.application_url && <p className="text-sm text-destructive mt-1">{errors.application_url.message}</p>}
      </div>
      {/* Zod refine error specifically for application_email (if it's the target of the refine path for "at least one") */}
      {errors.application_email?.type === 'custom' && <p className="text-sm text-destructive mt-1">{errors.application_email.message}</p>}
    </fieldset>
  );
}