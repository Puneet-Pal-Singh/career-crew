// src/components/dashboard/employer/form-fields/JobPrimaryDetailsFields.tsx
"use client";

import React from 'react';
import { Control, Controller, FieldErrors, UseFormRegister } from 'react-hook-form';
import { JobPostSchemaType } from '@/lib/formSchemas';
import { JOB_TYPE_OPTIONS } from '@/lib/constants';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface JobPrimaryDetailsFieldsProps {
  control: Control<JobPostSchemaType>;
  register: UseFormRegister<JobPostSchemaType>;
  errors: FieldErrors<JobPostSchemaType>;
}

export default function JobPrimaryDetailsFields({ control, register, errors }: JobPrimaryDetailsFieldsProps) {
  return (
    // Replaced <fieldset> with a <div> containing our responsive grid
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      
      {/* Job Title (Spans 2 columns on medium screens and up) */}
      <div className="md:col-span-2">
        <Label htmlFor="title">Job Title *</Label>
        <Input id="title" {...register("title")} placeholder="e.g., Senior Software Engineer" />
        {errors.title && <p className="text-sm text-destructive mt-1">{errors.title.message}</p>}
      </div>

      {/* Company Name */}
      <div>
        <Label htmlFor="company_name">Company Name *</Label>
        <Input id="company_name" {...register("company_name")} placeholder="e.g., Acme Corp" />
        {errors.company_name && <p className="text-sm text-destructive mt-1">{errors.company_name.message}</p>}
      </div>
      
      {/* Company Logo URL */}
      <div>
        <Label htmlFor="company_logo_url">Company Logo URL</Label>
        <Input id="company_logo_url" {...register("company_logo_url")} placeholder="https://example.com/logo.png" />
        {errors.company_logo_url && <p className="text-sm text-destructive mt-1">{errors.company_logo_url.message}</p>}
      </div>

      {/* Location */}
      <div>
        <Label htmlFor="location">Location *</Label>
        <Input id="location" {...register("location")} placeholder="e.g., New York, NY or Remote" />
        {errors.location && <p className="text-sm text-destructive mt-1">{errors.location.message}</p>}
      </div>

      {/* Job Type */}
      <div>
        <Label htmlFor="job_type">Job Type *</Label>
        <Controller
          name="job_type"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value || ''}>
              <SelectTrigger id="job_type">
                <SelectValue placeholder="Select job type" />
              </SelectTrigger>
              <SelectContent>
                {JOB_TYPE_OPTIONS.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.job_type && <p className="text-sm text-destructive mt-1">{errors.job_type.message}</p>}
      </div>

      {/* Is Remote (Aligned to the grid) */}
      <div className="md:col-span-2 flex items-center space-x-2 pt-2">
        <Controller
            name="is_remote"
            control={control}
            render={({ field }) => (
                <Checkbox
                    id="is_remote"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                />
            )}
        />
        <Label htmlFor="is_remote" className="cursor-pointer font-normal text-sm">
          This is a remote position
        </Label>
      </div>
    </div>
  );
}