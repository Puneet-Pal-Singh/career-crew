// src/components/dashboard/admin/PendingJobCard.tsx
"use client";

import Link from 'next/link';
import type { AdminPendingJobData } from '@/types';
import { generateJobSlug } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Loader2, Eye } from 'lucide-react';
import { formatStatusText, getStatusBadgeVariant } from './utils';

interface PendingJobCardProps {
  job: AdminPendingJobData;
  isProcessing: boolean;
  onApprove: (job: AdminPendingJobData) => void;
  onReject: (job: AdminPendingJobData) => void;
  onCompanyClick: (employerId: string) => void;
}

export default function PendingJobCard({ job, isProcessing, onApprove, onReject, onCompanyClick }: PendingJobCardProps) {
  const jobSlug = generateJobSlug(job.id, job.title);

  return (
    <div className="border rounded-lg p-4 bg-card">
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-2">
          <Link
            href={`/jobs/${jobSlug}`}
            className="font-semibold text-base hover:underline text-primary flex-1"
            target="_blank"
            rel="noopener noreferrer"
            title="Preview job post"
          >
            {job.title}
          </Link>
          <Badge variant={getStatusBadgeVariant(job.status)} className="text-xs">
            {formatStatusText(job.status)}
          </Badge>
        </div>

        <div className="text-sm text-muted-foreground">
          {/* THE FIX: Company name is now a button */}
          <p>
            <Button 
              variant="link" 
              onClick={() => onCompanyClick(job.employerId)} 
              className="p-0 h-auto text-muted-foreground font-normal"
            >
              {job.companyName}
            </Button>
          </p>
          <p>Submitted: {job.createdAt}</p>
        </div>

        <div className="flex items-center gap-1 pt-2">
          <Button asChild variant="outline" size="icon" className="h-8 w-8">
            <Link href={`/jobs/${jobSlug}`} target="_blank">
              <Eye className="h-4 w-4" />
            </Link>
          </Button>

          {isProcessing ? (
            <Button variant="outline" size="icon" disabled className="h-8 w-8">
              <Loader2 className="h-4 w-4 animate-spin" />
            </Button>
          ) : (
            <>
              <Button
                variant="outline"
                size="icon"
                onClick={() => onApprove(job)}
                className="h-8 w-8 text-green-600 border-green-200 hover:bg-green-50"
              >
                <CheckCircle className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => onReject(job)}
                className="h-8 w-8 text-red-600 border-red-200 hover:bg-red-50"
              >
                <XCircle className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}