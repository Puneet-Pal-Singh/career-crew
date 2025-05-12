// src/app/dashboard/(employer)/post-job/page.tsx
import PostJobForm from '../_components/PostJobForm'; // Form component we'll create next
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { UserRole } from '@prisma/client';

export default async function PostJobPage() {
  const session = await getSession();

  // Protect the route: only employers can access
  if (!session?.user || session.user.role !== UserRole.EMPLOYER) {
    // Redirect to main dashboard or login if not an employer
    // Or show an unauthorized message if preferred
    redirect(session?.user ? '/dashboard' : '/login?callbackUrl=/dashboard/post-job');
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold font-display text-content-light dark:text-content-dark mb-2">
          Post a New Job
        </h1>
        <p className="text-subtle-light dark:text-subtle-dark">
          Fill out the details below to create a new job listing. It will be submitted for review.
        </p>
      </div>
      <PostJobForm userId={session.user.userId} />
    </div>
  );
}