// src/components/dashboard/employer/form-fields/JobDescriptionFields.tsx
"use client";

import React from 'react';
import { FieldErrors, UseFormRegister } from 'react-hook-form';
import { JobPostSchemaType } from '@/lib/formSchemas';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface JobDescriptionFieldsProps {
  register: UseFormRegister<JobPostSchemaType>;
  errors: FieldErrors<JobPostSchemaType>;
}

export default function JobDescriptionFields({ register, errors }: JobDescriptionFieldsProps) {
  return (
    // CHANGED: Replaced <fieldset> with a simple div
    <div className="space-y-6">
      {/* Description */}
      <div>
        <Label htmlFor="description">Job Description *</Label>
        <Textarea id="description" {...register("description")} placeholder="Provide a detailed description of the job role, responsibilities, and company culture..." rows={8} />
        {errors.description && <p className="text-sm text-destructive mt-1">{errors.description.message}</p>}
      </div>

      {/* Requirements */}
      <div>
        <Label htmlFor="requirements">Requirements / Qualifications</Label>
        <Textarea id="requirements" {...register("requirements")} placeholder="List key skills, experience, and qualifications required for this role..." rows={6} />
        {errors.requirements && <p className="text-sm text-destructive mt-1">{errors.requirements.message}</p>}
      </div>
    </div>
  );
}