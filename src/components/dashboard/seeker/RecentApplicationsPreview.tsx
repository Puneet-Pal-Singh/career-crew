// src/components/dashboard/seeker/RecentApplicationsPreview.tsx
"use client"; // <-- This component now needs to be a client component for animations

import type { RecentApplication, ApplicationStatusOption } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from "@/components/ui/badge";
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion'; // <-- Import motion
// This is a utility function to generate job slugs
import { generateJobSlug } from '@/lib/utils';

interface RecentApplicationsPreviewProps {
  applications: RecentApplication[];
}

// Copied from MyApplicationsTable - we can centralize these helpers later if needed
// Function to get the badge variant based on application status
type BadgeVariant = "default" | "destructive" | "outline" | "secondary" | null | undefined;

// Animation variants for the list container
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1, // This will make each child animate 0.1s after the previous one
    },
  },
};

// Animation variants for each list item
const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5
    }
  },
};

// Function to get the badge variant based on application status
const getApplicationStatusBadgeVariant = (status: ApplicationStatusOption): BadgeVariant => {
  switch (status) {
    case 'SUBMITTED': return 'secondary';
    case 'VIEWED': return 'secondary';
    case 'INTERVIEWING': return 'outline';
    case 'OFFERED': return 'default';
    case 'HIRED': return 'default';
    case 'REJECTED': return 'destructive';
    default: return 'default';
  }
};

const formatApplicationStatusText = (status: ApplicationStatusOption): string => {
    return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
};

export default function RecentApplicationsPreview({ applications }: RecentApplicationsPreviewProps) {
  if (!applications || applications.length === 0) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>My Applications</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-center text-muted-foreground py-8">
                    You haven&apos;t applied to any jobs yet.
                </p>
            </CardContent>
             <CardFooter>
                <Button asChild className="w-full">
                    <Link href="/jobs">Find Your Next Job</Link>
                </Button>
            </CardFooter>
        </Card>
    )
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Applications</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <motion.ul 
          className="divide-y"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {applications.map((app) => (
            <motion.li 
              key={app.applicationId} 
              className="px-6 py-4 flex justify-between items-center"
              variants={itemVariants}
              whileHover={{ backgroundColor: 'hsl(var(--muted))', scale: 1.01 }} // Added hover effect
            >
              <div>
                <Link href={`/jobs/${generateJobSlug(app.jobId, app.jobTitle)}`} className="font-semibold text-primary hover:underline">
                    {app.jobTitle}
                </Link>
                <p className="text-sm text-muted-foreground">{app.companyName}</p>
              </div>
              <Badge variant={getApplicationStatusBadgeVariant(app.applicationStatus)}>
                {formatApplicationStatusText(app.applicationStatus)}
              </Badge>
            </motion.li>
          ))}
        </motion.ul>
      </CardContent>
      <CardFooter className="py-4">
        <Button variant="outline" className="w-full" asChild>
          <Link href="/dashboard/seeker/applications">
            View All Applications <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}