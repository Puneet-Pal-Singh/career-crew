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
    <div className="space-y-6">
      <h2 className="text-2xl font-bold tracking-tight">About this role</h2>
      <article className="prose dark:prose-invert max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-li:text-muted-foreground prose-strong:text-foreground">
        <ReactMarkdown>{fullMarkdown}</ReactMarkdown>
      </article>
      
      <div className="pt-8 border-t mt-8">
        <h3 className="text-lg font-semibold mb-4">Interested in this job?</h3>
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