// // src/app/jobs/[jobId]/page.tsx
// "use client"; // This page now needs to be client component to manage modal state

// import React, { useState, useEffect } from 'react'; // Added useState, useEffect
// import { getJobDetailsById } from '@/app/actions/jobDetailActions';
// import type { JobDetailData } from '@/types';
// // import { notFound } from 'next/navigation'; // notFound can't be used in client components directly
// import { Button } from '@/components/ui/button';
// import Image from 'next/image';
// import { MapPin, Briefcase, Building, Clock, DollarSign, Zap, AlertTriangle, Loader2 } from 'lucide-react'; // Added Loader2
// import Link from 'next/link';
// import ApplicationModal from '@/components/jobs/ApplicationModal'; // Import the modal
// import { useAuth } from '@/contexts/AuthContext'; // To check if user is logged in

// // Since this is now a client component, we fetch data in useEffect or use a hook like SWR/React Query
// // For simplicity, we'll fetch in useEffect. Metadata needs to be handled differently for client components.

// interface JobDetailPageClientProps {
//   params: { jobId: string };
// }

// // Helper to format salary display (can be moved to utils)
// const formatSalaryDetail = (min?: number | null, max?: number | null, currency?: string | null): string => {
//   const curr = currency || '$';
//   if (min && max) return `${curr}${min} - ${curr}${max} per year`;
//   if (min) return `Starting from ${curr}${min} per year`;
//   if (max) return `Up to ${curr}${max} per year`;
//   return "Competitive";
// };

// export default function JobDetailPageClient({ params }: JobDetailPageClientProps) {
//   const { jobId } = params;
//   const [job, setJob] = useState<JobDetailData | null>(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false);

//   const { user, isLoading: authLoading, isInitialized: authInitialized } = useAuth();
//   const router = useRouter(); // If you need to redirect for login

//   useEffect(() => {
//     if (jobId) {
//       setIsLoading(true);
//       setError(null);
//       getJobDetailsById(jobId)
//         .then(data => {
//           if (data) {
//             setJob(data);
//             // Update document title
//             document.title = `${data.title} at ${data.companyName} - CareerCrew`;
//           } else {
//             setError("Job not found or not available.");
//             document.title = 'Job Not Found - CareerCrew';
//           }
//         })
//         .catch(err => {
//           console.error("Failed to fetch job details:", err);
//           setError("Failed to load job details. Please try again.");
//           document.title = 'Error - CareerCrew';
//         })
//         .finally(() => setIsLoading(false));
//     }
//   }, [jobId]);

//   const handleApplyNow = () => {
//     if (!user && authInitialized && !authLoading) { // If auth is initialized, not loading, and no user
//       // Redirect to login, preserving the current job page to return to
//       const currentPath = window.location.pathname;
//       router.push(`/login?redirectedFrom=${encodeURIComponent(currentPath)}`);
//     } else if (user) {
//       setIsApplicationModalOpen(true);
//     }
//     // If auth is still loading, the button might be disabled or show a loader
//   };

//   if (isLoading || (authInitialized && authLoading && !user)) { // Show loading if job data or auth state is loading
//     return (
//       <div className="container mx-auto py-10 px-4 max-w-4xl text-center">
//         <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
//         <p className="mt-4 text-muted-foreground">Loading job details...</p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="container mx-auto py-10 px-4 max-w-4xl text-center">
//         <AlertTriangle className="h-12 w-12 mx-auto text-destructive mb-4" />
//         <h1 className="text-2xl font-bold text-destructive">Error</h1>
//         <p className="text-muted-foreground mt-2">{error}</p>
//         <Button variant="outline" asChild className="mt-6">
//             <Link href="/jobs">Back to Job Listings</Link>
//         </Button>
//       </div>
//     );
//   }

//   if (!job) { // Should be covered by error state if setError("Job not found") is called
//     return (
//       <div className="container mx-auto py-10 px-4 max-w-4xl text-center">
//         <Briefcase className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
//         <h1 className="text-2xl font-bold text-foreground">Job Not Found</h1>
//         <p className="text-muted-foreground mt-2">The job listing you are looking for could not be found or is no longer available.</p>
//         <Button variant="outline" asChild className="mt-6">
//             <Link href="/jobs">Back to Job Listings</Link>
//         </Button>
//       </div>
//     );
//   }

//   return (
//     <>
//       <div className="container mx-auto py-10 px-4 max-w-4xl">
//         <article className="bg-card p-6 sm:p-8 rounded-xl shadow-lg">
//           <header className="mb-8 border-b pb-6">
//             <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
//               <div>
//                 <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
//                   {job.title}
//                 </h1>
//                 <div className="mt-2 flex items-center text-lg text-muted-foreground">
//                   {job.companyLogoUrl && job.companyLogoUrl !== '/company-logos/default-company-logo.svg' && ( // Avoid showing default if no real logo
//                     <Image 
//                       src={job.companyLogoUrl} 
//                       alt={`${job.companyName} logo`} 
//                       width={32}
//                       height={32}
//                       className="mr-3 rounded-md object-contain" 
//                     />
//                   )}
//                   <Building className="w-5 h-5 mr-2 text-primary flex-shrink-0" />
//                   <span>{job.companyName}</span>
//                 </div>
//               </div>
//               <div className="mt-4 sm:mt-0 flex-shrink-0">
//                 <Button 
//                     size="lg" 
//                     className="w-full sm:w-auto" 
//                     onClick={handleApplyNow}
//                     disabled={authInitialized && authLoading} // Disable if auth is loading
//                 >
//                   {authInitialized && authLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
//                   Apply Now
//                 </Button>
//               </div>
//             </div>
//             {/* ... (rest of the header JSX: location, jobType, remote, postedDate, salary) ... */}
//              <div className="mt-6 flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground">
//                 <span className="flex items-center"><MapPin className="w-4 h-4 mr-1.5 text-primary"/> {job.location}</span>
//                 <span className="flex items-center"><Briefcase className="w-4 h-4 mr-1.5 text-primary"/> {job.jobType?.replace('_', ' ') || 'Not specified'}</span>
//                 {job.isRemote && <span className="flex items-center text-green-600 font-medium"><Zap className="w-4 h-4 mr-1.5"/> Remote</span>}
//                 <span className="flex items-center"><Clock className="w-4 h-4 mr-1.5 text-primary"/> Posted: {job.postedDate}</span>
//             </div>
//             {(job.salaryMin || job.salaryMax) && (
//                 <div className="mt-4 flex items-center text-lg font-semibold text-primary">
//                     <DollarSign className="w-5 h-5 mr-2"/>
//                     {formatSalaryDetail(job.salaryMin, job.salaryMax, job.salaryCurrency)}
//                 </div>
//             )}
//           </header>

//           <section className="prose prose-slate dark:prose-invert max-w-none">
//             <h2 className="text-xl font-semibold mb-3 text-foreground">Job Description</h2>
//             <div className="whitespace-pre-wrap">{job.description}</div>
//             {job.requirements && (
//               <>
//                 <h2 className="text-xl font-semibold mt-6 mb-3 text-foreground">Requirements</h2>
//                 <div className="whitespace-pre-wrap">{job.requirements}</div>
//               </>
//             )}
//           </section>

//           {(job.applicationEmail || job.applicationUrl) && (
//             <section className="mt-8 pt-6 border-t">
//               {/* ... (application instructions JSX) ... */}
//             </section>
//           )}
//           {/* ... (fallback if no application instructions) ... */}
//         </article>
//       </div>

//       {/* Application Modal */}
//       {job && ( // Only render modal if job data is available
//           <ApplicationModal
//             isOpen={isApplicationModalOpen}
//             onOpenChange={setIsApplicationModalOpen}
//             jobId={job.id}
//             jobTitle={job.title}
//           />
//       )}
//     </>
//   );
// }
// // Need to import useRouter
// import { useRouter } from 'next/navigation'; 

// src/app/jobs/[jobId]/page.tsx
import { getJobDetailsById } from '@/app/actions/jobDetailActions';
import type { JobDetailData } from '@/types';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import JobDetailView from '@/components/jobs/JobDetailView'; // Your Client Component for UI

// Define props for the Page Server Component, acknowledging params is a Promise
interface AsyncPageProps {
  params: Promise<{ jobId: string }>; // params is now a Promise
  // searchParams?: Promise<{ [key: string]: string | string[] | undefined }>; // If using searchParams
}

// generateMetadata: params object here also needs to be awaited
export async function generateMetadata(
  { params: paramsPromise }: AsyncPageProps, // Destructure and rename for clarity
//   _parent: ResolvingMetadata // Prefix if not used
): Promise<Metadata> {
  const params = await paramsPromise; // Await the params promise
  const jobId = params.jobId; 
  const job = await getJobDetailsById(jobId);

  if (!job) {
    return {
      title: 'Job Not Found - CareerCrew',
    };
  }
  return {
    title: `${job.title} at ${job.companyName} - CareerCrew`,
    description: job.description.substring(0, 160),
  };
}

// This is the main Page Server Component
export default async function JobDetailPage({ params: paramsPromise }: AsyncPageProps) { // Destructure and rename
  const params = await paramsPromise; // Await the params promise
  const jobId = params.jobId; 
  
  const job: JobDetailData | null = await getJobDetailsById(jobId);

  if (!job) {
    notFound(); 
  }

  // Pass the resolved job data to the Client Component
  return <JobDetailView job={job} />;
}