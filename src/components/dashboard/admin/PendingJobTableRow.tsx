// src/components/dashboard/admin/PendingJobTableRow.tsx
"use client";

import Link from 'next/link';
import type { AdminPendingJobData } from '@/types';
import { generateJobSlug } from '@/lib/utils';
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Loader2, Eye } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { formatStatusText, getStatusBadgeVariant } from '@/components/dashboard/admin/utils'; // We'll create this utils file next

interface PendingJobTableRowProps {
  job: AdminPendingJobData;
  isProcessing: boolean;
  onApprove: (job: AdminPendingJobData) => void;
  onReject: (job: AdminPendingJobData) => void;
  onCompanyClick: (employerId: string) => void;
}

export default function PendingJobTableRow({ job, isProcessing, onApprove, onReject, onCompanyClick }: PendingJobTableRowProps) {
  const jobSlug = generateJobSlug(job.id, job.title);

  return (
    <TableRow className="hover:bg-muted/50">
      <TableCell className="font-medium">
        <Link
          href={`/jobs/${jobSlug}`}
          className="hover:underline text-primary"
          target="_blank"
          rel="noopener noreferrer"
          title="Preview job post (opens in new tab)"
        >
          {job.title}
        </Link>
      </TableCell>
      <TableCell>
        <Badge variant={getStatusBadgeVariant(job.status)}>
          {formatStatusText(job.status)}
        </Badge>
      </TableCell>
      <TableCell>
        {/* THE FIX: Company name is now a button to trigger the modal */}
        <Button 
          variant="link" 
          onClick={() => onCompanyClick(job.employerId)} 
          className="p-0 h-auto font-normal"
        >
          {job.companyName}
        </Button>
      </TableCell>
      <TableCell>{job.createdAt}</TableCell>
      <TableCell className="text-right space-x-1">
        <Button asChild variant="outline" size="icon" title="Preview Job" className="h-8 w-8">
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
              title="Approve Job"
            >
              <CheckCircle className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => onReject(job)}
              className="h-8 w-8 text-red-600 border-red-200 hover:bg-red-50"
              title="Reject Job"
            >
              <XCircle className="h-4 w-4" />
            </Button>
          </>
        )}
      </TableCell>
    </TableRow>
  );
}