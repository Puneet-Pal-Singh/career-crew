// src/components/jobs/JobDetailView.tsx
"use client";

import React, { useState, useEffect } from 'react';
import type { JobDetailData } from '@/types';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { MapPin, Briefcase, Mail, ExternalLink, Building, Clock, DollarSign, Zap, Loader2 } from 'lucide-react';
import Link from 'next/link';
import ApplicationModal from '@/components/jobs/ApplicationModal';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation'; // Corrected import

// Helper to format salary display
const formatSalaryDetail = (min?: number | null, max?: number | null, currency?: string | null): string => {
  const curr = currency || '$';
  if (min && max) return `${curr}${min} - ${curr}${max} per year`;
  if (min) return `Starting from ${curr}${min} per year`;
  if (max) return `Up to ${curr}${max} per year`;
  return "Competitive";
};

interface JobDetailViewProps {
  job: JobDetailData; // Job data is passed as a prop
}

export default function JobDetailView({ job }: JobDetailViewProps) {
  const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false);
  const { user, isLoading: authLoading, isInitialized: authInitialized } = useAuth();
  const router = useRouter();

  // Update document title when job data is available
  useEffect(() => {
    if (job) {
        document.title = `${job.title} at ${job.companyName} - CareerCrew`;
    }
  }, [job]);

 const handleApplyNow = () => {
    // Check if auth has initialized and is not in a loading state.
    if (authInitialized && !authLoading) {
      if (!user) {
        // If there's no user, redirect to login with the return path.
        const returnUrl = window.location.pathname;
        // FIX: Use 'after_sign_in' for the parameter name for consistency.
        router.push(`/login?after_sign_in=${encodeURIComponent(returnUrl)}`);
      } else {
        // If there is a user, open the application modal.
        setIsApplicationModalOpen(true);
      }
    }
    // If auth is still loading, the button is disabled, so nothing happens.
  };

  if (!job) { // Should not happen if page component handles notFound()
    return <p>Job data is not available.</p>; 
  }

  return (
    <>
      <div className="container mx-auto py-10 px-4 max-w-4xl">
        <article className="bg-card p-6 sm:p-8 rounded-xl shadow-lg">
          <header className="mb-8 border-b pb-6">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
                  {job.title}
                </h1>
                <div className="mt-2 flex items-center text-lg text-muted-foreground">
                  {job.companyLogoUrl && job.companyLogoUrl !== '/company-logos/default-company-logo.svg' && (
                    <Image 
                      src={job.companyLogoUrl} 
                      alt={`${job.companyName} logo`} 
                      width={32}
                      height={32}
                      className="mr-3 rounded-md object-contain" 
                    />
                  )}
                  <Building className="w-5 h-5 mr-2 text-primary flex-shrink-0" />
                  <span>{job.companyName}</span>
                </div>
              </div>
              <div className="mt-4 sm:mt-0 flex-shrink-0">
                <Button 
                    size="lg" 
                    className="w-full sm:w-auto" 
                    onClick={handleApplyNow}
                    disabled={authInitialized && authLoading}
                >
                  {(authInitialized && authLoading) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Apply Now
                </Button>
              </div>
            </div>
            <div className="mt-6 flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground">
                <span className="flex items-center"><MapPin className="w-4 h-4 mr-1.5 text-primary"/> {job.location}</span>
                <span className="flex items-center"><Briefcase className="w-4 h-4 mr-1.5 text-primary"/> {job.jobType?.replace(/_/g, ' ') || 'Not specified'}</span>
                {job.isRemote && <span className="flex items-center text-green-600 font-medium"><Zap className="w-4 h-4 mr-1.5"/> Remote</span>}
                <span className="flex items-center"><Clock className="w-4 h-4 mr-1.5 text-primary"/> Posted: {job.postedDate}</span>
            </div>
            {(job.salaryMin || job.salaryMax) && (
                <div className="mt-4 flex items-center text-lg font-semibold text-primary">
                    <DollarSign className="w-5 h-5 mr-2"/>
                    {formatSalaryDetail(job.salaryMin, job.salaryMax, job.salaryCurrency)}
                </div>
            )}
          </header>

          <section className="prose prose-slate dark:prose-invert max-w-none">
            <h2 className="text-xl font-semibold mb-3 text-foreground">Job Description</h2>
            <div className="whitespace-pre-wrap">{job.description}</div>
            {job.requirements && (
              <>
                <h2 className="text-xl font-semibold mt-6 mb-3 text-foreground">Requirements</h2>
                <div className="whitespace-pre-wrap">{job.requirements}</div>
              </>
            )}
          </section>

          {(job.applicationEmail || job.applicationUrl) && (
            <section className="mt-8 pt-6 border-t">
              <h2 className="text-xl font-semibold mb-4 text-foreground">How to Apply</h2>
                {job.applicationEmail && (
                <p className="mb-3 flex items-center">
                    <Mail className="w-5 h-5 mr-2 text-primary"/> 
                    Please send your resume and cover letter to: {' '}
                    <a href={`mailto:${job.applicationEmail}`} className="font-medium text-primary hover:underline ml-1">
                    {job.applicationEmail}
                    </a>
                </p>
                )}
                {job.applicationUrl && (
                <div className="mt-4">
                    <Button asChild>
                    <Link href={job.applicationUrl} target="_blank" rel="noopener noreferrer">
                        Apply via External Link <ExternalLink className="w-4 h-4 ml-2"/>
                    </Link>
                    </Button>
                </div>
                )}
            </section>
          )}
          {!job.applicationEmail && !job.applicationUrl && (
            <section className="mt-8 pt-6 border-t">
                <p className="text-muted-foreground">Application instructions not specified for this job.</p>
            </section>
        )}
        </article>
      </div>

      <ApplicationModal
        isOpen={isApplicationModalOpen}
        onOpenChange={setIsApplicationModalOpen}
        jobId={job.id}
        jobTitle={job.title}
      />
    </>
  );
}