// src/app/dashboard/(employer)/_components/EmployerDashboardView.tsx
import Link from 'next/link';
import { FilePlus, Briefcase } from 'lucide-react'; // <<<<<<<<<<< IMPORTED Users ICON

// StatCard component (can be kept here or moved to a shared dashboard components folder)
interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType; // LucideIcon type can be used here too: import type { LucideIcon } from 'lucide-react';
  link?: string;
  linkText?: string;
}

function StatCard({ title, value, icon: Icon, link, linkText }: StatCardProps) {
  const content = (
    <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out transform hover:-translate-y-1">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-subtle-light dark:text-subtle-dark uppercase tracking-wider">{title}</h3>
        <Icon className="w-6 h-6 text-primary dark:text-primary-dark opacity-80" />
      </div>
      <p className="text-3xl xl:text-4xl font-bold font-display text-content-light dark:text-content-dark">{value}</p>
      {link && linkText && (
        <p className="text-xs text-primary dark:text-primary-dark hover:underline mt-3 block">
          {linkText} →
        </p>
      )}
    </div>
  );
  return link ? <Link href={link} className="block">{content}</Link> : <div className="block">{content}</div>;
}


// Mock job data type for this component's internal use if not fetching typed data yet
interface MockEmployerJob {
  id: string;
  title: string;
  status: 'Approved' | 'Pending' | 'Expired' | 'Rejected'; // Example statuses
  applications: number;
  views: number;
}

export default async function EmployerDashboardView() {
  // MOCK DATA FOR NOW - Replace with actual data fetching
  const jobs: MockEmployerJob[] = [
    { id: 'job1', title: 'Software Engineer (Frontend)', status: 'Approved', applications: 5, views: 120 },
    { id: 'job2', title: 'Senior Product Manager', status: 'Pending', applications: 0, views: 30 },
    { id: 'job3', title: 'Lead UX Designer (Remote)', status: 'Expired', applications: 12, views: 250 },
    { id: 'job4', title: 'DevOps Engineer', status: 'Approved', applications: 2, views: 90 },
  ];
  const totalJobs = jobs.length;
  const activeJobs = jobs.filter(job => job.status === 'Approved').length;
  const pendingJobs = jobs.filter(job => job.status === 'Pending').length;


  return (
    <div className="space-y-8 lg:space-y-10">
      <div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-display text-content-light dark:text-content-dark mb-1 sm:mb-2">
          Employer Dashboard
        </h1>
        <p className="text-base text-subtle-light dark:text-subtle-dark">
          Manage your job postings, view applications, and find your next great hire.
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6">
        <StatCard title="Total Jobs Posted" value={totalJobs} icon={Briefcase} link="/dashboard/my-jobs" linkText="View all jobs" />
        <StatCard title="Active Listings" value={activeJobs} icon={Briefcase} />
        <StatCard title="Pending Approval" value={pendingJobs} icon={FilePlus} /> 
        {/* Changed Applications to Pending for more direct employer actions */}
      </div>
      
      <div className="flex justify-end">
        <Link 
            href="/dashboard/post-job"
            className="inline-flex items-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 bg-primary dark:bg-primary-dark text-white dark:text-gray-900 font-semibold rounded-lg shadow-md hover:opacity-90 transition-opacity transform hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
            <FilePlus size={18} /> Post a New Job
        </Link>
      </div>

      <div>
        <h2 className="text-xl lg:text-2xl font-semibold text-content-light dark:text-content-dark mb-4">
          Recent Activity
        </h2>
        <div className="bg-surface-light dark:bg-surface-dark p-4 sm:p-6 rounded-xl shadow-lg">
          {jobs.length > 0 ? (
            <ul className="space-y-4">
              {jobs.slice(0, 3).map(job => ( // Show top 3 recent or most active jobs
                <li key={job.id} className="flex flex-col sm:flex-row justify-between sm:items-center p-3 sm:p-4 border border-border-light dark:border-border-dark rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                  <div className="mb-2 sm:mb-0">
                    <p className="font-medium text-base text-content-light dark:text-content-dark">{job.title}</p>
                    <span className={`text-xs px-2 py-0.5 inline-block rounded-full font-medium
                      ${job.status === 'Approved' ? 'bg-success/10 text-success-darker dark:bg-success-dark/20 dark:text-success-lighter' : 
                        job.status === 'Pending' ? 'bg-warning/10 text-warning-darker dark:bg-warning-dark/20 dark:text-warning-lighter' :
                        'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'}`}>
                      {job.status}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3 text-xs">
                      <span className="text-subtle-light dark:text-subtle-dark">Apps: {job.applications}</span>
                      <span className="text-subtle-light dark:text-subtle-dark">Views: {job.views}</span>
                      <Link href={`/dashboard/my-jobs/${job.id}`} className="text-primary dark:text-primary-dark hover:underline font-medium">Manage</Link>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-subtle-light dark:text-subtle-dark text-center py-6">You haven&apos;t posted any jobs yet.</p>
          )}
        </div>
        {jobs.length > 3 && (
             <div className="mt-6 text-right">
                <Link href="/dashboard/my-jobs" className="text-sm text-primary dark:text-primary-dark hover:underline font-medium">
                    View All My Jobs →
                </Link>
            </div>
        )}
      </div>
    </div>
  );
}