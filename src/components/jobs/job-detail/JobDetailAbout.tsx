// src/components/jobs/job-detail/JobDetailAbout.tsx
"use client";

import ReactMarkdown from 'react-markdown';
import { Button } from '@/components/ui/button';

interface JobDetailAboutProps {
  description: string;
  requirements?: string | null;
  onApplyNow: () => void;
}

export default function JobDetailAbout({ description, requirements, onApplyNow }: JobDetailAboutProps) {
  const fullMarkdown = `${description}\n\n${requirements ? `## Requirements\n\n${requirements}` : ''}`;

  return (
    <div className="mt-10">
      <h2 className="text-2xl font-bold tracking-tight mb-4">About the job</h2>
      <div className="bg-card p-6 rounded-lg border">
        <article className="prose dark:prose-invert max-w-none">
          <ReactMarkdown>{fullMarkdown}</ReactMarkdown>
        </article>
      </div>
      <div className="mt-8 text-center">
          <Button size="lg" onClick={onApplyNow}>Apply Now</Button>
      </div>
    </div>
  );
}