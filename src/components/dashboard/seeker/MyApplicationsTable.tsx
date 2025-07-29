// // src/components/dashboard/seeker/MyApplicationsTable.tsx
// "use client";

// import type { ApplicationViewData, ApplicationStatusOption } from '@/types';
// import {
//   Table,
//   TableBody,
//   TableCaption,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Badge } from "@/components/ui/Badge";
// import Link from 'next/link';
// import { Button } from '@/components/ui/button';
// import { Eye } from 'lucide-react'; // Icons

// interface MyApplicationsTableProps {
//   applications: ApplicationViewData[];
// }

// // Define the type for your actual badge variants if different from shadcn defaults
// type BadgeVariant = "default" | "secondary" | "primary" | "success" | "warning" | "danger" | undefined;

// // Helper to get variant for application status badge
// const getApplicationStatusBadgeVariant = (status: ApplicationStatusOption): BadgeVariant => {
//   switch (status) {
//     case 'SUBMITTED':
//       return 'secondary'; // Or 'primary'
//     case 'VIEWED':
//       return 'secondary';
//     case 'INTERVIEWING':
//       return 'warning'; // Or another distinct color
//     case 'OFFERED':
//       return 'success';
//     case 'HIRED':
//       return 'success'; // Strong success
//     case 'REJECTED':
//       return 'danger';
//     default:
//       return 'default'; // Fallback
//   }
// };

// // Helper to format status text for display
// const formatApplicationStatusText = (status: ApplicationStatusOption): string => {
//     return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
// };

// export default function MyApplicationsTable({ applications }: MyApplicationsTableProps) {
//   // This component assumes the parent page (MyApplicationsPage) handles the case where `applications` might be empty.
//   // If applications is guaranteed to be non-empty here, the initial check in parent is sufficient.
//   if (!applications || applications.length === 0) {
//     // This should ideally not be reached if parent handles empty state, but as a fallback:
//     return <p className="text-center text-muted-foreground py-8">You have no job applications.</p>;
//   }

//   return (
//     <div className="border rounded-lg"> {/* Added border and rounded for table container */}
//       <Table>
//         <TableCaption>A list of your submitted job applications.</TableCaption>
//         <TableHeader>
//           <TableRow>
//             <TableHead className="w-[40%] min-w-[200px]">Job Title</TableHead>
//             <TableHead className="w-[30%] min-w-[150px]">Company</TableHead>
//             <TableHead className="min-w-[120px]">Date Applied</TableHead>
//             <TableHead className="min-w-[150px]">Status</TableHead>
//             <TableHead className="text-right min-w-[100px]">Actions</TableHead>
//           </TableRow>
//         </TableHeader>
//         <TableBody>
//           {applications.map((app) => (
//             <TableRow key={app.applicationId}>
//               <TableCell className="font-medium">
//                 <Link href={`/jobs/${app.jobId}`} className="hover:underline text-primary">
//                   {app.jobTitle}
//                 </Link>
//               </TableCell>
//               <TableCell>{app.companyName}</TableCell>
//               <TableCell>{app.dateApplied}</TableCell>
//               <TableCell>
//                 <Badge variant={getApplicationStatusBadgeVariant(app.applicationStatus)}>
//                   {formatApplicationStatusText(app.applicationStatus)}
//                 </Badge>
//               </TableCell>
//               <TableCell className="text-right">
//                 <Button variant="outline" size="icon" asChild title="View Original Job Posting">
//                   <Link href={`/jobs/${app.jobId}`} target="_blank">
//                     <Eye className="h-4 w-4" />
//                   </Link>
//                 </Button>
//                 {/* Future actions for an application could go here:
//                     - Withdraw Application (if status allows)
//                     - View Application Details (if more details were stored)
//                 */}
//               </TableCell>
//             </TableRow>
//           ))}
//         </TableBody>
//       </Table>
//     </div>
//   );
// }


// src/components/dashboard/seeker/MyApplicationsTable.tsx - gemini edit.
// "use client";

// import type { ApplicationViewData, ApplicationStatusOption } from '@/types';
// import {
//   Table,
//   TableBody,
//   TableCaption,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Badge } from "@/components/ui/Badge";
// import Link from 'next/link';
// import { Button } from '@/components/ui/button';
// import { Eye } from 'lucide-react';

// interface MyApplicationsTableProps {
//   applications: ApplicationViewData[];
// }

// type BadgeVariant = "default" | "secondary" | "primary" | "success" | "warning" | "danger" | undefined;

// const getApplicationStatusBadgeVariant = (status: ApplicationStatusOption): BadgeVariant => {
//   switch (status) {
//     case 'SUBMITTED': return 'secondary';
//     case 'VIEWED': return 'secondary';
//     case 'INTERVIEWING': return 'warning';
//     case 'OFFERED': return 'success';
//     case 'HIRED': return 'success';
//     case 'REJECTED': return 'danger';
//     default: return 'default';
//   }
// };

// const formatApplicationStatusText = (status: ApplicationStatusOption): string => {
//     return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
// };

// export default function MyApplicationsTable({ applications }: MyApplicationsTableProps) {
//   if (!applications || applications.length === 0) {
//     return <p className="text-center text-muted-foreground py-8">You have no job applications.</p>;
//   }

//   return (
//     // FIX: This wrapper div makes the table horizontally scrollable on small screens.
//     <div className="border rounded-lg w-full overflow-x-auto">
//       <Table>
//         <TableCaption>A list of your submitted job applications.</TableCaption>
//         <TableHeader>
//           <TableRow>
//             <TableHead className="min-w-[250px]">Job Title</TableHead>
//             <TableHead className="min-w-[150px]">Company</TableHead>
//             <TableHead className="min-w-[120px]">Date Applied</TableHead>
//             <TableHead className="min-w-[150px]">Status</TableHead>
//             <TableHead className="text-right min-w-[100px]">Actions</TableHead>
//           </TableRow>
//         </TableHeader>
//         <TableBody>
//           {applications.map((app) => (
//             <TableRow key={app.applicationId}>
//               <TableCell className="font-medium whitespace-nowrap">
//                 <Link href={`/jobs/${app.jobId}`} className="hover:underline text-primary">
//                   {app.jobTitle}
//                 </Link>
//               </TableCell>
//               <TableCell className="whitespace-nowrap">{app.companyName}</TableCell>
//               <TableCell className="whitespace-nowrap">{app.dateApplied}</TableCell>
//               <TableCell>
//                 <Badge variant={getApplicationStatusBadgeVariant(app.applicationStatus)}>
//                   {formatApplicationStatusText(app.applicationStatus)}
//                 </Badge>
//               </TableCell>
//               <TableCell className="text-right">
//                 <Button variant="outline" size="icon" asChild title="View Original Job Posting">
//                   <Link href={`/jobs/${app.jobId}`} target="_blank">
//                     <Eye className="h-4 w-4" />
//                   </Link>
//                 </Button>
//               </TableCell>
//             </TableRow>
//           ))}
//         </TableBody>
//       </Table>
//     </div>
//   );
// }


// claude edit.
// src/components/dashboard/seeker/MyApplicationsTable.tsx
"use client";

import type { ApplicationViewData, ApplicationStatusOption } from '@/types';
import {
  Table,
  TableBody,
  // TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent} from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { 
  Eye, 
  Calendar, 
  Building2, 
  FileText, 
  // Filter,
  Search,
  // MoreVertical,
  ExternalLink,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
// This is a utility function to generate job slugs
import { generateJobSlug } from '@/lib/utils';


interface MyApplicationsTableProps {
  applications: ApplicationViewData[];
}

// Define the type for your actual badge variants if different from shadcn defaults
type BadgeVariant = "default" | "secondary" | "destructive" | "outline" | null | undefined;

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

const getStatusIcon = (status: ApplicationStatusOption) => {
  switch (status) {
    case 'SUBMITTED': return <Clock className="w-3 h-3" />;
    case 'VIEWED': return <Eye className="w-3 h-3" />;
    case 'INTERVIEWING': return <AlertCircle className="w-3 h-3" />;
    case 'OFFERED': return <CheckCircle className="w-3 h-3" />;
    case 'HIRED': return <CheckCircle className="w-3 h-3" />;
    case 'REJECTED': return <XCircle className="w-3 h-3" />;
    default: return <Clock className="w-3 h-3" />;
  }
};

const formatApplicationStatusText = (status: ApplicationStatusOption): string => {
  return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
};

const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  } catch {
    return dateString;
  }
};

export default function MyApplicationsTable({ applications }: MyApplicationsTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<ApplicationStatusOption | 'ALL'>('ALL');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  if (!applications || applications.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto w-24 h-24 mb-4 rounded-full bg-gray-100 flex items-center justify-center">
          <FileText className="w-10 h-10 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Applications Yet</h3>
        <p className="text-gray-500 mb-6">Start applying to jobs to see your applications here.</p>
        <Button asChild>
          <Link href="/jobs">Browse Jobs</Link>
        </Button>
      </div>
    );
  }

  // Filter applications based on search and status
  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.companyName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || app.applicationStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statusOptions: (ApplicationStatusOption | 'ALL')[] = [
    'ALL', 'SUBMITTED', 'VIEWED', 'INTERVIEWING', 'OFFERED', 'HIRED', 'REJECTED'
  ];

  return (
    <div className="space-y-6">
      {/* Header with Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search applications..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as ApplicationStatusOption | 'ALL')}
            className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          >
            {statusOptions.map(status => (
              <option key={status} value={status}>
                {status === 'ALL' ? 'All Status' : formatApplicationStatusText(status)}
              </option>
            ))}
          </select>
          
          <div className="flex border border-gray-200 rounded-lg p-1">
            <Button
              variant={viewMode === 'table' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('table')}
              className="hidden sm:flex"
            >
              Table
            </Button>
            <Button
              variant={viewMode === 'cards' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('cards')}
              className="sm:hidden"
            >
              Cards
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-500" />
            <div>
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-2xl font-bold">{applications.length}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-yellow-500" />
            <div>
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-2xl font-bold">
                {applications.filter(app => ['SUBMITTED', 'VIEWED'].includes(app.applicationStatus)).length}
              </p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-orange-500" />
            <div>
              <p className="text-sm text-gray-600">Interviewing</p>
              <p className="text-2xl font-bold">
                {applications.filter(app => app.applicationStatus === 'INTERVIEWING').length}
              </p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <div>
              <p className="text-sm text-gray-600">Success</p>
              <p className="text-2xl font-bold">
                {applications.filter(app => ['OFFERED', 'HIRED'].includes(app.applicationStatus)).length}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Mobile Cards View */}
      <div className="sm:hidden space-y-4">
        {filteredApplications.map((app) => (
          <Card key={app.applicationId} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <Link href={`/jobs/${generateJobSlug(app.jobId, app.jobTitle)}`} className="text-lg font-semibold text-blue-600 hover:text-blue-800">
                    {app.jobTitle}
                  </Link>
                  <div className="flex items-center gap-2 mt-1 text-gray-600">
                    <Building2 className="w-4 h-4" />
                    <span className="text-sm">{app.companyName}</span>
                  </div>
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <Link href={`/jobs/${app.jobId}`} target="_blank" rel="noopener noreferrer">

                    <ExternalLink className="w-4 h-4" />
                  </Link>
                </Button>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Calendar className="w-4 h-4" />
                  {formatDate(app.dateApplied)}
                </div>
                <Badge variant={getApplicationStatusBadgeVariant(app.applicationStatus)} className="flex items-center gap-1">
                  {getStatusIcon(app.applicationStatus)}
                  {formatApplicationStatusText(app.applicationStatus)}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Desktop Table View */}
      <div className="hidden sm:block">
        <Card>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="font-semibold">Job Title & Company</TableHead>
                  <TableHead className="font-semibold">Date Applied</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="font-semibold text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredApplications.map((app) => (
                  <TableRow key={app.applicationId} className="hover:bg-gray-50">
                    <TableCell className="py-4">
                      <div className="space-y-1">
                        <Link 
                          href={`/jobs/${generateJobSlug(app.jobId, app.jobTitle)}`}
                          className="text-lg font-semibold text-blue-600 hover:text-blue-800 block"
                        >
                          {app.jobTitle}
                        </Link>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Building2 className="w-4 h-4" />
                          <span className="text-sm">{app.companyName}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(app.dateApplied)}</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <Badge 
                        variant={getApplicationStatusBadgeVariant(app.applicationStatus)} 
                        className="flex items-center gap-1 w-fit"
                      >
                        {getStatusIcon(app.applicationStatus)}
                        {formatApplicationStatusText(app.applicationStatus)}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/jobs/${generateJobSlug(app.jobId, app.jobTitle)}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                            <Eye className="w-4 h-4" />
                            View Job
                          </Link>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {filteredApplications.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No applications match your search criteria.</p>
            </div>
          )}
        </Card>
      </div>

      {/* Table Caption */}
      <p className="text-sm text-gray-500 text-center">
        Showing {filteredApplications.length} of {applications.length} applications
      </p>
    </div>
  );
}