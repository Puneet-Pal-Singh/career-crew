// src/components/shared/MarkdownEditor.tsx
"use client";

import React from 'react';
import { Control, Controller, FieldErrors } from 'react-hook-form';
import { JobPostSchemaType } from '@/lib/formSchemas';
import { Label } from '@/components/ui/label';
import dynamic from 'next/dynamic'; // Import the dynamic function
import { Skeleton } from '@/components/ui/skeleton'; // Import Skeleton for loading state

// --- DYNAMIC IMPORT ---
// This tells Next.js to only load the MarkdownEditor component on the client side.
const MarkdownEditor = dynamic(
  () => import('@/components/shared/MarkdownEditor'),
  { 
    ssr: false, // This is the crucial part that disables server-side rendering
    loading: () => <Skeleton className="h-[200px] w-full" />, // Show a loader while it's loading
  }
);

interface JobDescriptionFieldsProps {
  control: Control<JobPostSchemaType>;
  errors: FieldErrors<JobPostSchemaType>;
}

export default function JobDescriptionFields({ control, errors }: JobDescriptionFieldsProps) {
  // The rest of the component logic remains exactly the same.
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