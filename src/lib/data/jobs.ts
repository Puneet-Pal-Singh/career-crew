// // src/lib/data/jobs.ts
// import type { JobCardData } from '@/types';

// export async function getRecentJobsData(): Promise<JobCardData[]> {
//   try {
//     // Ensure NEXT_PUBLIC_APP_URL is set, especially for server-side fetching if it's an internal API route
//     const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
//     const res = await fetch(`${appUrl}/api/jobs/recent`, {
//       // cache: 'no-store', // Or appropriate caching strategy
//       next: { revalidate: 300 }, // Revalidate every 5 minutes
//     });
//     if (!res.ok) {
//       console.error("Failed to fetch recent jobs:", res.status, await res.text());
//       return [];
//     }
//     return res.json();
//   } catch (error) {
//     console.error("Error in getRecentJobsData:", error);
//     return [];
//   }
// }


// src/lib/data/jobs.ts
import prisma from '@/lib/prisma'; // Your Prisma client instance
import type { JobCardData } from '@/types';
import type { Job as PrismaJob, User as PrismaUser } from '@prisma/client'; // Import Prisma's Job and User types

// Define a type for the job with its employer relation included for type safety
type PrismaJobWithEmployer = PrismaJob & {
  employer: Pick<PrismaUser, 'name'> | null; // Or other fields from employer like companyName if it's there
                                             // Assuming companyName is now directly on the Job model
};

// Helper function to map a Prisma Job object (with potential relations) to JobCardData
function mapPrismaJobToJobCardData(job: PrismaJobWithEmployer): JobCardData {
    let salaryDisplay: string | undefined = undefined;
    if (job.salaryMin !== null && job.salaryMax !== null && job.salaryCurrency) {
        salaryDisplay = `${job.salaryCurrency.toUpperCase()} ${job.salaryMin.toLocaleString()} - ${job.salaryMax.toLocaleString()}`;
    } else if (job.salaryMin !== null && job.salaryCurrency) {
        salaryDisplay = `${job.salaryCurrency.toUpperCase()} ${job.salaryMin.toLocaleString()}+`;
    }

    // Improved date formatting
    const postedDate = new Date(job.createdAt);
    const now = new Date();
    const diffTime = now.getTime() - postedDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffTime / (1000 * 60));

    let postedDateString: string;
    if (diffDays > 7) {
        postedDateString = postedDate.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
    } else if (diffDays > 0) {
        postedDateString = `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    } else if (diffHours > 0) {
        postedDateString = `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    } else if (diffMinutes > 0) {
        postedDateString = `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
    } else {
        postedDateString = "Just now";
    }
    
    return {
        id: job.id,
        title: job.title,
        companyName: job.companyName, // Assumes companyName is directly on the Job model
        // companyLogoUrl: job.employer?.companyLogoUrl || '/company-logos/default-company-logo.svg', // If logo is on User model via employer relation
        companyLogoUrl: '/company-logos/default-company-logo.svg', // Placeholder until company profiles/logos are on Job or User
        location: job.location || "Not Specified",
        isRemote: job.remote, // Prisma model has 'remote', JobCardData uses 'isRemote'
        salary: salaryDisplay || undefined, // Use the formatted salary string, ensure it can be undefined
        postedDate: postedDateString,
        type: job.jobType || undefined, // Assumes jobType is on the Job model
        tags: [], // Populate if/when you have a tags relation on your Job model
    };
}


export async function getRecentJobsDataDirectly(): Promise<JobCardData[]> {
  try {
    // Fetch jobs that are APPROVED, order by most recent, take top 6
    // Include companyName directly if it's on the Job model.
    // If companyName were on an 'employer' (User) relation, you'd include it.
    const recentPrismaJobs = await prisma.job.findMany({
      where: {
        status: 'APPROVED', 
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 6,
      // No include needed if all fields for JobCardData are directly on the Job model
      // If companyName or logo were on the related employer (User model):
      // include: {
      //   employer: {
      //     select: {
      //       name: true, // if you use employer.name as companyName
      //       // companyLogoUrl: true, // if User model has this
      //     }
      //   }
      // }
    });

    // Use the helper function to map the results
    return recentPrismaJobs.map(job => mapPrismaJobToJobCardData(job as PrismaJobWithEmployer));

  } catch (error: unknown) {
    console.error("Error fetching recent jobs directly from DB:", error);
    if (error instanceof Error) {
        // Log more specific Prisma errors if possible
        // console.error("Prisma Error Details:", (error as any).code, (error as any).meta);
    }
    return [];
  }
}