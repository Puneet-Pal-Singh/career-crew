// src/components/shared/MarkdownEditor.tsx
"use client";

import React from 'react';
import { Control, Controller, FieldErrors } from 'react-hook-form'; // Import Control and Controller
import { JobPostSchemaType } from '@/lib/formSchemas';
import { Label } from '@/components/ui/label';
import MarkdownEditor from '@/components/shared/MarkdownEditor'; // Import our new editor

interface JobDescriptionFieldsProps {
  // CHANGED: We now need the `control` object from react-hook-form
  control: Control<JobPostSchemaType>;
  errors: FieldErrors<JobPostSchemaType>;
}

export default function JobDescriptionFields({ control, errors }: JobDescriptionFieldsProps) {
  return (
    <div className="space-y-6">
      {/* Description */}
      <div>
        <Label htmlFor="description">Job Description *</Label>
        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <MarkdownEditor
              {...field}
              placeholder="Provide a detailed description of the job role, responsibilities, and company culture..."
            />
          )}
        />
        {errors.description && <p className="text-sm text-destructive mt-1">{errors.description.message}</p>}
      </div>

      {/* Requirements */}
      <div>
        <Label htmlFor="requirements">Requirements / Qualifications</Label>
        <Controller
          name="requirements"
          control={control}
          render={({ field }) => (
            <MarkdownEditor
              {...field}
              placeholder="List key skills, experience, and qualifications required for this role..."
            />
          )}
        />
        {errors.requirements && <p className="text-sm text-destructive mt-1">{errors.requirements.message}</p>}
      </div>
    </div>
  );
}