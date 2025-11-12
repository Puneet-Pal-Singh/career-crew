// src/components/dashboard/employer/application-details/ApplicationDetailView.tsx
import React from 'react';
import type { ApplicationDetails } from '@/app/actions/employer/applications/getApplicationDetailsAction';
import type { ApplicationStatusOption } from '@/types';
import { ExternalLink } from 'lucide-react';
import { StatusChangeDropdown } from './StatusChangeDropdown';

// Reusable component for displaying a row of details.
const DetailRow = ({ label, value }: { label: string, value: React.ReactNode }) => (
  <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-4 gap-y-1 py-3 border-b last:border-b-0">
    <dt className="text-sm font-medium text-muted-foreground">{label}</dt>
    <dd className="col-span-1 sm:col-span-2 text-sm text-foreground break-words">{value || 'N/A'}</dd>
  </div>
);

interface ApplicationDetailViewProps {
  details: ApplicationDetails;
  isPending: boolean;
  onStatusChange: (newStatus: ApplicationStatusOption) => void;
  onViewResume: () => void;
}

export const ApplicationDetailView = ({ details, isPending, onStatusChange, onViewResume }: ApplicationDetailViewProps) => {
  return (
    <div className="p-4">
      <dl>
        <DetailRow label="Applicant Name" value={details.applicantName} />
        <DetailRow label="Applicant Email" value={details.applicantEmail} />
        <DetailRow label="Applying For" value={details.jobTitle} />
        <DetailRow label="Date Applied" value={details.appliedAt} />
        <DetailRow 
          label="Status" 
          value={
            <StatusChangeDropdown 
              currentStatus={details.status}
              isPending={isPending}
              onStatusChange={onStatusChange}
            />
          } 
        />
        <DetailRow 
          label="Cover Letter" 
          value={details.coverLetterSnippet ? <p className="italic text-muted-foreground">&quot;{details.coverLetterSnippet}&quot;</p> : "N/A"} 
        />
        <DetailRow 
          label="Resume" 
          value={
            details.resumeUrl ? (
              // 2. Attach the new callback to the onClick handler
              <a 
                href={details.resumeUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center gap-2 text-primary hover:underline font-medium"
                onClick={onViewResume}
              >
                View Resume <ExternalLink className="h-4 w-4" />
              </a>
            ) : "No resume submitted"
          } 
        />
      </dl>
    </div>
  );
};