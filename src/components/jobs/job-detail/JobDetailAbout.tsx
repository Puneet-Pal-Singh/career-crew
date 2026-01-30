// src/components/jobs/job-detail/JobDetailAbout.tsx
"use client";

import ReactMarkdown from 'react-markdown';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';

interface JobDetailAboutProps {
  description: string;
  requirements?: string | null;
  applicationUrl?: string | null;
  onApplyNow: () => void;
}

export default function JobDetailAbout({ description, requirements, applicationUrl, onApplyNow }: JobDetailAboutProps) {
  const fullMarkdown = `${description}\n\n${requirements ? `## Requirements\n\n${requirements}` : ''}`;

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold tracking-tight mb-6">About this role</h2>
      <div className="bg-card p-8 rounded-xl border shadow-sm">
        <article className="prose dark:prose-invert max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-strong:text-foreground">
          <ReactMarkdown>{fullMarkdown}</ReactMarkdown>
        </article>
      </div>
      <div className="mt-8 text-center">
        <Button size="lg" onClick={onApplyNow} className="px-8">
          {applicationUrl ? (
            <>
              Apply on Company Site
              <ExternalLink className="ml-2 h-4 w-4" />
            </>
          ) : (
            "Apply for this position"
          )}
        </Button>
      </div>
    </div>
  );
}