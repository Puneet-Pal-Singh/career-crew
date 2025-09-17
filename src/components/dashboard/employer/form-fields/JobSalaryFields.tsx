// src/components/dashboard/employer/form-fields/JobSalaryFields.tsx
"use client";

import React from 'react';
import { Control, Controller, FieldErrors } from 'react-hook-form';
import { JobPostSchemaType } from '@/lib/formSchemas';
import { CURRENCY_OPTIONS } from '@/lib/constants';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface JobSalaryFieldsProps {
  control: Control<JobPostSchemaType>;
  // register: UseFormRegister<JobPostSchemaType>;
  errors: FieldErrors<JobPostSchemaType>;
}

export default function JobSalaryFields({ control, errors }: JobSalaryFieldsProps) {
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-6">
        {/* Minimum Salary */}
        <div className="flex flex-col space-y-1">
          <Label htmlFor="salary_min">Minimum</Label>
          <Controller
            name="salary_min"
            control={control}
            render={({ field: { onChange, value, ...restField } }) => (
              <Input 
                id="salary_min"
                type="number"
                placeholder="e.g., 60000"
                {...restField}
                // Use the 'value' from the controller, defaulting to '' if undefined/null
                value={value ?? ''}
                // THIS IS THE FIX: Intercept the onChange event
                onChange={(e) => {
                  const val = e.target.value;
                  // If the input is empty, pass `undefined` to the form state.
                  // Otherwise, parse it as a number.
                  onChange(val === '' ? undefined : parseInt(val, 10));
                }}
              />
            )}
          />
          {errors.salary_min && <p className="text-xs text-destructive mt-1">{errors.salary_min.message}</p>}
        </div>
        
        <div className="flex flex-col space-y-1">
          <Label htmlFor="salary_max">Maximum</Label>
         <Controller
            name="salary_max"
            control={control}
            render={({ field: { onChange, value, ...restField } }) => (
              <Input 
                id="salary_max"
                type="number"
                placeholder="e.g., 80000"
                {...restField}
                value={value ?? ''}
                onChange={(e) => {
                  const val = e.target.value;
                  onChange(val === '' ? undefined : parseInt(val, 10));
                }}
              />
            )}
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
                            {CURRENCY_OPTIONS.map(currency => (
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
    </div>
  );
}