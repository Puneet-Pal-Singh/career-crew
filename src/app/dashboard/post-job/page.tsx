// src/app/dashboard/post-job/page.tsx
import PostJobForm from '@/components/dashboard/employer/PostJobForm';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Post a New Job - CareerCrew',
  description: 'Create and publish a new job listing on CareerCrew Consulting.',
};

export default function PostJobPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      {/* 
        You might want a wrapper or a more specific layout for dashboard pages here.
        For now, just rendering the form directly.
      */}
      <PostJobForm />
    </div>
  );
}