// src/app/dashboard/(employer)/_components/PostJobForm.tsx
'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button'; 
import { Input } from '@/components/ui/input';   
import { Textarea } from '@/components/ui/textarea'; 
import { Label } from '@/components/ui/label';     
import { Checkbox } from '@/components/ui/checkbox'; 
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"; // Import Select components
import { Loader2, AlertCircle} from 'lucide-react'; // Added icons

interface JobFormData {
  title: string;
  companyName: string; 
  location: string;
  jobType: string; 
  salaryMin: string; 
  salaryMax: string;
  salaryCurrency: string; 
  description: string;
  requirements: string; 
  applicationEmail: string; 
  isRemote: boolean;
}

const initialFormData: JobFormData = {
  title: '',
  companyName: '',
  location: '',
  jobType: 'Full-time',
  salaryMin: '',
  salaryMax: '',
  salaryCurrency: 'USD',
  description: '',
  requirements: '',
  applicationEmail: '',
  isRemote: false,
};

const jobTypeOptions = ["Full-time", "Part-time", "Contract", "Internship", "Temporary"];
const currencyOptions = ["USD", "EUR", "GBP", "CAD", "AUD", "INR"];

interface PostJobFormProps {
  userId: string; 
}

export default function PostJobForm({ userId }: PostJobFormProps) {
  const [formData, setFormData] = useState<JobFormData>(initialFormData);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Handler for shadcn/ui Select component's onValueChange
  const handleSelectChange = (name: keyof JobFormData) => (value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handler for shadcn/ui Checkbox component's onCheckedChange
  const handleCheckedChange = (checked: boolean | 'indeterminate') => {
    setFormData(prev => ({ ...prev, isRemote: Boolean(checked) }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    if (!formData.title || !formData.companyName || !formData.location || !formData.description || !formData.applicationEmail) {
      setError('Please fill in all required fields.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/employer/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, userId }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Failed to post job.');

      setSuccessMessage('Job posted successfully! It is now pending review.');
      setFormData(initialFormData); 
      setTimeout(() => {
        router.push('/dashboard/my-jobs'); 
        router.refresh(); 
      }, 2000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-3xl mx-auto bg-surface-light dark:bg-surface-dark p-6 sm:p-8 md:p-10 rounded-xl shadow-2xl border border-border-light dark:border-border-dark">
      {error && (
        <div className="p-4 rounded-md bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700/50 text-red-700 dark:text-red-400 flex items-center gap-3">
          <AlertCircle className="h-5 w-5" /> <span className="font-medium">Error:</span> {error}
        </div>
      )}
      {successMessage && (
        <div className="p-4 rounded-md bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700/50 text-green-700 dark:text-green-400 flex items-center gap-3">
          <AlertCircle className="h-5 w-5" /> <span className="font-medium">Success:</span> {successMessage}
        </div>
      )}

      {/* Basic Information */}
      <fieldset className="space-y-6 border-b border-border-light dark:border-border-dark pb-8">
        <legend className="text-lg font-semibold font-display text-content-light dark:text-content-dark mb-4">Basic Information</legend>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <Label htmlFor="title">Job Title*</Label>
            <Input id="title" name="title" value={formData.title} onChange={handleChange} placeholder="e.g., Senior Software Engineer" required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="companyName">Company Name*</Label>
            <Input id="companyName" name="companyName" value={formData.companyName} onChange={handleChange} placeholder="e.g., Innovatech Solutions" required />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="location">Location*</Label>
          <Input id="location" name="location" value={formData.location} onChange={handleChange} placeholder="e.g., San Francisco, CA or Remote" required />
        </div>
        <div className="flex items-center space-x-2 pt-2">
          <Checkbox id="isRemote" name="isRemote" checked={formData.isRemote} onCheckedChange={handleCheckedChange} />
          <Label htmlFor="isRemote" className="font-normal text-sm cursor-pointer">This job is fully remote</Label>
        </div>
      </fieldset>

      {/* Job Details */}
      <fieldset className="space-y-6 border-b border-border-light dark:border-border-dark pb-8">
        <legend className="text-lg font-semibold font-display text-content-light dark:text-content-dark mb-4">Job Details</legend>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <Label htmlFor="jobType">Job Type*</Label>
            <Select name="jobType" value={formData.jobType} onValueChange={handleSelectChange('jobType')}>
              <SelectTrigger><SelectValue placeholder="Select job type" /></SelectTrigger>
              <SelectContent>
                {jobTypeOptions.map(type => <SelectItem key={type} value={type}>{type}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="applicationEmail">Application Email*</Label>
            <Input id="applicationEmail" name="applicationEmail" type="email" value={formData.applicationEmail} onChange={handleChange} placeholder="e.g., careers@example.com" required />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label>Salary Range (Optional)</Label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-4 gap-y-2 items-end">
            <Input name="salaryMin" type="number" placeholder="Min (e.g., 70000)" value={formData.salaryMin} onChange={handleChange} min="0" step="1000" />
            <Input name="salaryMax" type="number" placeholder="Max (e.g., 90000)" value={formData.salaryMax} onChange={handleChange} min="0" step="1000" />
            <Select name="salaryCurrency" value={formData.salaryCurrency} onValueChange={handleSelectChange('salaryCurrency')}>
              <SelectTrigger><SelectValue placeholder="Currency" /></SelectTrigger>
              <SelectContent>
                {currencyOptions.map(currency => <SelectItem key={currency} value={currency}>{currency}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <p className="text-xs text-subtle-light dark:text-subtle-dark mt-1">Enter annual salary figures. Leave blank if not specified.</p>
        </div>
      </fieldset>
      
      {/* Description & Requirements */}
      <fieldset className="space-y-6">
        <legend className="text-lg font-semibold font-display text-content-light dark:text-content-dark mb-4">Description & Requirements</legend>
        <div className="space-y-1.5">
          <Label htmlFor="description">Job Description* (Markdown supported)</Label>
          <Textarea id="description" name="description" value={formData.description} onChange={handleChange} required rows={10} placeholder="Provide a detailed job description, responsibilities, company culture, day-to-day tasks, etc." />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="requirements">Key Requirements & Qualifications (Markdown supported)</Label>
          <Textarea id="requirements" name="requirements" value={formData.requirements} onChange={handleChange} rows={6} placeholder="List essential skills (e.g., React, Node.js), years of experience, education, certifications, etc." />
        </div>
      </fieldset>

      <div className="flex justify-end pt-6 border-t border-border-light dark:border-border-dark">
        <Button type="submit" disabled={isLoading} size="lg" className="min-w-[200px]">
          {isLoading ? (
            <> <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting... </>
          ) : (
            'Submit Job for Review'
          )}
        </Button>
      </div>
    </form>
  );
}