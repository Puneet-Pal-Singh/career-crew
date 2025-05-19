// src/components/dashboard/employer/form-fields/JobSalaryFields.tsx
"use client";

import React from 'react';
import { Control, Controller, FieldErrors, UseFormRegister } from 'react-hook-form';
import { JobPostSchemaType, currencyOptions } from '@/lib/formSchemas';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface JobSalaryFieldsProps {
  control: Control<JobPostSchemaType>;
  register: UseFormRegister<JobPostSchemaType>;
  errors: FieldErrors<JobPostSchemaType>;
}

export default function JobSalaryFields({ control, register, errors }: JobSalaryFieldsProps) {
  return (
    <fieldset className="space-y-1 border p-4 rounded-md">
      <legend className="text-lg font-semibold px-1 mb-3">Salary Information (Optional)</legend>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-2 items-start"> {/* Adjusted gap-y */}
        
        <div className="flex flex-col space-y-1">
          <Label htmlFor="salary_min">Minimum</Label>
          <Input 
            id="salary_min" 
            type="number" 
            // valueAsNumber: true helps RHF provide a number or NaN
            // z.preprocess will further refine empty strings/null to undefined
            {...register("salary_min", { valueAsNumber: true })} 
            placeholder="e.g., 60000" 
            step="any" // Allows decimals if needed, though Zod .int() will enforce integer
          />
          {errors.salary_min && <p className="text-xs text-destructive mt-1">{errors.salary_min.message}</p>}
        </div>
        
        <div className="flex flex-col space-y-1">
          <Label htmlFor="salary_max">Maximum</Label>
          <Input 
            id="salary_max" 
            type="number" 
            {...register("salary_max", { valueAsNumber: true })} 
            placeholder="e.g., 80000" 
            step="any"
          />
          {/* Display general error if not the custom 'refine' error */}
          {errors.salary_max && errors.salary_max.type !== 'custom' && (
            <p className="text-xs text-destructive mt-1">{errors.salary_max.message}</p>
          )}
        </div>
        
        <div className="flex flex-col space-y-1">
            <Label htmlFor="salary_currency">Currency</Label>
            <Controller
                name="salary_currency"
                control={control}
                // RHF defaultValues will set this to "USD"
                render={({ field }) => ( 
                    <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger id="salary_currency">
                            <SelectValue placeholder="Select currency" />
                        </SelectTrigger>
                        <SelectContent>
                            {currencyOptions.map(currency => (
                                <SelectItem key={currency} value={currency}>{currency}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                )}
            />
            {errors.salary_currency && <p className="text-xs text-destructive mt-1">{errors.salary_currency.message}</p>}
        </div>
      </div>
      {/* Display custom 'refine' error for salary_max specifically */}
      {errors.salary_max?.type === 'custom' && (
         <div className="mt-1"> {/* Ensure it's on its own line */}
              <p className="text-xs text-destructive">{errors.salary_max.message}</p>
         </div>
      )}
    </fieldset>
  );
}