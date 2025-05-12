// src/app/api/employer/jobs/route.ts
import { NextResponse, type NextRequest } from 'next/server';
import { PrismaClient, JobStatus, UserRole } from '@prisma/client';
import { getSession } from '@/lib/auth';

const prisma = new PrismaClient();

// Expected request body matches PostJobForm's JobFormData
interface CreateJobRequestBody {
  userId: string; 
  title: string;
  companyName: string; 
  location: string;
  jobType: string; 
  salaryMin?: string; 
  salaryMax?: string;
  salaryCurrency?: string; 
  description: string;
  requirements?: string; 
  applicationEmail: string; 
  isRemote: boolean; // This will map to 'remote' in Prisma
}

export async function POST(request: NextRequest) {
  const session = await getSession();

  if (!session?.user || session.user.role !== UserRole.EMPLOYER) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  const employerUserId = session.user.userId;

  try {
    const body = await request.json() as CreateJobRequestBody;

    // Simplified required fields check, assuming client-side handles some
    if (!body.title || !body.companyName || !body.description || !body.applicationEmail || !body.location || !body.jobType) {
        return NextResponse.json({ message: 'Missing required fields: title, companyName, description, applicationEmail, location, or jobType' }, { status: 400 });
    }
    if (typeof body.isRemote !== 'boolean') {
        return NextResponse.json({ message: 'Missing or invalid required field: isRemote' }, { status: 400 });
    }

    // Convert salary strings to floats for Prisma, if they exist and are valid numbers
    const salaryMinFloat = body.salaryMin && !isNaN(parseFloat(body.salaryMin)) ? parseFloat(body.salaryMin) : null;
    const salaryMaxFloat = body.salaryMax && !isNaN(parseFloat(body.salaryMax)) ? parseFloat(body.salaryMax) : null;

    // Ensure salaryMin is not greater than salaryMax if both are provided
    if (salaryMinFloat !== null && salaryMaxFloat !== null && salaryMinFloat > salaryMaxFloat) {
        return NextResponse.json({ message: 'Minimum salary cannot be greater than maximum salary.' }, { status: 400 });
    }


    const newJob = await prisma.job.create({
      data: {
        title: body.title,
        companyName: body.companyName,        // Assuming 'companyName' field exists in Prisma Job model
        location: body.location || null,       // Prisma 'String?' can take null
        jobType: body.jobType,                 // Assuming 'jobType' field exists
        remote: body.isRemote,                 // Map 'isRemote' from form to 'remote' in Prisma
        salaryMin: salaryMinFloat,             // Store as Float or null
        salaryMax: salaryMaxFloat,             // Store as Float or null
        salaryCurrency: (salaryMinFloat !== null || salaryMaxFloat !== null) ? (body.salaryCurrency || 'USD') : null, // Store currency if salary provided
        description: body.description,
        requirements: body.requirements || null, // Store as Text or null
        applicationEmail: body.applicationEmail, // Assuming 'applicationEmail' field exists
        status: JobStatus.PENDING,
        employer: { 
          connect: { id: employerUserId }
        },
      },
    });

    return NextResponse.json({ message: 'Job posted successfully and is pending review.', job: newJob }, { status: 201 });

  } catch (error: unknown) {
    console.error('Failed to create job:', error);
    let errorMessage = 'An unexpected error occurred during job creation.';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    // More detailed error logging for Prisma client errors
    // if (error instanceof Prisma.PrismaClientKnownRequestError) {
    //   errorMessage = `Prisma Error (${error.code}): ${error.message}`;
    // }
    return NextResponse.json({ message: 'Failed to create job.', error: errorMessage }, { status: 500 });
  }
}